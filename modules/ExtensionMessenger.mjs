/**
 * @name ScaleWallet - Everscale browser wallet and injector
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */


class ExtensionMessenger extends EventEmitter3 {
    constructor(reciver = '*', rpc = {}) {
        super();

        this.RPC = rpc;
        this.reciver = reciver;
        this._externalRequests = {};

        //Listen new messages

        const eventsHandler = (msg, sender) => {

            //RPC call
            (async () => {
                /*if(this.reciver === 'page' && msg.target === 'page') {
                    console.log('EVENT HANDLER', msg, sender, this.reciver);
                }*/


                if(msg.rpc && (msg.target === this.reciver || msg.target === '*')) {

                    this.emit('rawRPC', msg);

                    this.RPC.sender = msg.sender;
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
                                    fullExceptionEncoded: JSON.stringify(e),
                                    fullException: JSON.parse(JSON.stringify(e))
                                },
                                exception: true
                            };
                        }

                        if(sender.tab) {
                            resultMsg.target = '*';
                            await browser.tabs.sendMessage(sender.tab.id, resultMsg)
                        } else {
                            resultMsg.target = msg.sender;
                            if(window._isApp) {
                                let postingObject = window.top;
                                if(window._isTop) {
                                    postingObject = document.querySelector('iframe').contentWindow;
                                }

                                postingObject.postMessage(resultMsg, '*');

                            } else {
                                await browser.runtime.sendMessage(resultMsg);
                            }


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
        }

        if(window._isApp) {
            window.addEventListener('message', (event) => {
                //console.log('INCOME EVENT', event);
                eventsHandler(event.data, event.data.sender)
            })
        } else {
            browser.runtime.onMessage.addListener(eventsHandler);
        }
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

            if(window._isApp) {
                //console.log('SEND MESSAGE', this.reciver, method)

                let postingObject = window.top;
                if(window._isTop) {
                    postingObject = document.getElementById('backgroundWorker').contentWindow;
                }

                postingObject.postMessage({
                    method: method,
                    rpc: true,
                    //fromPage: true,
                    requestId,
                    params,
                    target,
                    sender: this.reciver
                }, '*');
            } else {
                browser.runtime.sendMessage({
                    method: method,
                    rpc: true,
                    fromPage: true,
                    requestId,
                    params,
                    target,
                    sender: this.reciver
                });
            }
        })
    }

    /**
     * Broadcast message to tabs
     * @param message
     * @returns {Promise<void>}
     * @private
     */
    async _broadcastTabsMessage(message) {
        let tabs = await browser.tabs.query({});
        for (let tab of tabs) {
            try {
                await browser.tabs.sendMessage(tab.id, message);
            } catch (e) {
            }
        }
    }

    /**
     * Broadcast defined message to all tabs
     * @param type
     * @param data
     * @returns {Promise<void>}
     */
    async broadcastTabsMessage(type, data = {}) {
        if(window._isApp) {
            return;
        }
        await this._broadcastTabsMessage({broadcastMessage: type, data, target: '*'})
    }

    /**
     * Send message to iframe
     * @param message
     * @returns {Promise<void>}
     */
    async postIframeMessage(message) {
        let postingObject = window.top;
        if(window._isTop) {
            postingObject = document.querySelector('iframe').contentWindow;
        }

        postingObject.postMessage(message, '*');
    }


}

export default ExtensionMessenger;