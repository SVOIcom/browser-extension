/**
 * @name ScaleWallet - Everscale browser wallet and injector
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */

let window = self;

if(!window.localStorage) {
    window.localStorage = {
        getAllItems: () => chrome.storage.local.get(),
        getItem: async key => {
            let result = await chrome.storage.local.get(key);
            return result[key] ? result[key] : null
        },
        setItem: (key, val) => chrome.storage.local.set({[key]: val}),
        removeItems: keys => chrome.storage.local.remove(keys),
    };
}

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
        return await localStorage.setItem(key, JSON.stringify(value));
    }

    /**
     * Get key
     * @param {string} key
     * @param {*} defaultValue
     * @returns {Promise<*>}
     */
    async get(key, defaultValue = undefined) {
        let result = await localStorage.getItem(key);
        return result === null ? defaultValue : JSON.parse(result);
    }

    /**
     * Delete key from storage
     * @param key
     * @returns {Promise<*>}
     */
    async del(key) {
        return await localStorage.removeItem(key);
    }


}

export default LocalStorage;