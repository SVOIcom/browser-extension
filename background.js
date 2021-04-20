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
        console.log(publicKey, data);
        data.keyPair = await getKeysFromDeployAcceptence(publicKey, 'run', data);

        let ton = await FreetonInstance.getFreeTON((await networkManager.getNetwork()).network.url);
        return await ton.contracts.run(data);
    },

    main_runLocal: async (publicKey, data) => {
        console.log(publicKey, data);
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
        console.log(publicKey, data);
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

    main_getNetwork: async (name = undefined) => {
        return await networkManager.getNetwork(name);
    },
    main_getNetworks: async () => {
        return await networkManager.getNetworks();
    },
    main_changeNetwork: async function (network) {
        if(this.sender !== 'popup') {
            throw EXCEPTIONS.invalidInvoker;
        }
        return await networkManager.changeNetwork(network);
    },

    main_changeAccount: async function (publicKey) {
        if(this.sender !== 'popup') {
            throw EXCEPTIONS.invalidInvoker;
        }
        if(!await keyring.isKeyInKeyring(publicKey)) {
            await messenger.rpcCall('popup_alert', ['Public key not found'], 'popup');
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

        //TODO Check sender

        let ton = await FreetonInstance.getFreeTON((await networkManager.getNetwork()).network.url);
        let wallet = await (new Wallet(from, ton)).init();

        let network = await networkManager.getNetwork();

        console.log(amount);

        let keyPair = await getKeysFromDeployAcceptence(publicKey, 'transfer', {
            address: from,
            additionalMessage: `Ths action sends <b>${Utils.showToken(Utils.unsignedNumberToSigned(amount))}</b> ${network.network.tokenIcon} to <span class="intextWallet">${to}</span> wallet.`,
        }, undefined, true);

        await messenger.rpcCall('popup_showToast', ['Transaction created'], 'popup');


        return await wallet.transfer(to, amount, payload, keyPair);
    },

    main_createWallet: async function (publicKey, type) {

        if(this.sender !== 'popup') {
            throw EXCEPTIONS.invalidInvoker;
        }

        let network = await networkManager.getNetwork();
        let contractDeployer = new FreetonDeploy(network.network.url);
        return await contractDeployer.createWallet(publicKey, type);
    },

    main_deployWallet: async function (publicKey, type) {

        if(this.sender !== 'popup') {
            throw EXCEPTIONS.invalidInvoker;
        }

        let network = await networkManager.getNetwork();

        let keyPair = await getKeysFromDeployAcceptence(publicKey, 'Deploy contract', {
            //address: from,
            additionalMessage: `Ths action deploys ${type} wallet contract.`,
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
        let password = await messenger.rpcCall('popup_password', ['<span style="color: red">Invalid password</span><br>', publicKey], 'popup');
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


})()



