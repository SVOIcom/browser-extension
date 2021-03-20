import ExtensionMessenger from "./modules/ExtensionMessenger.mjs";
import TonClientWrapper from "./modules/TonClientWrapper.mjs";
import PrivateStorage from "./modules/PrivateStorage.mjs";
import Keyring from "./modules/Keyring.mjs";

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
        throw new Error('Some exception');
    },
    mainOpenPopup: () => {
        return openPopup();
    },

    /**
     * Contract run
     * @param publicKey
     * @param data
     * @returns {Promise<boolean>}
     */
    main_run: async (publicKey, data) => {
        console.log(publicKey, data);
        let popup = await openPopup();

        //Simple timeout for initialization
        await wait();

        let allowSign = await messenger.rpcCall('popup_testSign', ['Sign this message?', publicKey], 'popup');

        await messenger.rpcCall('popup_close', [], 'popup');

        if(!allowSign) {
            throw new Error('Rejected by user');
        }

        //Sign allowed, make run

        return allowSign;
    },


    /**
     * createRunMessage mock
     * @param {string} publicKey
     * @param {array} data
     * @returns {Promise<*>}
     */
    main_createRunMessage: async (publicKey, data) => {
        console.log(publicKey, data);
        let popup = await openPopup();

        //Simple timeout for initialization
        await wait();

        let allowSign = await messenger.rpcCall('popup_testSign', ['Sign this message?', publicKey], 'popup');


        if(!allowSign) {
            throw new Error('Rejected by user');
        }

        //Sign allowed, make run

        let ton = await getFreeTON();


        //Action requires password
        let password = await messenger.rpcCall('popup_password', ['', publicKey], 'popup');
        if(!password) {
            throw new Error('Rejected by user');
        }

        console.log('PASSWORD', password);

        try {
            data.keyPair = await keyring.extractKey(publicKey, password);
        } catch (e) {
            let password = await messenger.rpcCall('popup_password', ['<span style="color: red">Invalid password</span><br>', publicKey], 'popup');
            if(!password) {
                throw new Error('Rejected by user');
            }

            try {
                data.keyPair = await keyring.extractKey(publicKey, password);
            } catch (e) {
                throw new Error('Invalid password');
            }
        }


        await messenger.rpcCall('popup_close', [], 'popup');

        return await ton.contracts.createRunMessage(data);

    }
}

async function openPopup() {
    return browser.windows.create({
        url: 'popup.html',
        type: 'popup',
        width: 310,
        height: 536,
        // left: position.x,
        //  top: position.y,
    });
}

//Messenger channel
let messenger = new ExtensionMessenger('background', RPC);
window.messenger = messenger;

let storage = await (new PrivateStorage()).initialize();
window.privateStorage = storage;

let keyring = await (new Keyring()).init();
window.keyring = keyring;

/**
 * Get TON client
 * @returns {Promise<TonClientWrapper>}
 */
async function getFreeTON() {
    window.TONClient.setWasmOptions({binaryURL: 'ton-client/tonclient.wasm'});
    return await (new TonClientWrapper(true)).create({
        servers: ['net.ton.dev']
    });
}
