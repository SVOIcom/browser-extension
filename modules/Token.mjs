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

import Tokens from "./freeton/contracts/tokens/Tokens.mjs";
import TOKEN_LIST from "./const/TokenList.mjs";

class Token {
    constructor(rootAddress, ton, tokenClass = Tokens.TOKEN_TYPE.TIP3_FUNGIBLE_TOKENS.broxus) {
        this.rootAddress = rootAddress;
        this.ton = ton;
        this.tokenClass = tokenClass;
        this.tokenContract = null;
    }

    /**
     * Initialize token
     * @returns {Promise<Token>}
     */
    async init() {
        this.tokenContract = await (new (Tokens.getTokenContract(this.tokenClass))(this.ton, this.rootAddress)).init();
        return this;
    }

    /**
     * Search token icon from list
     * @param rootAddress
     * @returns {Promise<null|*>}
     */
    async getTokenIcon(rootAddress) {
        let searchlist = null;
        switch (this.tokenClass) {
            case "BroxusTIP3":
                searchlist = TOKEN_LIST.TIP3_FUNGIBLE;
        }

        for (let token of searchlist) {
            if(token.rootAddress === rootAddress) {
                return token.icon;
            }
        }

        return null;
    }

    /**
     * Returns token info
     * @returns {Promise<{symbol, totalSupply: number, rootAddress, decimals: number, name, icon: (null|string), fungible: boolean, type: (string|{ERC20_TOKENS: {}, TIP3_NONFUNGIBLE_TOKENS: {}, TIP3_FUNGIBLE_TOKENS: {broxus: string}}|*)}>}
     */
    async getInfo() {
        let tokenInfo = await this.tokenContract.getTokenInfo();

        //TODO check token info for potential XSS
        return {
            ...tokenInfo,
            icon: tokenInfo.icon ? `<img src="${tokenInfo.icon}" class="tokenIcon">` : await this.getTokenIcon(this.rootAddress),
            rootAddress: this.rootAddress,
            type: (Tokens.getTokenContract(this.tokenClass)).TOKEN_TYPE,
            fungible: (Tokens.getTokenContract(this.tokenClass)).TOKEN_FUNGUBLE
        }
    }

    /**
     * Get wallet token balance by public key
     * @param publicKey
     * @returns {Promise<*>}
     */
    async getPubkeyBalance(publicKey) {
        let walletAddress = await this.tokenContract.getWalletAddressByPubkey(publicKey);
        return await this.getBalance(walletAddress);
    }

    /**
     * Get balance by multisig address
     * @param multisigAddress
     * @returns {Promise<*>}
     */
    async getMultisigBalance(multisigAddress) {
        let walletAddress = await this.tokenContract.getWalletAddressByMultisig(multisigAddress);
        return await this.getBalance(walletAddress);
    }


    /**
     * Get wallet address by public key
     * @param publicKey
     * @returns {Promise<string>}
     */
    async getPubkeyWalletAddress(publicKey) {
        return await this.tokenContract.getWalletAddressByPubkey(publicKey);
    }

    /**
     * Get wallet address by multisig wallet address
     * @param multisigAddress
     * @returns {Promise<string>}
     */
    async getMultisigWalletAddress(multisigAddress) {
        return await this.tokenContract.getWalletAddressByMultisig(multisigAddress);
    }


    /**
     * Get wallet token balance
     * @param walletAddress
     * @returns {Promise<*>}
     */
    async getBalance(walletAddress) {
        return await this.tokenContract.getBalance(walletAddress);
    }

    /**
     * Transfer token
     * @param dest
     * @param amount
     * @param keyPair
     * @returns {Promise<*>}
     */
    async transfer(dest, amount, keyPair) {
        return await this.tokenContract.transfer(dest, amount, keyPair)
    }

    /**
     * Transfer token by multisig
     * @param dest
     * @param amount
     * @param keyPair
     * @param multisigAddress
     * @returns {Promise<*>}
     */
    async multisigTransfer(dest, amount, keyPair, multisigAddress){
        return await this.tokenContract.multisigTransfer(dest, amount, keyPair, multisigAddress)
    }

    /**
     * Deploy token wallet
     * @param {number} amount
     * @param {object} userWallet
     * @param {object} keyPair
     * @returns {Promise<*>}
     */
    async deployWallet(amount = 0, userWallet = null, keyPair) {
        return await this.tokenContract.deployWallet(amount, userWallet, keyPair);
    }

}

export default Token;