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


import {default as Crypto} from "./Crypto.mjs";

class PrivateStorage {
    constructor() {
        this.iv = null;
        this.crypto = null;
    }

    async initialize(asEmpty = false) {

        /**
         *
         * @type {Crypto}
         */
        this.crypto = new Crypto();

        if(asEmpty) {
            await this.clear();
        }

        return this;
    }


    /**
     * Set key
     * @param {string} key
     * @param {object} value
     * @param {string} password
     * @returns {Promise<*>}
     */
    async set(key, value, password) {
        value = JSON.stringify(value);
        let encryptedData = await this.crypto.encrypt(value, password);

        let field = {};
        field[key] = encryptedData;
        return await browser.storage.sync.set(field);
    }

    /**
     * Get key
     * @param {string} key
     * @param {string} password
     * @returns {Promise<*>}
     */
    async get(key, password) {
        let encryptedData = await browser.storage.sync.get(key);
        if(!encryptedData[key]) {
            return null;
        }

        return JSON.parse(await this.crypto.decrypt(encryptedData[key], password));
    }

    /**
     * Clear storage
     * @returns {Promise<*>}
     */

    /* async clear() {
         return await browser.storage.sync.clear();
     }*/

    /**
     * Delete key from storage
     * @param key
     * @returns {Promise<*>}
     */
    async del(key) {
        return await browser.storage.sync.remove(key);
    }


}

export default PrivateStorage;