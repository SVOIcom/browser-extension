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


//TODO TEMP
/*setTimeout(()=>{
    console.log('MODIFY FREETON');
    let _ = window.freeton.request;
    window.freeton.request = async function(t,e){console.log(t,e); let result = await _(t,e); console.log('RESULT',result); return result; }

}, 4)*/


window._tonClient = null;

/**
 * Get FreeTON provider
 * @returns {Promise<null|TonClientWrapper|*>}
 */
async function getTON() {
    const TonClientWrapper = (await import("./modules/TonClientWrapper.mjs")).default;
    if(window._tonClient) {
        return window._tonClient;
    }
    if(window.tonWasmUrl) {
        window.TONClient.setWasmOptions({binaryURL: window.tonWasmUrl});
    }
    let freeton = await (new TonClientWrapper()).create({
        servers: ['net.ton.dev']
    });

    window._tonClient = freeton;

    return freeton;
}

window.addEventListener('load', async () => {

    //Trying setup TON WASM client
    window.TONClient.setWasmOptions({binaryURL: window.tonWasmUrl});

    if(typeof window.getTON === 'undefined') {
        window.getTON = getTON;
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

