/**
 * @name ScaleWallet - Everscale browser wallet and injector
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */

import ExtensionMessenger from "./modules/ExtensionMessenger.mjs";
import TonClientWrapper from "./modules/TonClientWrapper.mjs";
import PrivateStorage from "./modules/PrivateStorage.mjs";
import NameStorage from "./modules/NameStorage.mjs";
import Keyring from "./modules/Keyring.mjs";
import Utils from "./modules/utils.mjs";
import EXCEPTIONS from "./modules/const/Exceptions.mjs";
import NetworkManager from "./modules/NetworkManager.mjs";
import MESSAGES from "./modules/const/Messages.mjs";
import AccountManager from "./modules/AccountManager.mjs";
import uiUtils from "./modules/ui/uiUtils.mjs";
import Wallet from "./modules/freeton/contracts/Wallet.mjs";
import FreetonInstance from "./modules/freeton/FreetonInstance.mjs";
import FreetonCrypto from "./modules/freeton/FreetonCrypto.mjs";
import FreetonDeploy from "./modules/freeton/FreetonDeploy.mjs";
import BroxusTIP3 from "./modules/freeton/contracts/tokens/tip3-fungible/broxus/BroxusTIP3.mjs";
import TokenManager from "./modules/TokenManager.mjs";
import Token from "./modules/Token.mjs";
import MISC from "./modules/const/Misc.mjs";
import LOCALIZATION from "./modules/Localization.mjs";
import TIP3Contract from "./modules/const/TIP3Contract.mjs";
import ActionProgressManager from "./modules/ActionProgressManager.mjs";
import init, * as nt from './modules/freeton/nekoton/nekoton_wasm.js';
import {unpackFromCell} from "./modules/freeton/nekoton/nekoton_wasm.js";

const _ = LOCALIZATION._;

import LocalStorage from "./modules/LocalStorage.mjs";

let localStorage = new LocalStorage();

console.log('IM BACKGROUND');

const wait = (timeout = 500) => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout)
    })
}

const RPC = {
    sender: null,
    'test': async (a, b) => {
        return a + b;
    },
    'fall': async () => {
        throw EXCEPTIONS.testException;
    },

    /**
     * Open popup
     * @returns {Promise<*>}
     */
    mainOpenPopup: function async(options) {

        if(this.sender !== 'popup') {
            throw EXCEPTIONS.invalidInvoker;
        }

        return uiUtils.openPopup(options);
    },

    /**
     * Contract run
     * @param publicKey
     * @param data
     * @returns {Promise<boolean>}
     */
    main_run: async (publicKey, data) => {
        data.keyPair = await getKeysFromDeployAcceptence(publicKey, 'run', data);

        actionManager.startActionOnce('main_run');

        try {
            let ton = await FreetonInstance.getFreeTON((await networkManager.getNetwork()).network.url);

            let runResult = await ton.contracts.run(data);

            actionManager.endAction('main_run');
            return runResult;
        } catch (e) {
            actionManager.endAction('main_run');
            throw e;
        }
    },

    /**
     * Run contract local
     * This method can save some ram for FreeTON instance
     * @param publicKey
     * @param data
     * @returns {Promise<*>}
     */
    main_runLocal: async (publicKey, data) => {

        data.keyPair = await getKeysFromDeployAcceptence(publicKey, 'runLocal', data);

        actionManager.startActionOnce('main_runLocal');

        try {
            let ton = await FreetonInstance.getFreeTON((await networkManager.getNetwork()).network.url);

            let runResult = await ton.contracts.runLocal(data);

            actionManager.endAction('main_runLocal');

            return runResult;
        } catch (e) {
            actionManager.endAction('main_runLocal');
            throw e;
        }
    },


    /**
     * createRunMessage mock
     * @param {string} publicKey
     * @param {object} data
     * @returns {Promise<*>}
     */
    main_createRunMessage: async (publicKey, data) => {
        data.keyPair = await getKeysFromDeployAcceptence(publicKey, 'createRunMessage', data)

        let ton = await FreetonInstance.getFreeTON((await networkManager.getNetwork()).network.url);
        return await ton.contracts.createRunMessage(data);

    },

    /**
     * createDeployMessage mock
     * @param {string} publicKey
     * @param {object} data
     * @returns {Promise<*>}
     */
    main_createDeployMessage: async (publicKey, data) => {
        data.keyPair = await getKeysFromDeployAcceptence(publicKey, 'createDeployMessage', data)

        let ton = await FreetonInstance.getFreeTON((await networkManager.getNetwork()).network.url);
        return await ton.contracts.createDeployMessage(data);

    },


    /**
     * Returns keys in keyring
     * @returns {Promise<string[]>}
     */
    main_getPublicKeys: async () => {
        return await keyring.getPublicKeys();
    },

    /**
     * Check is public key in keyring
     * @param publicKey
     * @returns {Promise<*>}
     */
    main_isKeyInKeyring: async (publicKey) => {
        return await keyring.isKeyInKeyring(publicKey);
    },

    /**
     * Get current network
     * @param name
     * @returns {Promise<{name: string, network: *}>}
     */
    main_getNetwork: async (name = undefined) => {
        return await networkManager.getNetwork(name);
    },

    /**
     * Get existsing networks
     * @returns {Promise<*>}
     */
    main_getNetworks: async () => {
        return await networkManager.getNetworks();
    },

    /**
     * Change current network
     * @param network
     * @returns {Promise<*>}
     */
    main_changeNetwork: async function (network) {
        if(this.sender !== 'popup') {
            throw EXCEPTIONS.invalidInvoker;
        }
        return await networkManager.changeNetwork(network);
    },


    /**
     * Add custom network to list
     * @param networkName
     * @param url
     * @param description
     * @returns {Promise<void>}
     */
    main_addCustomNetwork: async function (networkName, url, description) {
        if(this.sender !== 'popup') {
            throw EXCEPTIONS.invalidInvoker;
        }

        await networkManager.addNetwork(networkName, url, description);

        return await networkManager.changeNetwork(networkName);
    },

    /**
     * Change current account
     * @param publicKey
     * @returns {Promise<boolean>}
     */
    main_changeAccount: async function (publicKey) {
        if(this.sender !== 'popup') {
            throw EXCEPTIONS.invalidInvoker;
        }
        if(!await keyring.isKeyInKeyring(publicKey)) {
            await messenger.rpcCall('popup_alert', [_('Public key not found')], 'popup');
            throw EXCEPTIONS.publicKeyNotFound
        }
        await accountManager.changeAccount(publicKey);
        return true;
    },

    /**
     * Returns account info
     * @returns {Promise<*>}
     */
    main_getAccount: async () => {
        return await accountManager.getAccount();
    },

    /**
     * Set wallet object for public key
     * @param {string} publicKey
     * @param {string} network
     * @param {object} wallet
     * @returns {Promise<void>}
     */
    main_setNetworkWallet: async function (publicKey, network, wallet) {
        if(this.sender !== 'popup') {
            throw EXCEPTIONS.invalidInvoker;
        }
        return await accountManager.setPublicKeyNetworkWallet(publicKey, network, wallet);
    },

    /**
     * Returns wallet balance
     * @param {string} address
     * @returns {Promise<*>}
     */
    main_getWalletBalance: async (address) => {
        let ton = await FreetonInstance.getFreeTON((await networkManager.getNetwork()).network.url);
        let wallet = await (new Wallet(address, ton)).init();
        window.wallet = wallet;
        return await wallet.getBalance();
    },

    /**
     * Returns wallet history
     * @param address
     * @param amount
     * @returns {Promise<Wallet>}
     */
    main_getWalletHistory: async function (address, amount = 20) {
        console.log('getWalletHistory', address, amount);
        let ton = await FreetonInstance.getFreeTON((await networkManager.getNetwork()).network.url);
        let wallet = await (new Wallet(address, ton)).init();
        window.wallet = wallet;
        return await wallet.getHistory(amount);
    },

    /**
     * Check wallet deployed
     * @param {string} address
     * @returns {Promise<boolean>}
     */
    main_getWalletDeployed: async (address) => {
        let ton = await FreetonInstance.getFreeTON((await networkManager.getNetwork()).network.url);
        let wallet = await (new Wallet(address, ton)).init();
        return await wallet.contractDeployed();
    },

    /**
     * Transfer money to another account
     * @param from
     * @param publicKey
     * @param to
     * @param amount
     * @param payload
     * @param bounce
     * @param openPopup
     * @returns {Promise<void>}
     */
    main_transfer: async function (from, publicKey, to, amount, payload = '', bounce = false, openPopup = true) {

        /*if(this.sender !== 'popup') {
            throw EXCEPTIONS.invalidInvoker;
        }*/

        actionManager.startActionOnce('main_transfer');

        try {
            let ton = await FreetonInstance.getFreeTON((await networkManager.getNetwork()).network.url);
            let wallet = await (new Wallet(from, ton)).init();

            let network = await networkManager.getNetwork();

            console.log(amount);

            let keyPair = await getKeysFromDeployAcceptence(publicKey, 'transfer', {
                address: from,
                additionalMessage: `${_('This action sends')} <b>${Utils.showToken(Utils.unsignedNumberToSigned(amount))}</b> ${network.network.tokenIcon} ${_('to')} <span class="intextWallet">${to}</span> ${_('wallet')}.`,
            }, undefined, !openPopup);

            await messenger.rpcCall('popup_showToast', [_('Transaction created')], 'popup');

            let transferResult = await wallet.transferNew(to, amount, payload, bounce, keyPair);

            actionManager.endAction('main_transfer');

            return transferResult;
        } catch (e) {
            actionManager.endAction('main_transfer');
            throw e;
        }
    },

    /**
     * Create or change wallet
     * @param publicKey
     * @param type
     * @returns {Promise<*>}
     */
    main_createWallet: async function (publicKey, type) {

        if(this.sender !== 'popup') {
            throw EXCEPTIONS.invalidInvoker;
        }

        let network = await networkManager.getNetwork();
        let contractDeployer = new FreetonDeploy(network.network.url);
        return await contractDeployer.createWallet(publicKey, type);
    },

    /**
     * Deploy multisig wallet
     * @param publicKey
     * @param type
     * @returns {Promise<*>}
     */
    main_deployWallet: async function (publicKey, type) {

        if(this.sender !== 'popup') {
            throw EXCEPTIONS.invalidInvoker;
        }

        actionManager.startActionOnce('main_deployWallet');

        try {
            let network = await networkManager.getNetwork();

            let keyPair = await getKeysFromDeployAcceptence(publicKey, _('Deploy contract'), {
                //address: from,
                additionalMessage: `${_('Ths action deploys')} ${type} ${_('wallet contract')}.`,
            }, undefined, true);

            let contractDeployer = new FreetonDeploy(network.network.url);
            let deployResult = await contractDeployer.deployWallet(keyPair, type);


            actionManager.endAction('main_deployWallet');

            return deployResult;
        } catch (e) {
            actionManager.endAction('main_deployWallet');
            throw e;
        }

    },

    /**
     * Generates seed phrase
     * @returns {Promise<*>}
     */
    main_generateSeedPhrase: async () => {
        return await freetonCrypto.generateSeed();
    },

    /**
     * Generates seed phrase
     * @returns {Promise<*>}
     */
    main_getKeysFromSeedPhrase: async (seed) => {
        return await freetonCrypto.seedOrPrivateToKeypair(seed);
    },

    /**
     * Returns encoded comment payload
     * @param comment
     * @returns {Promise<*>}
     */
    main_encodePayloadComment: async (comment) => {
        return await Utils.encodePayloadComment(comment);
    },

    /**
     * Add account to storage
     * @returns {Promise<*>}
     */
    main_addAccount: async function (publicKey, privateKey, seedPhrase, password) {
        if(this.sender !== 'popup') {
            throw EXCEPTIONS.invalidInvoker;
        }
        return await accountManager.addAccount(publicKey, privateKey, seedPhrase, password);
    },

    /**
     * Add account to storage
     * @returns {Promise<*>}
     */
    main_getAccountInfo: async function (publicKey) {
        if(this.sender !== 'popup') {
            throw EXCEPTIONS.invalidInvoker;
        }

        let password = await messenger.rpcCall('popup_password', ['', publicKey], 'popup');
        if(!password) {
            throw EXCEPTIONS.rejectedByUser;
        }

        let keyPair = {};

        try {
            keyPair = await keyring.extractKey(publicKey, password);
        } catch (e) {
            //Retry password
            let password = await messenger.rpcCall('popup_password', ['<span style="color: red">' + _('Invalid password') + '</span><br>', publicKey], 'popup');
            if(!password) {
                throw EXCEPTIONS.rejectedByUser;
            }

            try {
                keyPair = await keyring.extractKey(publicKey, password);
            } catch (e) {
                throw EXCEPTIONS.invalidPassword;
            }
        }

        return keyPair;
    },

    /**
     * Get account name from storage
     * @returns {Promise<*>}
     */
    main_getAccountName: async function (publicKey) {
        if(this.sender !== 'popup') {
            throw EXCEPTIONS.invalidInvoker;
        }
        return await NameStorage.get(publicKey);
    },

    /**
     * Add account name to storage
     * @returns {Promise<*>}
     */
    main_setAccountName: async function (publicKey, name) {

        if(this.sender !== 'popup') {
            throw EXCEPTIONS.invalidInvoker;
        }

        let password = await messenger.rpcCall('popup_password', ['', publicKey], 'popup');
        if(!password) {
            throw EXCEPTIONS.rejectedByUser;
        }

        let keyPair = {};

        try {
            keyPair = await keyring.extractKey(publicKey, password);
        } catch (e) {
            //Retry password
            let password = await messenger.rpcCall('popup_password', ['<span style="color: red">' + _('Invalid password') + '</span><br>', publicKey], 'popup');
            if(!password) {
                throw EXCEPTIONS.rejectedByUser;
            }

            try {
                keyPair = await keyring.extractKey(publicKey, password);
            } catch (e) {
                throw EXCEPTIONS.invalidPassword;
            }
        }

        return await NameStorage.set(publicKey, name);
    },

    /**
     * Delete account from storage
     * @returns {Promise<*>}
     */
    main_deleteAccount: async function (publicKey) {

        if(this.sender !== 'popup') {
            throw EXCEPTIONS.invalidInvoker;
        }

        let password = await messenger.rpcCall('popup_password', ['', publicKey], 'popup');
        if(!password) {
            throw EXCEPTIONS.rejectedByUser;
        }

        let keyPair = {};

        try {
            keyPair = await keyring.extractKey(publicKey, password);
        } catch (e) {
            //Retry password
            let password = await messenger.rpcCall('popup_password', ['<span style="color: red">' + _('Invalid password') + '</span><br>', publicKey], 'popup');
            if(!password) {
                throw EXCEPTIONS.rejectedByUser;
            }

            try {
                keyPair = await keyring.extractKey(publicKey, password);
            } catch (e) {
                throw EXCEPTIONS.invalidPassword;
            }
        }
        await accountManager.removeAccount(publicKey)
        return await keyring.removeKey(publicKey);
    },

    /**
     * Get account tokens
     * @returns {Promise<*>}
     */
    main_getAccountTokens: async function (publicKey, network) {
        if(this.sender !== 'popup') {
            throw EXCEPTIONS.invalidInvoker;
        }

        const tokenManager = await (new TokenManager()).init()
        return await tokenManager.getAccountTokens(publicKey, network);
    },

    /**
     * Get token info
     * @param {string} tokenRootAddress
     * @returns {Promise<{symbol, totalSupply: number, rootAddress: *, decimals: number, name, icon: null|string, fungible: boolean, type: string|{ERC20_TOKENS: {}, TIP3_NONFUNGIBLE_TOKENS: {}, TIP3_FUNGIBLE_TOKENS: {broxus: string}}|*}>}
     */
    main_getTokenInfo: async function (tokenRootAddress) {
        let ton = await FreetonInstance.getFreeTON((await networkManager.getNetwork()).network.url);
        const token = await (new Token(tokenRootAddress, ton)).init();

        return await token.getInfo();
    },

    /**
     * Get token balance
     * @param tokenRootAddress
     * @param publicKey
     * @param walletAddress
     * @returns {Promise<*>}
     */
    main_getTokenBalance: async function (tokenRootAddress, publicKey, walletAddress) {
        let ton = await FreetonInstance.getFreeTON((await networkManager.getNetwork()).network.url);
        const token = await (new Token(tokenRootAddress, ton)).init();

        //return await token.getPubkeyBalance(publicKey);
        return await token.getMultisigBalance(walletAddress);
    },

    /**
     * Get token wallet address by public key
     * @param tokenRootAddress
     * @param publicKey
     * @param walletAddress
     * @returns {Promise<string>}
     */
    main_getTokenWalletAddress: async function (tokenRootAddress, publicKey, walletAddress) {
        let ton = await FreetonInstance.getFreeTON((await networkManager.getNetwork()).network.url);
        const token = await (new Token(tokenRootAddress, ton)).init();

        //return await token.getPubkeyWalletAddress(publicKey);
        return await token.getMultisigWalletAddress(walletAddress);
    },

    /**
     * Add token to account
     * @param publicKey
     * @param tokenRootAddress
     * @param network
     * @returns {Promise<boolean>}
     */
    main_addAccountToken: async function (publicKey, tokenRootAddress, network) {

        if(this.sender !== 'popup') {
            throw EXCEPTIONS.invalidInvoker;
        }

        const tokenManager = await (new TokenManager()).init();

        let ton = await FreetonInstance.getFreeTON((await networkManager.getNetwork()).network.url);
        const token = await (new Token(tokenRootAddress, ton)).init();

        await tokenManager.addAccountToken(publicKey, network, tokenRootAddress, await token.getInfo());

        return true;
    },

    /**
     * Remove token from account
     * @param publicKey
     * @param tokenRootAddress
     * @param network
     * @returns {Promise<boolean>}
     */
    main_removeAccountToken: async function (publicKey, tokenRootAddress, network) {

        if(this.sender !== 'popup') {
            throw EXCEPTIONS.invalidInvoker;
        }
        const tokenManager = await (new TokenManager()).init();
        await tokenManager.removeAccountToken(publicKey, tokenRootAddress, network);

        return true;
    },

    /**
     * Transfer token
     * @param {string} rootTokenAddress Token Root address
     * @param {string} walletAddress Current wallet
     * @param {string} publicKey
     * @param to
     * @param amount
     * @param multisigAddress
     * @returns {Promise<*>}
     */
    main_tokenTransfer: async function (rootTokenAddress, walletAddress, publicKey, to, amount, multisigAddress) {

        if(this.sender !== 'popup') {
            throw EXCEPTIONS.invalidInvoker;
        }

        actionManager.startActionOnce('main_tokenTransfer');

        try {
            let ton = await FreetonInstance.getFreeTON((await networkManager.getNetwork()).network.url);

            const token = await (new Token(rootTokenAddress, ton)).init();

            let tokenInfo = await token.getInfo();

            let keyPair = await getKeysFromDeployAcceptence(publicKey, 'token_transfer', {
                address: walletAddress,
                additionalMessage: `${_('This action sends')} <b>${Utils.showToken(Utils.unsignedNumberToSigned(amount, tokenInfo.decimals))}</b> ${_('tokens to')} <span class="intextWallet">${to}</span> ${_('wallet.')}`,
            }, undefined, true);


            await messenger.rpcCall('popup_showToast', [_('Token transaction created')], 'popup');

            let txInfo = await token.multisigTransfer(to, amount, keyPair, multisigAddress);

            console.log(txInfo);

            await messenger.rpcCall('popup_showToast', [_('Token transfer complete')], 'popup');

            actionManager.endAction('main_tokenTransfer');
        } catch (e) {
            actionManager.endAction('main_tokenTransfer');
            throw e;
        }

        return true;
    },


    /**
     * Get constant from MISC constants
     * @param {string} constant
     * @returns {Promise<string>}
     */
    main_getMiscConstant: async function (constant = 'VERSION') {
        return MISC[constant]
    },

    /**
     * Create TIP3 token
     * @param type
     * @param options
     * @param fromWallet
     * @param publicKey
     * @returns {Promise<boolean>}
     */
    main_createTip3Token: async function (type = TIP3Contract.ROOT_TYPES.BroxusTIP3, options, fromWallet, publicKey) {
        if(this.sender !== 'popup') {
            throw EXCEPTIONS.invalidInvoker;
        }

        actionManager.startActionOnce('main_createTip3Token');

        try {

            let ton = await FreetonInstance.getFreeTON((await networkManager.getNetwork()).network.url);


            console.log('CREATE TIP3', type, options);

            let network = await networkManager.getNetwork();
            let contractDeployer = new FreetonDeploy(network.network.url);

            let newRootAddress = await contractDeployer.predictTIP3RootAddress(type, options, publicKey);
            console.log('ROOT ADDRESS', newRootAddress);

            let keyPair = await getKeysFromDeployAcceptence(publicKey, 'create_token', {
                address: newRootAddress,
                additionalMessage: `${_('This action deploy new TIP3 token contract')} 1 TON`,
            }, undefined, true);


            //Transfer tokens for contact deploy
            let transferResult = await wallet.transfer(newRootAddress, 1e9, '', keyPair);

            console.log('TIP3 deploy transfer result', transferResult);


            let deployResult = await contractDeployer.deployTIP3Root(type, options, keyPair);

            console.log('TIP3 deploy ROOT result', deployResult);

            const token = await (new Token(newRootAddress, ton)).init();

            let deployWalletResult = await token.deployWallet(options.initialMint, await (new Wallet(fromWallet, ton)).init(), keyPair);

            console.log('TIP3 deploy WALLET result', deployWalletResult);


            const tokenManager = await (new TokenManager()).init();


            await tokenManager.addAccountToken(publicKey, network.name, newRootAddress, await token.getInfo());

            console.log('TOKEN ADDED');

            console.log(await tokenManager.getAccountTokens(publicKey, network.name))

            actionManager.endAction('main_createTip3Token');
        } catch (e) {
            actionManager.endAction('main_createTip3Token');
            console.error(e);
            throw e;
        }

        return true;
    },

    /**
     * Get any active actions
     * @returns {Promise<*[]>}
     */
    main_getActiveActions: async function () {
        return actionManager.getActiveActions();
    },

    async main_signDataRaw(publicKey, data = '') {
        actionManager.startActionOnce('main_signDataRaw');
        try {

            let keyPair = await getKeysFromDeployAcceptence(publicKey, 'sign_data_raw', {
                //address: tokenWalletAddress,
                additionalMessage: `${_('You are signing data')}: ${_(data)}`, //TODO fix injection
            }, 'Sign', false);

            let ton = await FreetonInstance.getFreeTON((await networkManager.getNetwork()).network.url);

            let sign = await ton.lowLevel.crypto.sign({unsigned: data, keys: keyPair});


            actionManager.endAction('main_signDataRaw');

            return {
                signature: Buffer.from(sign.signature, 'hex').toString('base64'),
                signatureFull: sign.signed,
                signatureHex: sign.signature,
                signatureParts: {
                    high: `0x${sign.signature.slice(0, 64)}`,
                    low: `0x${sign.signature.slice(64, 128)}`,
                }
            }

        } catch (e) {
            actionManager.endAction('main_signDataRaw');
            throw e;
        }
    },

    async main_packIntoCell(params) {
        const {structure, data} = params;
        return {boc: await nt.packIntoCell(structure, data)}
    },

    async main_unpackFromCell(params) {
        const {structure, boc, allowPartial} = params;
        return {data: nt.unpackFromCell(structure, boc, allowPartial)};
    },

    async main_verifySignature(params) {
        const {publicKey, dataHash, signature} = params;
        return {isValid: nt.verifySignature(publicKey, dataHash, signature)};
    },

    async main_decodeTransactionEvents(params) {
        const {transaction, abi} = params;
        return {events: nt.decodeTransactionEvents(transaction, abi)};
    },

    async main_base64toHex(data) {
        return Buffer.from(data, 'base64').toString('hex');
    },
    async main_hex2Base64(data) {
        return Buffer.from(data, 'hex').toString('base64');
    },

    main_deployTokenWallet: async function (publicKey, walletAddress, tokenRootAddress, ownerAddress = null) {

        if(this.sender !== 'popup') {
            throw EXCEPTIONS.invalidInvoker;
        }

        actionManager.startActionOnce('main_deployTokenWallet');

        try {
            let ton = await FreetonInstance.getFreeTON((await networkManager.getNetwork()).network.url);


            const token = await (new Token(tokenRootAddress, ton)).init();

            console.log('DEPLOY TOKEN WALLET', publicKey, walletAddress, tokenRootAddress, ownerAddress);

            let tokenWalletAddress = await token.getMultisigWalletAddress(ownerAddress);

            //if we create wallet for other user
            if(!ownerAddress) {
                tokenWalletAddress = await token.getPubkeyWalletAddress(publicKey);
            }


            let keyPair = await getKeysFromDeployAcceptence(publicKey, 'create_token', {
                address: tokenWalletAddress,
                additionalMessage: `${_('This action deploy new token wallet')} 1 TON`,
            }, undefined, true);


            let tokenWallet = await (new Wallet(tokenWalletAddress, ton)).init();
            let wallet = await (new Wallet(walletAddress, ton)).init();

            let tokenWaletTONBalance = 0;
            try {
                tokenWaletTONBalance = await tokenWallet.getBalance();
            } catch (e) {
            }

            if(tokenWaletTONBalance < 1e9) {

                console.log('Transfering from', walletAddress, 'to', tokenWalletAddress);

                //Transfer tokens for contact deploy
                let transferResult = await wallet.transfer(tokenWalletAddress, 1e9, '', keyPair);

                console.log('TIP3 wallet deploy transfer result', transferResult);
            } else {
                console.log('Wallet balance more than 1 TON, no pretransfer needed', tokenWalletAddress);
            }


            let deployWalletResult = await token.deployWallet(0, await (new Wallet(walletAddress, ton)).init(), keyPair, ownerAddress);

            console.log('TIP3 deploy WALLET result', deployWalletResult);


            actionManager.endAction('main_deployTokenWallet');

            return deployResult;
        } catch (e) {
            actionManager.endAction('main_deployTokenWallet');
            throw e;
        }

    },

    /**
     * @deprecated
     * @param address
     * @returns {Promise<boolean>}
     */
    main_isMultisigAddress: async function (address) {
        let ton = await FreetonInstance.getFreeTON((await networkManager.getNetwork()).network.url);

        try {
            let wallet = await (new Wallet(address, ton)).init();
            await wallet.getBalance();

            return await wallet.contractDeployed()
        } catch (e) {
            return false;
        }
    },

    /**
     * Detects is TIP3 token
     * @param tokenRoot
     * @param address
     * @returns {Promise<boolean>}
     */
    main_isTokenWalletAddress: async function (tokenRoot, address) {
        let ton = await FreetonInstance.getFreeTON((await networkManager.getNetwork()).network.url);

        try {
            const token = await (new Token(tokenRoot, ton)).init();

            await token.getBalance(address);

            return true;

        } catch (e) {
            return false;
        }

    },

    /**
     * Returns inpage config script
     * @returns {Promise<string>}
     */
    async main_getConfigScript() {
        let config = {};
        if(await localStorage.get('everWalletEmulation', true)) {
            config.EVERWalletEmulation = true;
        }
        return `
            window._everscaleWalletConfig = ${JSON.stringify(config)};
        `;
    }
}


/**
 * Open accept sign message
 * @param publicKey
 * @param type
 * @param callingData
 * @param acceptMessage
 * @param dontCreatePopup
 * @returns {Promise<{public, secret: *}>}
 */
async function getKeysFromDeployAcceptence(publicKey, type = 'run', callingData, acceptMessage = '', dontCreatePopup = false) {

    if(!dontCreatePopup) {
        let popup = await uiUtils.openPopup();
        await Utils.wait(3000);
    }

    //Simple timeout for initialization
    await Utils.wait(2000)

    let allowSign = await messenger.rpcCall('popup_acceptSignMessage', [publicKey, type, callingData, acceptMessage], 'popup');

    //Sign allowed, make run
    if(!allowSign) {
        throw EXCEPTIONS.rejectedByUser;
    }


    //Action requires password
    let password = await messenger.rpcCall('popup_password', ['', publicKey], 'popup');
    if(!password) {
        throw EXCEPTIONS.rejectedByUser;
    }

    let keyPair = {};

    try {
        keyPair = await keyring.extractKey(publicKey, password);
    } catch (e) {
        //Retry password
        let password = await messenger.rpcCall('popup_password', ['<span style="color: red">' + _('Invalid password') + '</span><br>', publicKey], 'popup');
        if(!password) {
            throw EXCEPTIONS.rejectedByUser;
        }

        try {
            keyPair = await keyring.extractKey(publicKey, password);
        } catch (e) {
            throw EXCEPTIONS.invalidPassword;
        }
    }

    if(!dontCreatePopup) {
        await messenger.rpcCall('popup_close', [], 'popup');
    }

    return keyPair;
}


//Setup new TON libriary
tonclientWeb.libWebSetup({
    binaryURL: 'ever-sdk-js/eversdk.wasm',
});
tonclientWeb.TonClient.useBinaryLibrary(tonclientWeb.libWeb);

let messenger, storage, keyring, networkManager, accountManager, actionManager;

(async () => {
//Messenger channel
    messenger = new ExtensionMessenger('background', RPC);
    window.messenger = messenger;


    keyring = await (new Keyring()).init();
    window.keyring = keyring;

    storage = await (new PrivateStorage()).initialize();
    window.privateStorage = storage;

    networkManager = await (new NetworkManager()).initialize();
    window.networkManager = networkManager;

    window.actionManager = actionManager = ActionProgressManager;


    window.freetonCrypto = FreetonCrypto;

    let ton = await FreetonInstance.getFreeTON((await networkManager.getNetwork()).network.url);
    //window.tip3 = await (new BroxusTIP3(ton, '0:0c4cad39cf61d92df6ab7c78552441b0524973e282f1e7a6acf5f06773cdc605')).init();

    try {
        await init();
        window.nekoton = nt;
    } catch (e) {
        console.log('ERROR INITIALIZE NEKOTON', e);
    }

    //If network changed, broadcast it to all tabs and popups
    networkManager.on(networkManager.EVENTS.networkChanged, async () => {
        await messenger.broadcastTabsMessage(MESSAGES.NETWORK_CHANGED);
        await messenger.rpcCall('popup_networkChanged', [await networkManager.getNetwork()], 'popup');
    })

    accountManager = await (new AccountManager(keyring)).initialize();
    window.accountManager = accountManager;
    //If account changed, broadcast it to all tabs and popups
    accountManager.on(accountManager.EVENTS.accountChanged, async () => {
        await messenger.broadcastTabsMessage(MESSAGES.ACCOUNT_CHANGED);
        await messenger.rpcCall('popup_accountChanged', [await accountManager.getAccount()], 'popup');
    })


    //Badge updater
    const updateBadge = async () => {
        try {
            let account = await accountManager.getAccount();
            let network = await networkManager.getNetwork()

            let address = (account.wallets[network.name]).address;
            let ton = await FreetonInstance.getFreeTON((await networkManager.getNetwork()).network.url);
            let wallet = await (new Wallet(address, ton)).init();
            let balance = Utils.nFormatter(Utils.unsignedNumberToSigned(await wallet.getBalance()), 1);

            chrome.browserAction.setBadgeText({text: balance + '💸'});
        } catch (e) {
            try {
                chrome.browserAction.setBadgeText({text: 0 + '💸'});
            }catch(e){}
        }
    }
    setInterval(updateBadge, 60000);
    await updateBadge();
    accountManager.on(accountManager.EVENTS.accountChanged, async () => {
        await updateBadge();
    });


})()



