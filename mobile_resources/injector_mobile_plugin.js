/**
 * @name ScaleWallet - Everscale browser wallet and injector
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */

console.log('HELLO INJECTOR PLUGIN MOBILE');

(() => {
    const CONFIG_REQUEST_ID = Math.random();


    //Message proxy
    window.addEventListener("message", function (event) {

         console.log('PLUGIN INCOME MSG', event.data);

        // We only accept messages from ourselves
        if(event.source != window) {
            return;
        }

        //Outcome RPC to page
        if(event.data.method) {
            window.parent.postMessage({...event.data, sender: 'page'}, "*");
            try{
                cordova_iab.postMessage(JSON.stringify({...event.data, sender: 'page', senderMore: {url: window.location}}))
            }catch (e) {
            }

            try{
                window.webkit.messageHandlers.cordova_iab.postMessage(JSON.stringify({...event.data, sender: 'page', senderMore: {url: window.location}}))
            }catch (e) {
            }
            //cordova_iab.postMessage(JSON.stringify({...event.data, sender: 'page', senderMore: {url: window.location}}))
        }
    });

    window._injectorMessageReceiver = (msg) => {
        //console.log('INJECTOR RECEIVED MESSAGE', msg);
        if(typeof msg === 'string') {
            msg = JSON.parse(msg);
        }

        if(msg.target === '*' || msg.target === 'page') {
            window.postMessage(msg, "*");
        }

        //If we receive config response
        if(msg.requestId && msg.requestId === CONFIG_REQUEST_ID) {
            evalScript(msg.result);
        }
    }

    //Income from extension
    /*browser.runtime.onMessage.addListener(async (msg, sender) => {
        if(msg.target === '*') {
            window.postMessage(msg, "*");
        }

        //If we receive config response
        if(msg.requestId && msg.requestId === CONFIG_REQUEST_ID) {
            evalScript(msg.result);
        }
    });*/


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

    //test

//Inject TONCLient
    injectScriptUrl("https://plugins.scalewallet.com/browser-extension/ton-client/main.js");

//Inject new TON lib
    injectScriptUrl("https://plugins.scalewallet.com/browser-extension/ever-sdk-js/main.js");

//Set Everscale binary url
    evalScript(`window.tonWasmUrl = "https://plugins.scalewallet.com/browser-extension/ton-client/tonclient.wasm";`);

//Set new Everscale binary url
    evalScript(`window.tonNewWasmUrl = "https://plugins.scalewallet.com/browser-extension/ever-sdk-js/eversdk.wasm";`);

//Thridrparty modules
    injectScriptUrl("https://plugins.scalewallet.com/browser-extension/modules/thirdparty/eventemitter3.min.js");

//Start Everscale provider
    injectModuleUrl("https://plugins.scalewallet.com/browser-extension/everscaleProvider.js");


    //Pre init
   let timeout =  setTimeout(() => {
        if(!window.getTON) {
            try {
                window._initEverscaleProvider();
            } catch (error) {}
        }else{
            clearTimeout(timeout);
        }
    }, 100);


})();