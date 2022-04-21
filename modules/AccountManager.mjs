/**
 * @name ScaleWallet - Everscale browser wallet and injector
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */

import LocalStorage from "./LocalStorage.mjs";
import NETWORKS from "./const/Networks.mjs";
import EXCEPTIONS from "./const/Exceptions.mjs";
import NameStorage from "./NameStorage.mjs";


class AccountManager extends EventEmitter3 {

    EVENTS = {
        accountChanged: 'accountChanged'
    }

    constructor(keying) {
        super();

        /**
         * @var {Keyring}
         */
        this.keyring = keying;
        this.storage = new LocalStorage();
        this.activeAccountPublicKey = null;
        this.activeAccountWallets = {};
    }

    async initialize() {
        await this.storage.initialize();

        let publicKeys = await this.keyring.getPublicKeys();

        if(publicKeys.length !== 0) {
            this.activeAccountPublicKey = await this.storage.get('activeAccountPublicKey', publicKeys[0]);
        }

        this.activeAccountWallets = await this.storage.get('activeAccountWallets', await this._getPublicKeyWallets(this.activeAccountPublicKey));

        await this.saveAccountState();

        return this;
    }

    /**
     * Save walelts for public key
     * @param publicKey
     * @param wallets
     * @returns {Promise<void>}
     * @private
     */
    async _savePublicKeyWallets(publicKey, wallets = {}) {
        await this.storage.set('wallets_' + publicKey, wallets);
        return true;
    }

    /**
     * Get public key wallets
     * @param publicKey
     * @returns {Promise<*>}
     * @private
     */
    async _getPublicKeyWallets(publicKey) {
        return await this.storage.get('wallets_' + publicKey, {});
    }

    /**
     * Add account
     * @param publicKey
     * @param privateKey
     * @param seedPhrase
     * @param password
     * @param wallets
     * @returns {Promise<void>}
     */
    async addAccount(publicKey, privateKey, seedPhrase, password, wallets = {}) {
        await this.keyring.addKey(publicKey, privateKey, {seedPhrase, bioAuth: true}, password);
        await this._savePublicKeyWallets(publicKey, wallets);
        await this.saveAccountState();
        return true;
    }

    /**
     * Remove account from manager
     * @param publicKey
     * @returns {Promise<void>}
     */
    async removeAccount(publicKey) {
        let isChanged = false;
        if(this.activeAccountPublicKey) {
            this.activeAccountPublicKey = null;
            this.activeAccountWallets = {};
            isChanged = true;
        }

        await this.keyring.removeKey(publicKey);
        await NameStorage.del(publicKey);

        //Reinitialize
        await this.initialize();

        if(isChanged) {
            this.emit(this.EVENTS.accountChanged, await this.getAccount());
        }
    }

    /**
     * Get active account
     * @returns {Promise<{wallets: string, public: null}>}
     */
    async getAccount() {
        return {public: this.activeAccountPublicKey, wallets: this.activeAccountWallets};
    }

    /**
     * Set public key wallet address for ntwork
     * @param {string} publicKey
     * @param {string} network
     * @param {object} wallet
     * @returns {Promise<void>}
     */
    async setPublicKeyNetworkWallet(publicKey, network = 'main', wallet = {address: '', type: '', config: {}}) {
        let publicKeyWallets = await this._getPublicKeyWallets(publicKey);
        publicKeyWallets[network] = wallet;
        await this._savePublicKeyWallets(publicKey, publicKeyWallets);

        if(publicKey === this.activeAccountPublicKey) {
            this.activeAccountWallets = publicKeyWallets;
        }

        await this.saveAccountState();

        return true;

    }


    /**
     * Change current account
     * @param publicKey
     * @param silent
     * @returns {Promise<void>}
     */
    async changeAccount(publicKey, silent = false) {
        if(!await this.keyring.isKeyInKeyring(publicKey)) {
            throw  EXCEPTIONS.publicKeyNotFound;
        }
        this.activeAccountPublicKey = publicKey;

        this.activeAccountWallets = await this._getPublicKeyWallets(publicKey);

        await this.saveAccountState();

        if(!silent) {
            this.emit(this.EVENTS.accountChanged, await this.getAccount());
        }
    }

    /**
     * Save state
     * @returns {Promise<void>}
     */
    async saveAccountState() {
        await this.storage.set('activeAccountPublicKey', this.activeAccountPublicKey);
        await this.storage.set('activeAccountWallets', this.activeAccountWallets);
        return true;
    }
}

export default AccountManager;