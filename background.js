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

import ExtensionMessenger from "./modules/ExtensionMessenger.mjs";
import TonClientWrapper from "./modules/TonClientWrapper.mjs";
import PrivateStorage from "./modules/PrivateStorage.mjs";
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
import FreetonDomains from "./modules/freeton/dens/FreetonDomains.mjs";

const _ = LOCALIZATION._;

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
    mainOpenPopup: function async() {

        if(this.sender !== 'popup') {
            throw EXCEPTIONS.invalidInvoker;
        }

        return uiUtils.openPopup();
    },

    /**
     * Contract run
     * @param publicKey
     * @param data
     * @returns {Promise<boolean>}
     */
    main_run: async (publicKey, data) => {
        data.keyPair = await getKeysFromDeployAcceptence(publicKey, 'run', data);

        let ton = await FreetonInstance.getFreeTON((await networkManager.getNetwork()).network.url);
        return await ton.contracts.run(data);
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

        let ton = await FreetonInstance.getFreeTON((await networkManager.getNetwork()).network.url);
        return await ton.contracts.runLocal(data);
    },


    /**
     * createRunMessage mock
     * @param {string} publicKey
     * @param {array} data
     * @returns {Promise<*>}
     */
    main_createRunMessage: async (publicKey, data) => {
        data.keyPair = await getKeysFromDeployAcceptence(publicKey, 'createRunMessage', data)

        let ton = await FreetonInstance.getFreeTON((await networkManager.getNetwork()).network.url);
        return await ton.contracts.createRunMessage(data);

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
     * @returns {Promise<void>}
     */
    main_transfer: async (from, publicKey, to, amount, payload = '') => {

        //Want to check sender or not? Need TODO disscused

        let ton = await FreetonInstance.getFreeTON((await networkManager.getNetwork()).network.url);
        let wallet = await (new Wallet(from, ton)).init();

        let network = await networkManager.getNetwork();

        console.log(amount);

        let keyPair = await getKeysFromDeployAcceptence(publicKey, 'transfer', {
            address: from,
            additionalMessage: `${_('This action sends')} <b>${Utils.showToken(Utils.unsignedNumberToSigned(amount))}</b> ${network.network.tokenIcon} ${_('to')} <span class="intextWallet">${to}</span> ${_('wallet')}.`,
        }, undefined, true);

        await messenger.rpcCall('popup_showToast', [_('Transaction created')], 'popup');


        return await wallet.transfer(to, amount, payload, keyPair);
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

        let network = await networkManager.getNetwork();

        let keyPair = await getKeysFromDeployAcceptence(publicKey, _('Deploy contract'), {
            //address: from,
            additionalMessage: `${_('Ths action deploys')} ${type} ${_('wallet contract')}.`,
        }, undefined, true);

        let contractDeployer = new FreetonDeploy(network.network.url);

        return await contractDeployer.deployWallet(keyPair, type);

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
        return await freetonCrypto.seedToKeypair(seed);
    },

    /**
     * Add account to storage
     * @returns {Promise<*>}
     */
    main_addAccount: async function (publicKey, privateKey, password) {
        if(this.sender !== 'popup') {
            throw EXCEPTIONS.invalidInvoker;
        }
        return await accountManager.addAccount(publicKey, privateKey, password);
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
            let password = await messenger.rpcCall('popup_password', ['<span style="color: red">' + _('Invalid password') +'</span><br>', publicKey], 'popup');
            if(!password) {
                throw EXCEPTIONS.rejectedByUser;
            }

            try {
                keyPair = await keyring.extractKey(publicKey, password);
            } catch (e) {
                throw EXCEPTIONS.invalidPassword;
            }
        }


        keyPair = await keyring.extractKey(publicKey, password);

        let text =
            `<ul>
                <li id="seedPhaseAreaLi" class="item-content item-input item-input-outline">
                <div class="item-inner">
                    <div id="seedPhaseAreaLabel" class="item-title item-floating-label">${_('Seed phrase')}</div>
                    <div class="item-input-wrap">
                        <textarea id="seedPhaseArea" style="--f7-textarea-height: 80px; --f7-textarea-padding-vertical: 10px;"></textarea>
                    </div>
                </div>
                </li>
            </ul>`

        messenger.rpcCall('popup_alert', [`<span > ${_('Private key for')} ${keyPair.public} - "${keyPair.secret}"</span>`, publicKey], 'popup');

        return keyPair;
    },

    /**
     * Add account to storage
     * @returns {Promise<*>}
     */
    main_getAccountName: async function (publicKey) {
        if(this.sender !== 'popup') {
            throw EXCEPTIONS.invalidInvoker;
        }
        return await keyring.getAccountName(publicKey);
    },

    /**
     * Add account to storage
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
            let password = await messenger.rpcCall('popup_password', ['<span style="color: red">' + _('Invalid password') +'</span><br>', publicKey], 'popup');
            if(!password) {
                throw EXCEPTIONS.rejectedByUser;
            }

            try {
                keyPair = await keyring.extractKey(publicKey, password);
            } catch (e) {
                throw EXCEPTIONS.invalidPassword;
            }
        }

        return await keyring.setAccountName(publicKey, name);
    },

    /**
     * Add account to storage
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
            let password = await messenger.rpcCall('popup_password', ['<span style="color: red">' + _('Invalid password') +'</span><br>', publicKey], 'popup');
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
     * @returns {Promise<*>}
     */
    main_getTokenBalance: async function (tokenRootAddress, publicKey) {
        let ton = await FreetonInstance.getFreeTON((await networkManager.getNetwork()).network.url);
        const token = await (new Token(tokenRootAddress, ton)).init();

        return await token.getPubkeyBalance(publicKey);
    },

    /**
     * Get token wallet address by public key
     * @param tokenRootAddress
     * @param publicKey
     * @returns {Promise<string>}
     */
    main_getTokenWalletAddress: async function (tokenRootAddress, publicKey) {
        let ton = await FreetonInstance.getFreeTON((await networkManager.getNetwork()).network.url);
        const token = await (new Token(tokenRootAddress, ton)).init();

        return await token.getPubkeyWalletAddress(publicKey);
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
     * Transfer token
     * @param {string} rootTokenAddress Token Root address
     * @param {string} walletAddress Current wallet
     * @param {string} publicKey
     * @param to
     * @param amount
     * @returns {Promise<*>}
     */
    main_tokenTransfer: async function (rootTokenAddress, walletAddress, publicKey, to, amount) {

        if(this.sender !== 'popup') {
            throw EXCEPTIONS.invalidInvoker;
        }

        let ton = await FreetonInstance.getFreeTON((await networkManager.getNetwork()).network.url);

        let keyPair = await getKeysFromDeployAcceptence(publicKey, 'token_transfer', {
            address: walletAddress,
            additionalMessage: `${_('This action sends')} <b>${Utils.showToken(Utils.unsignedNumberToSigned(amount))}</b> ${_('tokens to')} <span class="intextWallet">${to}</span> ${_('wallet.')}`,
        }, undefined, true);

        const token = await (new Token(rootTokenAddress, ton)).init();

        await messenger.rpcCall('popup_showToast', [_('Token transaction created')], 'popup');

        let txInfo = await token.transfer(to, amount, keyPair);

        console.log(txInfo);

        await messenger.rpcCall('popup_showToast', [_('Token transfer complete')], 'popup');

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
    }

    //Simple timeout for initialization
    await Utils.wait(1000)

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
        let password = await messenger.rpcCall('popup_password', ['<span style="color: red">' + _('Invalid password') +'</span><br>', publicKey], 'popup');
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

let messenger, storage, keyring, networkManager, accountManager;

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

    window.freetonCrypto = FreetonCrypto;

    let ton = await FreetonInstance.getFreeTON((await networkManager.getNetwork()).network.url);
    window.tip3 = await (new BroxusTIP3(ton, '0:0c4cad39cf61d92df6ab7c78552441b0524973e282f1e7a6acf5f06773cdc605')).init();

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


    //DeNs

    //FreetonDomains.url;


})()



