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


//window.injected = true;

//import TonClientWrapper from "./modules/TonClientWrapper.mjs";

//console.log('Loading FreeTON provider');

window._tonClient = null;

/**
 * Get FreeTON provider
 * @returns {Promise<null|TonClientWrapper|*>}
 */
async function getTON() {
   const TonClientWrapper =  (await import("./modules/TonClientWrapper.mjs")).default;
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
    //try {
    //console.log(window.TONClient);
    //Trying setup TON WASM client
    window.TONClient.setWasmOptions({binaryURL: window.tonWasmUrl});

    if(typeof window.getTON === 'undefined') {
        window.getTON = getTON;
    }

    /*
    let freeton = await (new TonClientWrapper()).create({
        servers: ['net.ton.dev']
    });


    //Check is ton already provided
    if(!window.ton) {
        window.ton = freeton;
    }
    window.tonFallback = freeton;

    console.log('FreeTON provider ready');
*/

});

