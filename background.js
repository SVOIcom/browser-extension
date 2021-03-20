import MESSAGES from "./modules/const/messages.mjs";

console.log('IM BACKGROUND');

const RPC = {
    'test': async (a, b) => {
        return a + b;
    },
    'fall': async () => {
        throw new Error('Some exception');
    }
}

browser.runtime.onMessage.addListener(async (msg, sender) => {

    //RPC call
    if(msg.rpc) {
        try {
            let result = await RPC[msg.method](...msg.params);
            await browser.tabs.sendMessage(sender.tab.id, {
                rpc: true,
                requestId: msg.requestId,
                result,
                exception: false
            })
        } catch (e) {
            await browser.tabs.sendMessage(sender.tab.id, {
                rpc: true,
                requestId: msg.requestId,
                result: {
                    message: e.message,
                    code: e.code,
                    lineNumber: e.lineNumber,
                    fileName: e.fileName,
                },
                exception: true
            })
        }
    }

});
