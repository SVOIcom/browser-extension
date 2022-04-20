/**
 * @name ScaleWallet - Everscale browser wallet and injector
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */

import Tokens from "./freeton/contracts/tokens/Tokens.mjs";
import TOKEN_LIST from "./const/TokenList.mjs";
import TonSwapTokenList from "./const/TonSwapTokenList.mjs";

const SUPPORT_TOKEN_CLASSES = [
    Tokens.TOKEN_TYPE.TIP3_FUNGIBLE_TOKENS.broxus,
    Tokens.TOKEN_TYPE.TIP3_FUNGIBLE_TOKENS.tip31
];


class Token {
    constructor(rootAddress, ton, tokenClass = undefined) {
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

        //If class not defined, try to detect it
        if(!this.tokenClass) {
            let {tokenClass, tokenContract} = await this.detectTokenClass();
            this.tokenClass = tokenClass;
            this.tokenContract = tokenContract;
        } else {
            this.tokenContract = await (new (Tokens.getTokenContract(this.tokenClass))(this.ton, this.rootAddress)).init();
        }
        return this;
    }

    /**
     * Detect token class by root address
     * @returns {Promise<{tokenClass: (string), tokenContract: *}>}
     */
    async detectTokenClass() {
        for (let tokenClass of SUPPORT_TOKEN_CLASSES) {
            try {
                let tokenContract = await (new (Tokens.getTokenContract(tokenClass))(this.ton, this.rootAddress)).init();

                //TODO Предусмотреть более элегантный способ детектировать класс (но не по хешу кода,это отстой)
                await tokenContract.getTokenInfo();
                return {tokenContract, tokenClass};

            } catch (e) {
                continue;
            }
        }

        throw new Error("Can't detect token class");
    }

    /**
     * Search token icon from lists
     * @param rootAddress
     * @returns {Promise<null|*>}
     */
    async getTokenIcon(rootAddress) {
        let searchlist = null;
        switch (this.tokenClass) {
            case "BroxusTIP3":
                searchlist = TOKEN_LIST.TIP3_FUNGIBLE;
                break;
            case "BroxusTIP3_1":
                searchlist = TOKEN_LIST.TIP3_FUNGIBLE;
                break;
        }

        for (let token of searchlist) {
            if(token.rootAddress === rootAddress) {
                return token.icon;
            }
        }

        let externalList = new TonSwapTokenList(null, null)
        await externalList.load()
        let token = await externalList.getTokenByRootAddress(rootAddress);
        if(token) {
            return token.icon;
        }

        return null;
    }

    /**
     * Returns token info
     * @returns {Promise<{symbol, totalSupply: number, rootAddress, decimals: number, name, icon: (null|string), fungible: boolean, type: (string|{ERC20_TOKENS: {}, TIP3_NONFUNGIBLE_TOKENS: {}, TIP3_FUNGIBLE_TOKENS: {broxus: string}}|*)}>}
     */
    async getInfo() {
        let tokenInfo = await this.tokenContract.getTokenInfo();

        let tokenClassInstance = Tokens.getTokenContract(this.tokenClass);

        //TODO check token info for potential XSS
        return {
            ...tokenInfo,
            icon: tokenInfo.icon ? `<img src="${tokenInfo.icon}" class="tokenIcon">` : await this.getTokenIcon(this.rootAddress),
            rootAddress: this.rootAddress,
            type: tokenClassInstance.TOKEN_TYPE,
            fungible: tokenClassInstance.TOKEN_FUNGUBLE,
            deprecated: tokenClassInstance.IS_DEPRECATED
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
    async multisigTransfer(dest, amount, keyPair, multisigAddress) {
        return await this.tokenContract.multisigTransfer(dest, amount, keyPair, multisigAddress)
    }

    /**
     * Deploy token wallet
     * @param {number} amount
     * @param {object} userWallet
     * @param {object} keyPair
     * @param {string|null} ownerAddress
     * @returns {Promise<*>}
     */
    async deployWallet(amount = 0, userWallet = null, keyPair, ownerAddress = null) {
        return await this.tokenContract.deployWallet(amount, userWallet, keyPair, ownerAddress);
    }

}

export default Token;