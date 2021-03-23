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


import PrivateStorage from "./PrivateStorage.mjs";

const EXTENSION_SECRET = 'TONWallet';

class Keyring {
    constructor() {
        this._storage = new PrivateStorage();
        this._publicKeys = {};
    }

    /**
     * Initialize keyring
     * @returns {Promise<Keyring>}
     */
    async init() {
        await this._storage.initialize();
        try {
            this._publicKeys = await this._storage.get('publicKeys', EXTENSION_SECRET);
        }catch (e){}

        if(!this._publicKeys) {
            this._publicKeys = {}
        }

        return this;
    }

    /**
     * Save data about helded keys
     * @returns {Promise<*>}
     * @private
     */
    async _saveData() {
        return await this._storage.set('publicKeys', this._publicKeys, EXTENSION_SECRET);
    }

    /**
     * Return arrays of helded public keys
     * @returns {Promise<string[]>}
     */
    async getPublicKeys() {
        return Object.keys(this._publicKeys);
    }

    /**
     * Add key to keyring
     * @param {string} publicKey
     * @param {string|object} privateKeyOrSeedWithConfig
     * @param {string} password
     * @returns {Promise<void>}
     */
    async addKey(publicKey, privateKeyOrSeedWithConfig, password) {
        if(await this.isKeyInKeyring(publicKey)) {
            throw new Error('Key already in keyring');
        }
        const isSeed = typeof privateKeyOrSeedWithConfig === 'object';
        this._publicKeys[publicKey] = {isSeed};

        await this._storage.set(publicKey, privateKeyOrSeedWithConfig, password);

        await this._saveData();
    }

    /**
     * Get keypair from keyring
     * @param {string} publicKey
     * @param {string} password
     * @returns {Promise<{public, secret: *}>}
     */
    async extractKey(publicKey, password) {

        return {public: publicKey, secret: await this._storage.get(publicKey, password)};
    }

    /**
     * Delete key from keyring
     * @param publicKey
     * @returns {Promise<void>}
     */
    async removeKey(publicKey) {
        await this._storage.del(publicKey);
        delete this._publicKeys[publicKey];
        await this._saveData();
    }

    /**
     * Is key in keyring
     * @param publicKey
     * @returns {Promise<boolean>}
     */
    async isKeyInKeyring(publicKey) {
        return typeof this._publicKeys[publicKey] !== 'undefined';
    }


}

export default Keyring;