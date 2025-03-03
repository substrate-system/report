import { type FunctionComponent, render } from 'preact'
import { html } from 'htm/preact'
import Debug from '@substrate-system/debug'
import { report } from '../src/index.js'
const debug = Debug()

const data = report()
debug('the report', data)

const Example:FunctionComponent<unknown> = function () {
    return html`<div>
        <pre>
            ${JSON.stringify(data, null, 2)}
        </pre>
    </div>`
}

render(html`<${Example} />`, document.getElementById('root')!)
