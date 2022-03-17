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


/*setTimeout(()=>{
    console.log('MODIFY FREETON');
    let _ = window.freeton.request;
    window.freeton.request = async function(t,e){console.log(t,e); let result = await _(t,e); console.log('RESULT',result); return result; }

}, 4)*/


window._tonClient = null;

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
    if(window._tonClient) {
        return window._tonClient;
    }
    if(window.tonWasmUrl) {
        try {
            window.TONClient.setWasmOptions({binaryURL: window.tonWasmUrl});
        }catch (e) {
        }
    }
    let freeton = await (new TonClientWrapper()).create({
        servers: ['net.ton.dev']
    });

    window._tonClient = freeton;

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
        }catch (e) {
        }
    }
    let freeton = await (new NewTonClientWrapper()).create();

    window._tonNewClient = freeton;

    return freeton;
}

window.addEventListener('load', async () => {

    //Trying setup TON WASM client
    try{
        window.TONClient.setWasmOptions({binaryURL: window.tonWasmUrl});
    } catch {}

    try {
        //Setup new FreeTON library
        tonclientWeb.libWebSetup({
            binaryURL: window.tonNewWasmUrl,
        });
        tonclientWeb.TonClient.useBinaryLibrary(tonclientWeb.libWeb);
    }catch (e) {
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


});

window._emulateExtratonAccepted = null;
if(typeof window.freeton === 'undefined') {
    window.freeton = {
        request: async (method, params) => {
            let accept;
            if(!window._emulateExtratonAccepted) {
                accept = confirm('TONWallet detects requests to extraTON extension. TONWallet can emulate extraTON for some cases. \n \nAllow emulation?');
            }

            if(accept || window._emulateExtratonAccepted) {
                window._emulateExtratonAccepted = true;
                const ExtraTONEmulationProxy = (await import("./modules/ExtraTONEmulationProxy.mjs")).default;

                await ExtraTONEmulationProxy.init();

                window.freeton = ExtraTONEmulationProxy;
                return await ExtraTONEmulationProxy.request(method, params);

            } else {
                window._emulateExtratonAccepted = false;

                window.freeton = undefined;
            }
        }
    };
}

window.__hasEverscaleProvider = true;

window._emulateCrystalAccepted = null;
if(typeof window.ton === 'undefined') {

    const CrystalWalletEmulationProxy = (await import("./modules/CrystalWalletEmulationProxy.mjs")).default;

    window.ton = CrystalWalletEmulationProxy;




    window._notProxiedRequest =  window.ton.request;


    window._emulateCrystalAccepted = true;
    window.ton.request = async (request) => {
            let accept;
            if(!window._emulateCrystalAccepted) {
                accept = confirm('TONWallet detects requests to CrystalWallet extension. TONWallet can emulate CrystalWallet for some cases. \n \nAllow emulation?');
            }

            if(accept || window._emulateCrystalAccepted) {
                console.log('Crystal wallet emulation allowed. Redirect request ', request)
                window._emulateCrystalAccepted = true;
                await CrystalWalletEmulationProxy.init();

                window.ton.request = window._notProxiedRequest;

                return await  window._notProxiedRequest(request);
            } else {
                window._emulateCrystalAccepted = false;

                window.ton = undefined;
            }
        }

}

