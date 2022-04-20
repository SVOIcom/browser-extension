/**
 * @name ScaleWallet - Everscale browser wallet and injector
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */


class LocalStorage {
    constructor() {
    }

    async initialize() {

        return this;
    }


    /**
     * Set key
     * @param {string} key
     * @param {object} value
     * @returns {Promise<*>}
     */
    async set(key, value) {
        return localStorage.setItem(key, JSON.stringify(value));
    }

    /**
     * Get key
     * @param {string} key
     * @param {*} defaultValue
     * @returns {Promise<*>}
     */
    async get(key, defaultValue = undefined) {
        let result = localStorage.getItem(key);
        return result === null ? defaultValue : JSON.parse(result);
    }

    /**
     * Delete key from storage
     * @param key
     * @returns {Promise<*>}
     */
    async del(key) {
        return localStorage.removeItem(key);
    }


}

export default LocalStorage;