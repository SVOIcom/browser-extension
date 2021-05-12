/*
  _____ ___  _   ___        __    _ _      _
 |_   _/ _ \| \ | \ \      / /_ _| | | ___| |_
   | || | | |  \| |\ \ /\ / / _` | | |/ _ \ __|
   | || |_| | |\  | \ V  V / (_| | | |  __/ |_
   |_| \___/|_| \_|  \_/\_/ \__,_|_|_|\___|\__|

 */
import LocalStorage from "./LocalStorage.mjs";

/**
 * @name FreeTON browser wallet and injector
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */


class NameStorage {

    constructor() {
        this._storage = new LocalStorage();
    }

    /**
     * Delete key from storage
     * @param key
     * @returns {Promise<*>}
     */
    async get(key) {

        let accountName = await this._storage.get(`${key}_name`);

        if(!accountName) {
            return "";
        }
        return accountName;
    }

    /**
     * Delete key from storage
     * @param key
     * @param name
     * @returns {Promise<*>}
     */
    async set(key, name = "") {
        await this._storage.set(`${key}_name`, name);
        return true
    }


    /**
     * Delete key from storage
     * @param key
     * @returns {Promise<*>}
     */
    async del(key) {
        await this._storage.del(`${key}_name`);
        return true;
    }


}

export default new NameStorage();