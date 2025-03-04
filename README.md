# report
![tests](https://github.com/substrate-system/report/actions/workflows/nodejs.yml/badge.svg)
[![types](https://img.shields.io/npm/types/@substrate-system/report?style=flat-square)](README.md)
[![module](https://img.shields.io/badge/module-ESM%2FCJS-blue?style=flat-square)](README.md)
[![semantic versioning](https://img.shields.io/badge/semver-2.0.0-blue?logo=semver&style=flat-square)](https://semver.org/)
[![Common Changelog](https://nichoth.github.io/badge/common-changelog.svg)](./CHANGELOG.md)
[![install size](https://flat.badgen.net/packagephobia/install/@substrate-system/report?)](https://packagephobia.com/result?p=@substrate-system/report)
[![dependencies](https://img.shields.io/badge/dependencies-zero-brightgreen.svg?style=flat-square)](package.json)
[![license](https://img.shields.io/badge/license-Polyform_Non_Commercial-26bc71?style=flat-square)](LICENSE)


Get browser & OS info. Based on [keithws/browser-report](https://github.com/keithws/browser-report).

[See a live demo](https://substrate-system.github.io/report/)

<details><summary><h2>Contents</h2></summary>

<!-- toc -->

- [Install](#install)
- [Modules](#modules)
  * [ESM](#esm)
  * [Common JS](#common-js)
  * [pre-built JS](#pre-built-js)
- [Use](#use)

<!-- tocstop -->

</details>

## Install

```sh
npm i -S @substrate-system/report
```

## Modules
This exposes ESM and common JS via
[package.json `exports` field](https://nodejs.org/api/packages.html#exports).

### ESM
```js
import { report } from '@substrate-system/report'
```

### Common JS
```js
const { report } = require('@substrate-system/report')
```

### pre-built JS
This package exposes minified JS files too. Copy them to a location that is
accessible to your web server, then link to them in HTML.

#### copy
```sh
cp ./node_modules/@substrate-system/report/dist/index.min.js ./public/report.min.js
```

#### HTML
```html
<script type="module" src="./report.min.js"></script>
```

## Use

```js
import { report } from '@substrate-system/report'

report()
// => { browser: ... }
```


This will return an object like this:

```js
{
  "browser": {
    "name": "Chrome",
    "version": "133.0.0.0"
  },
  "viewport": {
    "width": 1074,
    "zoom": 1,
    "height": 587,
    "layout": {
      "width": 1074,
      "height": 587
    }
  },
  "cookies": true,
  "os": {
    "name": "macOS",
    "version": "10.15.7"
  },
  "screen": {
    "width": 1440,
    "height": 900,
    "colors": 30,
    "dppx": 2
  },
  "lang": [
    "en-US",
    "en"
  ],
  "timestamp": "Sun Mar 02 2025 22:47:36 GMT-0800 (Pacific Standard Time)"
}
```
