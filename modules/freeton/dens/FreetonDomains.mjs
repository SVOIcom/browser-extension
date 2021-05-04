/*
  _____ ___  _   ___        __    _ _      _
 |_   _/ _ \| \ | \ \      / /_ _| | | ___| |_
   | || | | |  \| |\ \ /\ / / _` | | |/ _ \ __|
   | || |_| | |\  | \ V  V / (_| | | |  __/ |_
   |_| \___/|_| \_|  \_/\_/ \__,_|_|_|\___|\__|

 */
/**
 * @name FreeTON browser wallet and injector
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */

browser.webRequest.onBeforeRequest.addListener(function (details) {
        console.log('REQUEST DETAILS', details);

        if(details.url.includes('fromFreetonBorwser')){
            return {};
        }

        return {redirectUrl: browser.extension.getURL("freetonBrowser.html") + '#' + encodeURIComponent(details.url)};
    },
    {urls: ["*://*.freeton/*", "*://*.ton/*", "*://*.live/*",]},
    ["blocking"]
);


export default {};