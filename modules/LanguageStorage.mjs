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


class LanguageStorage {

    constructor() {
        
        this._storage = new LocalStorage();
        
        this.avaliableLanguages = ["en", "ru", "es"];

        this.keyName = "language";

    }

    async initialize() {

        return this;
    }


     /**
     * Write selected language to storage
     * @param language 
     * @returns {Promise<*>}
     */
    async setLanguage(language){
       
        if (this.avaliableLanguages.includes(language)){
            this.set(this.keyName, language);
        }
    }

    /**
     * Get current language from storage
     * @param language 
     * @returns {Promise<*>}
     */
    async getLanguage(){
        this.get(this.keyName);
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

export default new LanguageStorage();