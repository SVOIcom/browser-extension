/**
 * @name Everscale Wallet - Everscale browser wallet and injector
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */

//console.log('HELLO EVERSCALE PROVIDER');

window._everClient = null;

/**
 * Get FreeTON provider
 * @deprecated
 * @returns {Promise<null|TonClientWrapper|*>}
 */
async function getTON() {
    console.log('Deprecated: Direct invoke getTON method is deprecated and will be removed in future versions. Use getTONWeb or getTONClient')
    return await getTONWeb();
}

/**
 * Get FreeTON provider
 * @returns {Promise<null|TonClientWrapper|*>}
 */
async function getTONWeb() {
    const TonClientWrapper = (await import("./modules/TonClientWrapper.mjs")).default;
    if(window._everClient) {
        return window._everClient;
    }
    if(window.tonWasmUrl) {
        try {
            window.TONClient.setWasmOptions({binaryURL: window.tonWasmUrl});
        } catch (e) {
        }
    }
    let freeton = await (new TonClientWrapper()).create({
        servers: ['net.ton.dev']
    });

    window._everClient = freeton;

    return freeton;
}

/**
 * Get TON client instance
 * @returns {Promise<TonClientWrapper>}
 */
async function getTONClient() {
    const NewTonClientWrapper = (await import("./modules/NewTonClientWrapper.mjs")).default;
    if(window._tonNewClient) {
        return window._tonNewClient;
    }
    if(window.tonNewWasmUrl) {
        //Setup new FreeTON library
        try {
            tonclientWeb.libWebSetup({
                binaryURL: window.tonNewWasmUrl,
            });
            tonclientWeb.TonClient.useBinaryLibrary(tonclientWeb.libWeb);
        } catch (e) {
        }
    }
    let freeton = await (new NewTonClientWrapper()).create();

    window._tonNewClient = freeton;

    return freeton;
}

window._initEverscaleProvider = async () => {

    //Trying setup TON WASM client
    try {
        window.TONClient.setWasmOptions({binaryURL: window.tonWasmUrl});
    } catch (e) {
    }

    try {
        //Setup new FreeTON library
        tonclientWeb.libWebSetup({
            binaryURL: window.tonNewWasmUrl,
        });
        tonclientWeb.TonClient.useBinaryLibrary(tonclientWeb.libWeb);
    } catch (e) {
    }

    if(typeof window.getTON === 'undefined') {
        window.getTON = getTON;
    }

    if(typeof window.getTONWeb === 'undefined') {
        window.getTONWeb = getTONWeb;
    }

    if(typeof window.getTONClient === 'undefined') {
        window.getTONClient = getTONClient;
    }

    if(typeof window.getEver === 'undefined') {
        window.getEver = getTON;
    }

    if(typeof window.getEverWeb === 'undefined') {
        window.getEverWeb = getTONWeb;
    }

    if(typeof window.getEverClient === 'undefined') {
        window.getEverClient = getTONClient;
    }


};

window.addEventListener('load', window._initEverscaleProvider);


//EVERWallet emulation
if(window._everscaleWalletConfig && window._everscaleWalletConfig.EVERWalletEmulation) {
//Check if EVERWallet is not available
    if(!window.__hasEverscaleProvider) {
        window.__hasEverscaleProvider = true;
    }
    if(!window.hasTonProvider) {
        window.hasTonProvider = true;
    }

    if(typeof window.ton === 'undefined') {

        const EVERWalletEmulationProxy = (await import("./modules/EVERWalletEmulationProxy.mjs")).default;


        window.ton = EVERWalletEmulationProxy;
        if(!window.__ever) {
            window.__ever = window.ton;
        }


        window.addEventListener('load', async () => {
            await EVERWalletEmulationProxy.init();
        });


    }

}