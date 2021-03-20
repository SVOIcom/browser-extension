import PrivateStorage from "./PrivateStorage.mjs";

const EXTENSION_SECRET = 'baTon';

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
        this._publicKeys = await this._storage.get('publicKeys', EXTENSION_SECRET);

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
}

export default Keyring;