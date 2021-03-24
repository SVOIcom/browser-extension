class ExtensionMessenger {
    constructor(reciver = '*', rpc = {}) {
        this.RPC = rpc;
        this.reciver = reciver;
        this._externalRequests = {};

        //Listen new messages
        browser.runtime.onMessage.addListener((msg, sender) => {

            //RPC call
            (async () => {
                if(msg.rpc && (msg.target === this.reciver || msg.target === '*')) {
                    if(this.RPC[msg.method]) {

                        let resultMsg = null;
                        try {
                            let result = await this.RPC[msg.method](...msg.params);
                            resultMsg = {
                                rpc: true,
                                requestId: msg.requestId,
                                result,
                                exception: false
                            }

                        } catch (e) {
                            resultMsg = {
                                rpc: true,
                                requestId: msg.requestId,
                                result: {
                                    message: e.message,
                                    code: e.code,
                                    lineNumber: e.lineNumber,
                                    fileName: e.fileName,
                                },
                                exception: true
                            };
                        }

                        if(sender.tab) {
                            resultMsg.target = '*';
                            await browser.tabs.sendMessage(sender.tab.id, resultMsg)
                        } else {
                            resultMsg.target = msg.sender;
                            await browser.runtime.sendMessage(resultMsg);
                        }


                    }
                }

            })();

            //Income messages
            if(msg.requestId && msg.result !== undefined) {
                if(this._externalRequests[msg.requestId]) {
                    this._externalRequests[msg.requestId](msg);
                    delete this._externalRequests[msg.requestId];
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
                    console.log('EXCEPTION MAKED', data)
                    return reject(data.result);
                }
                return resolve(data.result);
            }

            browser.runtime.sendMessage({
                method: method,
                rpc: true,
                fromPage: true,
                requestId,
                params,
                target,
                sender: this.reciver
            });
        })
    }


}

export default ExtensionMessenger;