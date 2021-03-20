console.log('FreeTON injector')

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
        console.error('FreeTON: injector failed', error);
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
        console.error('FreeTON: injector failed', error);
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
        console.error('FreeTON: injector failed', error);
    }
}

//Inject TONCLient
injectScriptUrl(browser.extension.getURL("ton-client/main.js"));

//Set FreeTON binary url
evalScript(`window.tonWasmUrl = "${browser.extension.getURL("ton-client/tonclient.wasm")}"`);

//Thridrparty modules
injectModuleUrl(browser.extension.getURL("modules/thirdparty/eventemitter3.min.js"));

//Start Freeton provider
injectModuleUrl(browser.extension.getURL("freetonProvider.js"));
