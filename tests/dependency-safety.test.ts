import test from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
const payloadRequire = createRequire(import.meta.resolve('payload'))
const entry = payloadRequire.resolve('deepmerge')
for (const filename of [entry, join(dirname(entry), 'umd.js')]) {
  test(`patched deepmerge rejects prototype keys in ${filename.split(/[\\/]/).pop()}`, () => {
    const merge = payloadRequire(filename)
    const input = JSON.parse(
      '{"__proto__":{"poisoned":true},"constructor":{"prototype":{"poisoned":true}},"nested":{"__proto__":{"poisoned":true},"safe":2}}',
    )
    for (const result of [
      merge(input, { safe: 1 }),
      merge({}, input),
      merge.all([input, { safe: 1 }]),
    ]) {
      assert.equal(result.poisoned, undefined)
      assert.equal(result.nested.poisoned, undefined)
      assert.equal(Object.getPrototypeOf(result), Object.prototype)
      assert.equal(result.nested.safe, 2)
      assert.equal(Object.hasOwn(result, 'constructor'), false)
    }
  })
}
