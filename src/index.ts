export type Report = {
    viewport:{
        width:number;
        height:number;
        layout: { width:number; height:number; };
    }
    browser:{
        name:string
    },
    cookies,
    os,
    screen:{ width:number; height:number; colors; dppx; };
    lang:readonly string[];
    timestamp:string;
}

export function report (userAgent?:Navigator['userAgent']):Report {
    userAgent = userAgent || navigator.userAgent

    const browser:{ name:string, version?:string } = { name: '', version: '' }
    const os:{ name:string; version:string|null } = { name: '', version: null }
    const screenData:{
        width:number;
        height:number;
        colors:number;
        dppx:number;
    } = { width: 0, height: 0, colors: 0, dppx: 0 }

    // extract browser name from user agent
    if (userAgent.indexOf('Trident') >= 0 || userAgent.indexOf('MSIE') >= 0) {
        if (userAgent.indexOf('Mobile') >= 0) {
            browser.name = 'IE Mobile'
        } else {
            browser.name = 'Internet Explorer'
        }
    }

    if (userAgent.indexOf('Firefox') >= 0 && userAgent.indexOf('Seamonkey') === -1) {
        if (userAgent.indexOf('Android') >= 0) {
            browser.name = 'Firefox for Android'
        } else {
            browser.name = 'Firefox'
        }
    }

    if (
        userAgent.indexOf('Safari') >= 0 &&
        userAgent.indexOf('Chrome') === -1 &&
        userAgent.indexOf('Chromium') === -1 &&
        userAgent.indexOf('Android') === -1
    ) {
        if (userAgent.indexOf('CriOS') >= 0) {
            browser.name = 'Chrome for iOS'
        } else if (userAgent.indexOf('FxiOS') >= 0) {
            browser.name = 'Firefox for iOS'
        } else {
            browser.name = 'Safari'
        }
    }

    if (userAgent.indexOf('Chrome') >= 0) {
        if (userAgent.match(/\bChrome\/[.0-9]* Mobile\b/)) {
            if (
                userAgent.match(/\bVersion\/\d+\.\d+\b/) ||
                userAgent.match(/\bwv\b/)
            ) {
                browser.name = 'WebView on Android'
            } else {
                browser.name = 'Chrome for Android'
            }
        } else {
            browser.name = 'Chrome'
        }
    }

    if (
        userAgent.indexOf('Android') >= 0 &&
        userAgent.indexOf('Chrome') === -1 &&
        userAgent.indexOf('Chromium') === -1 &&
        userAgent.indexOf('Trident') === -1 &&
        userAgent.indexOf('Firefox') === -1
    ) {
        browser.name = 'Android Browser'
    }

    if (userAgent.indexOf('Edge') >= 0) {
        browser.name = 'Edge'
    }

    if (userAgent.indexOf('UCBrowser') >= 0) {
        browser.name = 'UC Browser for Android'
    }

    if (userAgent.indexOf('SamsungBrowser') >= 0) {
        browser.name = 'Samsung Internet'
    }

    if (userAgent.indexOf('OPR') >= 0 || userAgent.indexOf('Opera') >= 0) {
        if (userAgent.indexOf('Opera Mini') >= 0) {
            browser.name = 'Opera Mini'
        } else if (
            userAgent.indexOf('Opera Mobi') >= 0 ||
            userAgent.indexOf('Opera Tablet') >= 0 ||
            userAgent.indexOf('Mobile') >= 0
        ) {
            browser.name = 'Opera Mobile'
        } else {
            browser.name = 'Opera'
        }
    }

    if (
        userAgent.indexOf('BB10') >= 0 ||
        userAgent.indexOf('PlayBook') >= 0 ||
        userAgent.indexOf('BlackBerry') >= 0
    ) {
        browser.name = 'BlackBerry'
    }

    if (userAgent.indexOf('MQQBrowser') >= 0) {
        browser.name = 'QQ Browser'
    }

    // extract browser version number from user agent
    let match:RegExpMatchArray|null = null

    switch (browser.name) {
        case 'Chrome':
        case 'Chrome for Android':
        case 'WebView on Android':
            match = userAgent.match(/Chrome\/((\d+\.)+\d+)/)
            break
        case 'Firefox':
        case 'Firefox for Android':
            match = userAgent.match(/Firefox\/((\d+\.)+\d+)/)
            break
        case 'Firefox for iOS':
            match = userAgent.match(/FxiOS\/((\d+\.)+\d+)/)
            break
        case 'Edge':
        case 'Internet Explorer':
        case 'IE Mobile':

            if (userAgent.indexOf('Edge') >= 0) {
                match = userAgent.match(/Edge\/((\d+\.)+\d+)/)
            } else if (userAgent.indexOf('rv:11') >= 0) {
                match = userAgent.match(/rv:((\d+\.)+\d+)/)
            } else if (userAgent.indexOf('MSIE') >= 0) {
                match = userAgent.match(/MSIE ((\d+\.)+\d+)/)
            }

            break
        case 'Safari':
            match = userAgent.match(/Version\/((\d+\.)+\d+)/)
            break
        case 'Android Browser':
            match = userAgent.match(/Android ((\d+\.)+\d+)/)
            break
        case 'UC Browser for Android':
            match = userAgent.match(/UCBrowser\/((\d+\.)+\d+)/)
            break
        case 'Samsung Internet':
            match = userAgent.match(/SamsungBrowser\/((\d+\.)+\d+)/)
            break
        case 'Opera Mini':
            match = userAgent.match(/Opera Mini\/((\d+\.)+\d+)/)
            break
        case 'Opera':
            if (userAgent.match(/OPR/)) {
                match = userAgent.match(/OPR\/((\d+\.)+\d+)/)
            } else if (userAgent.match(/Version/)) {
                match = userAgent.match(/Version\/((\d+\.)+\d+)/)
            } else {
                match = userAgent.match(/Opera\/((\d+\.)+\d+)/)
            }
            break
        case 'BlackBerry':
            match = userAgent.match(/Version\/((\d+\.)+\d+)/)
            break
        case 'QQ Browser':
            match = userAgent.match(/MQQBrowser\/((\d+\.)+\d+)/)
            break
        default:
            match = userAgent.match(/\/((\d+\.)+\d+)$/)
            break
    }

    if (match && match[1]) {
        browser.version = match[1]
    }

    const viewport:{
        width:number;
        height:number;
        zoom:number;
        layout: { width:number; height:number; };
    } = { width: 0, zoom: 0, height: 0, layout: { width: 0, height: 0 } }

    // browser window size from the visual viewport
    viewport.width = window.innerWidth || document.documentElement.clientWidth
    viewport.height = window.innerHeight || document.documentElement.clientHeight

    // raw values for layout viewport
    viewport.layout.width = document.documentElement.clientWidth
    viewport.layout.height = document.documentElement.clientHeight

    // define viewport zoom property
    viewport.zoom = viewport.layout.width / viewport.width

    let cookies = false

    // are cookies enabled
    // can't trust this value (Microsoft Edge lies)
    cookies = !!navigator.cookieEnabled

    // extract operating system name from user agent
    if (userAgent.indexOf('Windows') >= 0) {
        if (userAgent.indexOf('Windows Phone') >= 0) {
            os.name = 'Windows Phone'
        } else {
            os.name = 'Windows'
        }
    }

    if (userAgent.indexOf('OS X') >= 0 && userAgent.indexOf('Android') === -1) {
        os.name = 'OS X'
    }

    if (userAgent.indexOf('Linux') >= 0) {
        os.name = 'Linux'
    }

    if (userAgent.indexOf('like Mac OS X') >= 0) {
        os.name = 'iOS'
    }

    if ((userAgent.indexOf('Android') >= 0 || userAgent.indexOf('Adr') >= 0) && userAgent.indexOf('Windows Phone') === -1) {
        os.name = 'Android'
    }

    if (userAgent.indexOf('BB10') >= 0) {
        os.name = 'BlackBerry'
    }

    if (userAgent.indexOf('RIM Tablet OS') >= 0) {
        os.name = 'BlackBerry Tablet OS'
    }

    if (userAgent.indexOf('BlackBerry') >= 0) {
        os.name = 'BlackBerryOS'
    }

    if (userAgent.indexOf('CrOS') >= 0) {
        os.name = 'Chrome OS'
    }

    if (userAgent.indexOf('KAIOS') >= 0) {
        os.name = 'KaiOS'
    }

    // extract operating system version from user agent
    match = null

    switch (os.name) {
        case 'Windows':
        case 'Windows Phone':
            if (userAgent.indexOf('Win16') >= 0) {
                os.version = '3.1.1'
            } else if (userAgent.indexOf('Windows CE') >= 0) {
                os.version = 'CE'
            } else if (userAgent.indexOf('Windows 95') >= 0) {
                os.version = '95'
            } else if (userAgent.indexOf('Windows 98') >= 0) {
                if (userAgent.indexOf('Windows 98; Win 9x 4.90') >= 0) {
                    os.version = 'Millennium Edition'
                } else {
                    os.version = '98'
                }
            } else {
                match = userAgent.match(/Win(?:dows)?(?: Phone)?[ _]?(?:(?:NT|9x) )?((?:(\d+\.)*\d+)|XP|ME|CE)\b/)

                if (match && match[1]) {
                    switch (match[1]) {
                        case '6.4':
                            // some versions of Firefox mistakenly used 6.4
                            match[1] = '10.0'
                            break
                        case '6.3':
                            match[1] = '8.1'
                            break
                        case '6.2':
                            match[1] = '8'
                            break
                        case '6.1':
                            match[1] = '7'
                            break
                        case '6.0':
                            match[1] = 'Vista'
                            break
                        case '5.2':
                            match[1] = 'Server 2003'
                            break
                        case '5.1':
                            match[1] = 'XP'
                            break
                        case '5.01':
                            match[1] = '2000 SP1'
                            break
                        case '5.0':
                            match[1] = '2000'
                            break
                        case '4.0':
                            match[1] = '4.0'
                            break
                        default:
                            // nothing
                            break
                    }
                }
            }
            break
        case 'OS X':
            match = userAgent.match(/OS X ((\d+[._])+\d+)\b/)
            break
        case 'Linux':
            // linux user agent strings do not usually include the version
            os.version = null
            break
        case 'iOS':
            match = userAgent.match(/OS ((\d+[._])+\d+) like Mac OS X/)
            break
        case 'Android':
            match = userAgent.match(/(?:Android|Adr) (\d+([._]\d+)*)/)
            break
        case 'BlackBerry':
        case 'BlackBerryOS':
            match = userAgent.match(/Version\/((\d+\.)+\d+)/)
            break
        case 'BlackBerry Tablet OS':
            match = userAgent.match(/RIM Tablet OS ((\d+\.)+\d+)/)
            break
        case 'Chrome OS':
            os.version = browser.version || null
            break
        case 'KaiOS':
            match = userAgent.match(/KAIOS\/(\d+(\.\d+)*)/)
            break
        default:
        // no good default behavior
            os.version = null
            break
    }

    if (match && match[1]) {
        // replace underscores in version number with periods
        match[1] = match[1].replace(/_/g, '.')
        os.version = match[1]
    }

    // handle Mac OS X / OS X / macOS naming conventions
    if (os.name === 'OS X' && os.version) {
        const versions = os.version.split('.')
        if (versions.length >= 2) {
            const minorVersion = parseInt(versions[1], 10)
            if (minorVersion <= 7) {
                os.name = 'Mac OS X'
            } else if (minorVersion >= 12) {
                os.name = 'macOS'
            } else {
                os.name = 'OS X'
            }
        }
    }

    // screen info from W3C standard properties
    screenData.width = screen.width
    screenData.height = screen.height
    screenData.colors = screen.colorDepth
    if (window.devicePixelRatio && !isNaN(window.devicePixelRatio)) {
        screenData.dppx = window.devicePixelRatio
    } else {
        screenData.dppx = 1
    }

    // preferred language(s) for displaying pages
    const lang = navigator.languages || navigator.language

    // local date, time, and time zone
    const timestamp = (new Date()).toString()

    return {
        browser,
        viewport,
        cookies,
        os,
        screen: screenData,
        lang,
        timestamp
    }
}
