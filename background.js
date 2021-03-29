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

console.log('IM BACKGROUND');

const wait = (timeout = 500) => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout)
    })
}

const RPC = {
    'test': async (a, b) => {
        return a + b;
    },
    'fall': async () => {
        throw EXCEPTIONS.testException;
    },
    mainOpenPopup: () => {
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

        let ton = await getFreeTON((await networkManager.getNetwork()).network.url);
        return await ton.contracts.run(data);
    },

    main_runLocal: async (publicKey, data) => {
        console.log(publicKey, data);
        data.keyPair = await getKeysFromDeployAcceptence(publicKey, 'runLocal', data);

        let ton = await getFreeTON((await networkManager.getNetwork()).network.url);
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

        let ton = await getFreeTON((await networkManager.getNetwork()).network.url);
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
    main_changeNetwork: async (network) => {
        //TODO checking sender
        return await networkManager.changeNetwork(network);
    },

    main_changeAccount: async (publicKey) => {
        //TODO checking sender
        if(!await keyring.isKeyInKeyring(publicKey)) {
            await messenger.rpcCall('popup_alert', ['Public key not found'], 'popup');
            throw EXCEPTIONS.publicKeyNotFound
        }
        await accountManager.changeAccount(publicKey);
        return true;
    },

    main_getAccount: async () => {
        return await accountManager.getAccount();
    },

    main_setNetworkWallet: async (publicKey, network, wallet) => {
        return await accountManager.setPublicKeyNetworkWallet(publicKey, network, wallet);
    },
}


/**
 * Get TON client
 * @returns {Promise<TonClientWrapper>}
 */
async function getFreeTON(server = 'net.ton.dev') {
    window.TONClient.setWasmOptions({binaryURL: 'ton-client/tonclient.wasm'});
    return await (new TonClientWrapper(true)).create({
        servers: [server]
    });
}

/**
 * Open accept sign message
 * @param publicKey
 * @param type
 * @param callingData
 * @param acceptMessage
 * @returns {Promise<{public, secret: *}>}
 */
async function getKeysFromDeployAcceptence(publicKey, type = 'run', callingData, acceptMessage = '') {
    let popup = await uiUtils.openPopup();

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


    await messenger.rpcCall('popup_close', [], 'popup');

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



