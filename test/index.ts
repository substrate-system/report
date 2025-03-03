import { test } from '@substrate-system/tapzero'
import { report } from '../src/index.js'

test('report', async t => {
    const data = report()
    t.ok(data.browser, 'should return the report data')
})
