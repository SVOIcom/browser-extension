import ExtensionMessenger from "./modules/ExtensionMessenger.mjs";

const RPC = {
    'popup_test': async (a, b) => {
        return a * b;
    },
    'popup_fall': async () => {
        throw new Error('Some exception');
    }
}
let messenger = new ExtensionMessenger('popup', RPC);