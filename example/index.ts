import { report } from '../src/index.js'

document.body.innerHTML = `
<pre>
    ${JSON.stringify(report(), null, 2)}
</pre>
`
