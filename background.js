import ExtensionMessenger from "./modules/ExtensionMessenger.mjs";

console.log('IM BACKGROUND');

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
        //await openPopup();
        let result = await messenger.rpcCall('popup_test', [1, 16], 'popup');
        console.log('POPUP RESULT', result);
        return confirm(`Sign this message? Pubkey: ${publicKey}`);
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