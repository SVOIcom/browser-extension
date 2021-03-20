import ExtensionMessenger from "./modules/ExtensionMessenger.mjs";

const RPC = {
    'popup_test': async (a, b) => {
        return a * b;
    },
    'popup_fall': async () => {
        throw new Error('Some exception');
    },
    popup_testSign: async (message, publicKey) => {
        return confirm(`${message} Pubkey: ${publicKey}`);
    },
    popup_close: async () => {
        setTimeout(() => {
            window.close();
        }, 10);
        return true;
    }
}
let messenger = new ExtensionMessenger('popup', RPC);