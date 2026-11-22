// Shared ReValue email frame: header with logo, a white content card and the company footer.
// Built with tables and inline styles because email apps (Gmail, Outlook) ignore most CSS.
// Every email that uses it should also send a plain-text version.

export const emailColors = {
  page: '#F3F4F1',
  card: '#FFFFFF',
  deep: '#173B2E',
  forest: '#1F5D42',
  text: '#2B372F',
  muted: '#5A665E',
  line: '#E3E6E1',
  soft: '#F6F7F4',
  accent: '#5DAE3E',
}

const font = "'Source Sans 3','Segoe UI',Helvetica,Arial,sans-serif"

/** Escape anything a visitor typed before it goes into HTML. */
export const escapeHTML = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

export const siteOrigin = () =>
  (process.env.SITE_URL || 'https://www.revalue.africa').replace(/\/+$/, '')

export function emailButton(
  label: string,
  href: string,
  kind: 'primary' | 'secondary' = 'primary',
) {
  const primary = kind === 'primary'
  return `<a href="${escapeHTML(href)}" style="display:inline-block;margin:0 8px 8px 0;padding:12px 20px;border-radius:4px;font-family:${font};font-size:15px;font-weight:600;line-height:1;text-decoration:none;${
    primary
      ? `background:${emailColors.forest};color:#FFFFFF;border:1px solid ${emailColors.forest};`
      : `background:#FFFFFF;color:${emailColors.forest};border:1px solid ${emailColors.forest};`
  }">${escapeHTML(label)}</a>`
}

export function emailLayout({
  preheader,
  body,
  footerNote,
  unsubscribeURL,
}: {
  /** Short summary shown next to the subject in the inbox list. */
  preheader: string
  /** Inner HTML for the white card. Escape visitor input with escapeHTML. */
  body: string
  /** Optional line above the company footer, e.g. why the reader got this email. */
  footerNote?: string
  /** Required for newsletters and other bulk email. */
  unsubscribeURL?: string
}) {
  const origin = siteOrigin()
  const c = emailColors
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>ReValue</title>
</head>
<body style="margin:0;padding:0;background:${c.page};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${c.page};">${escapeHTML(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${c.page};">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">
<tr><td style="padding:20px 28px;background:${c.card};border-bottom:3px solid ${c.accent};border-radius:8px 8px 0 0;">
<a href="${origin}" style="text-decoration:none;color:${c.deep};">
<img src="${origin}/email/revalue-mark.png" width="36" height="36" alt="" style="display:inline-block;vertical-align:middle;border:0;">
<span style="display:inline-block;vertical-align:middle;margin-left:10px;font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:600;color:${c.deep};">ReValue</span>
</a>
</td></tr>
<tr><td style="padding:28px;background:${c.card};border-radius:0 0 8px 8px;font-family:${font};font-size:16px;line-height:1.55;color:${c.text};">
${body}
</td></tr>
<tr><td style="padding:20px 28px;font-family:${font};font-size:13px;line-height:1.5;color:${c.muted};text-align:center;">
${footerNote ? `<p style="margin:0 0 8px;">${footerNote}</p>` : ''}
<p style="margin:0 0 8px;">ReValue is operated by Simuverse Limited, Kampala, Uganda.</p>
<p style="margin:0;"><a href="${origin}" style="color:${c.forest};">revalue.africa</a>${
    unsubscribeURL
      ? ` · <a href="${escapeHTML(unsubscribeURL)}" style="color:${c.forest};">Unsubscribe</a>`
      : ''
  }</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`
}

/** A label/value row for detail cards. Values must already be escaped HTML. */
export const emailDetailRow = (label: string, valueHTML: string) =>
  `<tr><td style="padding:8px 12px 8px 0;width:120px;vertical-align:top;font-size:14px;color:${emailColors.muted};">${escapeHTML(label)}</td><td style="padding:8px 0;vertical-align:top;font-size:15px;color:${emailColors.text};">${valueHTML}</td></tr>`
