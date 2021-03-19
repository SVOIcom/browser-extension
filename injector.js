console.log('FreeTON injector')

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


injectScriptUrl(browser.extension.getURL("ton-client/main.js"));
evalScript(`window.tonWasmUrl = "${browser.extension.getURL("ton-client/tonclient.wasm")}"`);
injectScriptUrl(browser.extension.getURL("freetonProvider.js"));
