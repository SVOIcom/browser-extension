import ExtensionMessenger from "./modules/ExtensionMessenger.mjs";
import TonClientWrapper from "./modules/TonClientWrapper.mjs";

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
        console.log(popup);

        //Simple timeout for initialization
        await wait();

        let allowSign = await messenger.rpcCall('popup_testSign', ['Sign this message?', publicKey], 'popup');

        await messenger.rpcCall('popup_close', [], 'popup');

        if(!allowSign) {
            throw new Error('Rejected by user');
        }


        console.log('POPUP RESULT', allowSign);
        return allowSign;
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

async function getFreeTON() {
    window.TONClient.setWasmOptions({binaryURL: 'ton-client/tonclient.wasm'});
    return await (new TonClientWrapper(true)).create({
        servers: ['net.ton.dev']
    });
}

let freeton = await getFreeTON();
window.freeton = freeton;