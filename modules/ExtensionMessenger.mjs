class ExtensionMessenger {
    constructor(reciver = '*', rpc = {}) {
        this.RPC = rpc;
        this.reciver = reciver;
        this._externalRequests = {};

        //Listen new messages
        browser.runtime.onMessage.addListener(async (msg, sender) => {

            //RPC call
            if(msg.rpc && (msg.target === this.reciver || msg.target === '*')) {
                if(this.RPC[msg.method]) {
                    try {
                        let result = await this.RPC[msg.method](...msg.params);
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
            }

        });
    }

    /**
     * Set RPC interface
     * @param rpc
     */
    setRpc(rpc) {
        this.RPC = rpc;
    }

    /**
     * RPC call
     * @async
     * @param {string} method
     * @param {Array} params
     * @param {string} target
     * @returns {Promise<*>}
     */
    rpcCall(method, params = [], target = '*') {
        return new Promise((resolve, reject) => {
            let requestId = Math.random();
            this._externalRequests[requestId] = (data) => {
                if(data.exception) {
                    return reject(data.result);
                }
                return resolve(data.result);
            }

            browser.runtime.sendMessage({method: method, rpc: true, fromPage: true, requestId, params, target});
        })
    }


}

export default ExtensionMessenger;