import type { CollectionBeforeOperationHook, CollectionBeforeChangeHook } from 'payload'
import { fileTypeFromBuffer } from 'file-type'
import { readFile } from 'node:fs/promises'
import { S3Client, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
export const validateUpload: CollectionBeforeOperationHook = async ({ args, operation, req }) => {
  if ((operation !== 'create' && operation !== 'update') || !req.file) return args
  const file = req.file
  if (file.size > 15 * 1024 * 1024) throw new Error('Files must be 15 MB or smaller.')
  const bytes = file.data?.length
    ? file.data
    : file.tempFilePath
      ? await readFile(file.tempFilePath)
      : undefined
  if (!bytes) throw new Error('The upload could not be validated.')
  await validateBytes(bytes, file.mimetype)
  return args
}
async function validateBytes(bytes: Uint8Array, mime: string) {
  const detected = await fileTypeFromBuffer(bytes)
  const allowed = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ]
  if (mime === 'text/csv') {
    const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes)
    if (/\x00|<\s*(?:script|html|svg|iframe)\b/i.test(text) || detected)
      throw new Error('Upload a plain UTF-8 CSV file.')
  } else if (!detected || !allowed.includes(detected.mime) || detected.mime !== mime) {
    throw new Error('The actual file type must match a supported image, PDF or Excel workbook.')
  }
}
export const validateCloudUpload: CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
  collection,
  req,
}) => {
  if (req.file?.data?.length) return data
  if (!process.env.S3_BUCKET || !data.filename || data.filename === originalDoc?.filename)
    return data
  if (data.prefix && data.prefix !== collection.slug)
    throw new Error('Use the collection media folder.')
  if (!/^[^/\\]+$/.test(data.filename)) throw new Error('Invalid upload filename.')
  const client = new S3Client({
    region: process.env.S3_REGION || 'auto',
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    },
  })
  const key = `${collection.slug}/${data.filename}`
  try {
    const object = await client.send(
      new GetObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key }),
      { abortSignal: AbortSignal.timeout(15000) },
    )
    if (!object.Body || !object.ContentLength || object.ContentLength > 15 * 1024 * 1024)
      throw new Error('Files must be 15 MB or smaller.')
    const chunks: Uint8Array[] = []
    let length = 0
    for await (const chunk of object.Body as AsyncIterable<Uint8Array>) {
      length += chunk.length
      if (length > 15 * 1024 * 1024) throw new Error('File too large.')
      chunks.push(chunk)
    }
    await validateBytes(Buffer.concat(chunks), data.mimeType || object.ContentType || '')
  } catch {
    await client
      .send(new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key }))
      .catch(() => {})
    throw new Error('The cloud upload could not be validated. Upload a supported file again.')
  } finally {
    client.destroy()
  }
  return data
}
