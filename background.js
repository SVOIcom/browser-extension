import MESSAGES from "./modules/const/messages.mjs";
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
let messenger = new ExtensionMessenger('background', RPC);
