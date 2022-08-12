/**
 * @name ScaleWallet - Everscale browser wallet and injector
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */

console.log('HELLO INJECTOR');

const CONFIG_REQUEST_ID = Math.random();

//Polyfilling
if(!browser.extension.getURL) {
    browser.extension.getURL = (url) => {
        return chrome.runtime.getURL(url);
    }
}

//Message proxy
window.addEventListener("message", function (event) {
    // We only accept messages from ourselves
    if(event.source != window) {
        return;
    }

    //Outcome RPC to page
    if(event.data.method  /*&& (event.data.type == "FROM_PAGE")*/) {
        browser.runtime.sendMessage({...event.data, sender: 'page', senderMore: {url: window.location}});
    }
});

//Income from extension
browser.runtime.onMessage.addListener(async (msg, sender) => {
    if(msg.target === '*') {
        window.postMessage(msg, "*");
    }

    //If we receive config response
    if(msg.requestId && msg.requestId === CONFIG_REQUEST_ID) {
        //evalScript(msg.result);
    }
});


/**
 * Inject script by url
 * @param urlExt
 */
function injectScriptUrl(urlExt) {
    try {
        const container = document.head || document.documentElement;
        const scriptTag = document.createElement('script');
        scriptTag.setAttribute('async', 'false');
        scriptTag.setAttribute('src', urlExt);
        container.insertBefore(scriptTag, container.children[0]);
        container.removeChild(scriptTag);
    } catch (error) {
        console.error('EverscaleWallet: injector failed', error);
    }
}

/**
 * Inject script by url
 * @param urlExt
 */
function injectModuleUrl(urlExt) {
    try {
        const container = document.head || document.documentElement;
        const scriptTag = document.createElement('script');
        scriptTag.setAttribute('async', 'false');
        scriptTag.setAttribute('src', urlExt);
        scriptTag.setAttribute('type', 'module');
        container.insertBefore(scriptTag, container.children[0]);
        container.removeChild(scriptTag);
    } catch (error) {
        console.error('EverscaleWallet: injector failed', error);
    }
}

/**
 * Eval script on page
 * @param source
 */
function evalScript(source) {
    try {
        const container = document.head || document.documentElement;
        const scriptTag = document.createElement('script');
        scriptTag.setAttribute('async', 'false');
        scriptTag.textContent = source;
        container.insertBefore(scriptTag, container.children[0]);
        container.removeChild(scriptTag);
    } catch (error) {
        console.error('EverscaleWallet: injector failed', error);
    }
}


//Inject TONCLient
injectScriptUrl(browser.extension.getURL("ton-client/main.js"));

//Inject new TON lib
injectScriptUrl(browser.extension.getURL("ever-sdk-js/main.js"));

//Set Everscale binary url
//evalScript(`window.tonWasmUrl = "${browser.extension.getURL("ton-client/tonclient.wasm")}"`);

//Set new Everscale binary url
//evalScript(`window.tonNewWasmUrl = "${browser.extension.getURL("ever-sdk-js/eversdk.wasm")}"`);

const container =  document.documentElement;
const inputTag = document.createElement('input');
inputTag.setAttribute('type', 'hidden');
inputTag.setAttribute('id', 'scaleWalletConfigure');
inputTag.value = JSON.stringify({
    tonWasmUrl: browser.extension.getURL("ton-client/tonclient.wasm"),
    tonNewWasmUrl: browser.extension.getURL("ever-sdk-js/eversdk.wasm")
});
container.insertBefore(inputTag, container.children[0]);


//Thridrparty modules
injectModuleUrl(browser.extension.getURL("modules/thirdparty/eventemitter3.min.js"));

//Start Everscale provider
injectModuleUrl(browser.extension.getURL("everscaleProvider.js"));


//Get configuring script
try {
    browser.runtime.sendMessage({
        rpc: true,
        requestId: CONFIG_REQUEST_ID,
        target: 'background',
        method: 'main_getConfigScript',
        params: [],
        sender: 'page',
        senderMore: {url: window.location}
    });
} catch (e) {
    console.log(e);
}