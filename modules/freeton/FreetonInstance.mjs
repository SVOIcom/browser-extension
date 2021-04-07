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


import TonClientWrapper from "../TonClientWrapper.mjs";

/**
 * Freeton instancer
 */
class FreetonInstance {
    static freeTONInstances = {};

    /**
     * Get TON client
     * @param {string} server
     * @returns {Promise<*>}
     */
    static async getFreeTON(server = 'net.ton.dev') {

        if(FreetonInstance.freeTONInstances[server]) {
            return FreetonInstance.freeTONInstances[server]
        }
        window.TONClient.setWasmOptions({binaryURL: 'ton-client/tonclient.wasm'});
        FreetonInstance.freeTONInstances[server] = await (new TonClientWrapper(true)).create({
            servers: [server]
        });

        return FreetonInstance.freeTONInstances[server]
    }
}

export default FreetonInstance;