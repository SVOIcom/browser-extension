/**
 * @name ScaleWallet - Everscale browser wallet and injector
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */

let window = self;

import TonClientWrapper from "../TonClientWrapper.mjs";
import NewTonClientWrapper from "../NewTonClientWrapper.mjs";
import Utils from "../utils.mjs";

/**
 * Freeton instancer
 */
class FreetonInstance {
    static freeTONInstances = {};

    /**
     * Get TON client
     * @param {string|array} servers
     * @returns {Promise<*>}
     */
    static async getFreeTON(servers = ['gra02.main.everos.dev', 'gra01.main.everos.dev']) {

        let serversRaw = JSON.stringify(servers);

        //If string or packed servers
        if(!Array.isArray(servers)) {
            servers = Utils.unpackNetworks(servers);
        }

        //Make cache key
        let serverStr = servers.join(',');


        if(FreetonInstance.freeTONInstances[serverStr]) {
            return FreetonInstance.freeTONInstances[serverStr]
        }

        console.log(window);

        //window.TONClient.setWasmOptions({binaryURL: 'ton-client/tonclient.wasm'});
        //TODO MOVE TO NEW TON CLIENT
        FreetonInstance.freeTONInstances[serverStr] = await (new NewTonClientWrapper(true, true)).create({
            servers: Array.from(servers)
        });

        //TODO: move to "low level" TON client
        try {
            console.log('Creating low level TON client');
            let lowLevelTON = await (new NewTonClientWrapper(true, true)).create({
                servers: Array.from(servers)
            });

            FreetonInstance.freeTONInstances[serverStr].lowLevel = lowLevelTON;
        } catch (e) {
            console.log('Failed to create low level TON client', e);
        }


        return FreetonInstance.freeTONInstances[serverStr]
    }


}

export default FreetonInstance;