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
import EXCEPTIONS from "./const/Exceptions.mjs";
import LocalStorage from "./LocalStorage.mjs";

class TokenManager {
    constructor() {
        this._storage = new LocalStorage();
    }

    async init() {
        await this._storage.initialize();

        return this;
    }

    /**
     * Add token to account
     * @param publicKey
     * @param tokenRootAddress
     * @param tokenInfo
     * @returns {Promise<void>}
     */
    async addAccountToken(publicKey, tokenRootAddress, tokenInfo = {}) {
        let accountTokens = await this._storage.get(publicKey + '_tokens', {});

        accountTokens[tokenRootAddress] = {...tokenInfo, tokenRootAddress};

        console.log('ADD TOKN', tokenInfo);

        await this._storage.set(publicKey + '_tokens', accountTokens);
    }

    /**
     * Remove token from account
     * @param publicKey
     * @param tokenRootAddress
     * @returns {Promise<void>}
     */
    async removeAccountToken(publicKey, tokenRootAddress) {
        let accountTokens = await this._storage.get(publicKey + '_tokens', {});

        delete accountTokens[tokenRootAddress]

        await this._storage.set(publicKey + '_tokens', accountTokens);
    }

    /**
     * Get account tokens
     * @param publicKey
     * @returns {Promise<*>}
     */
    async getAccountTokens(publicKey) {
        return await this._storage.get(publicKey + '_tokens', {});
    }
}

export default TokenManager;