/*
  _____ ___  _   ___        __    _ _      _
 |_   _/ _ \| \ | \ \      / /_ _| | | ___| |_
   | || | | |  \| |\ \ /\ / / _` | | |/ _ \ __|
   | || |_| | |\  | \ V  V / (_| | | |  __/ |_
   |_| \___/|_| \_|  \_/\_/ \__,_|_|_|\___|\__|

 */
/**
 * @name FreeTON browser wallet and injector
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */

import MESSAGES from "./const/Messages.mjs";
import Utils from "./utils.mjs";

class NewTonClientWrapper extends EventEmitter3 {

    /**
     * Possible events
     * @type {{NETWORK_CHANGED: string}}
     */
    EVENTS = {
        NETWORK_CHANGED: 'networkChanged',
        ACCOUNT_CHANGED: 'accountChanged',
    }


    constructor(disableMocks = false) {
        super();
        this._rawTon = null;
        this._externalRequests = {};
        this.disableMocks = disableMocks;

        this._setupAccounts();
        this._setupNetwork();
        this._setupMisc();
    }

    /**
     * Create Wrapped TONClient instance
     * @param options
     * @returns {Promise<TonClientWrapper>}
     */
    async create(options = {}) {

        console.log('Warning: Using ton-client-js library is not recommended due to the incomplete implementation of integration with the extension. Use this library for additional functions only.')

        //Configure RPC
        if(this._rawTon === null) {
            window.addEventListener("message", async (event) => {
                // We only accept messages from ourselves
                if(event.source != window) {
                    return;
                }

                //is RPC call
                if(event.data.requestId && event.data.result !== undefined) {
                    if(this._externalRequests[event.data.requestId]) {
                        this._externalRequests[event.data.requestId](event.data);
                        delete this._externalRequests[event.data.requestId];
                    }
                }

                //Other messages
                if(event.data.broadcastMessage) {
                    switch (event.data.broadcastMessage) {

                        //Network changed. Sets new params
                        case MESSAGES.NETWORK_CHANGED:
                            let network = await this.network.get();
                            await this.setServers(network.network.url);
                            break;

                        case MESSAGES.ACCOUNT_CHANGED:
                            this.emit(this.EVENTS.ACCOUNT_CHANGED, await this.accounts.getAccount());
                            break;
                        default:
                            //nop
                            break;
                    }
                }
            });
        }

        this._rawTon = new tonclientWeb.TonClient({
            ...options, network: {
                server_address: (await this._extensionRPCCall('main_getNetwork')).network.url
            }
        });


        //Cloning internal methods and objects
        for (let key of Object.keys(this._rawTon)) {
            this[key] = this._rawTon[key];
        }

        if(!this.disableMocks) {
            this._configureMockedMethods();
        }

        return this;
    }

    /**
     * Change network
     * @param servers
     * @returns {Promise<void>}
     */
    async setServers(servers = []) {
        if(!Array.isArray(servers)) {
            servers = [servers];
        }

        //Destroy TONClient object
        await this._rawTon.close();


        //Create new one
        await this.create({
            ...this.options,
            network: {
                server_address: servers[0]
            }
        })

        this.emit(this.EVENTS.NETWORK_CHANGED, servers);
    }

    /**
     * Setup mocks
     * @private
     */
    _configureMockedMethods() {

        let that = this;

    }


    /**
     * Mock TON module methods
     * @param {string} module
     * @param {string} method
     * @param {function} mockFunction
     * @private
     */
    _mockTonMethod(module, method, mockFunction) {

        //Save original method
        let mockedMethod = this[module][method];

        //Mock method
        this[module][method] = function () {

            //Run mocker
            return mockFunction.apply(this, [mockedMethod, arguments]);
        }

    }

    /**
     * Call extension method
     * @async
     * @param {string} method
     * @param {Array} params
     * @param {string} target
     * @returns {Promise<*>}
     * @private
     */
    _extensionRPCCall(method, params = [], target = '*') {
        return new Promise((resolve, reject) => {
            let requestId = Math.random();
            this._externalRequests[requestId] = (data) => {
                if(data.exception) {
                    return reject(data.result);
                }
                return resolve(data.result);
            }
            window.postMessage({method: method, rpc: true, fromPage: true, requestId, params, target}, "*");
        })
    }

    /**
     * Create accounts subobject
     * @private
     */
    _setupAccounts() {

        let that = this;
        /**
         * Accounts functionality
         * @type {{getPublicKeys: (function(): *), isKeyInKeyring: (function(*): *), getAccount: (function(): *), getWalletHistory: (function(*, *=): *), getWalletBalance: (function(*): *), getWalletInfo: (function(): *|null)}}
         */
        this.accounts = {
            /**
             * Get all public keys
             * @returns {Promise<*>}
             */
            getPublicKeys: async () => {
                return await that._extensionRPCCall('main_getPublicKeys');
            },

            /**
             * Is public key exists in keyring
             * @param {string} publicKey
             * @returns {Promise<*>}
             */
            isKeyInKeyring: async (publicKey) => {
                return await that._extensionRPCCall('main_isKeyInKeyring', [publicKey]);
            },

            /**
             * Returns current account object
             * @returns {Promise<*>}
             */
            getAccount: async () => {
                return await that._extensionRPCCall('main_getAccount');
            },
            /**
             * Returns current wallet object
             * @returns {Promise<*|null>}
             */
            getWalletInfo: async () => {
                let networkName = (await that.network.get()).name;
                let wallets = (await that.accounts.getAccount()).wallets;
                return wallets[networkName] ? wallets[networkName] : null;
            },
            /**
             * Returns wallet history
             * @param {string} address
             * @param {number} amount
             * @returns {Promise<[]>}
             */
            getWalletHistory: async (address, amount = 20) => {
                return await that._extensionRPCCall('main_getWalletHistory', [address, amount]);
            },
            /**
             * Returns current wallet balance
             * @param address
             * @returns {Promise<*>}
             */
            getWalletBalance: async (address) => {
                return await that._extensionRPCCall('main_getWalletBalance', [address]);
            },

            /**
             * Request tokens transfer
             * @param publicKey
             * @param from
             * @param to
             * @param amount
             * @param payload
             * @param bounce
             * @returns {Promise<void>}
             */
            walletTransfer: async (publicKey, from, to, amount, payload = '', bounce = false) => {
                return await that._extensionRPCCall('main_transfer', [from, publicKey, to, amount, payload, bounce]);
            }
        }
    }

    /**
     * Extension objects
     * @private
     */
    _setupMisc() {

        let that = this;
        /**
         * Extension methods
         * @type {{getVerision: (function(): *)}}
         */
        this.extension = {
            /**
             * Returns extension version
             * @returns {Promise<*>}
             */
            getVerision: async () => {
                return await that._extensionRPCCall('main_getMiscConstant', ['VERSION']);
            },
        }

        /**
         * Extended crypto
         * @type {{generateSeedPhrase: (function(): *), getKeysFromSeedPhrase: (function(*): *)}}
         */
        this.extCrypto = {
            /**
             * Returns random seed phrase
             * @returns {Promise<string>}
             */
            generateSeedPhrase: async () => {
                return await that._extensionRPCCall('main_generateSeedPhrase');
            },
            /**
             * Returns keypair object
             * @param {string} seed
             * @returns {Promise<*>}
             */
            getKeysFromSeedPhrase: async (seed) => {
                return await that._extensionRPCCall('main_getKeysFromSeedPhrase', [seed]);
            },
        }

        /**
         * Utilities methods
         * @type {{unsignedNumberToSigned: ((function(*=, *=): number)|*), numberToUnsignedNumber: ((function(*=, *=): number)|*), extractTxId: ((function(*): (null|*))|*), asyncWait: ((function(*=): Promise<unknown>)|*), shortenPubkey: ((function(*=, *=): *)|*), hexString2DecString: ((function(string): string)|*), fetchJSON: ((function(string): Promise<*>)|*), hexToBase64: ((function(*): string)|*), hex2String: ((function(*=): *)|*), validateTONAddress: ((function(string): boolean)|*)}}
         */
        this.utils = {
            unsignedNumberToSigned: Utils.unsignedNumberToSigned,
            numberToUnsignedNumber: Utils.numberToUnsignedNumber,
            asyncWait: Utils.wait,
            shortenPubkey: Utils.shortenPubkey,
            hexString2DecString: Utils.hexString2DecString,
            extractTxId: Utils.getTxId,
            hexToBase64: Utils.hexToBase64,
            fetchJSON: Utils.fetchJSON,
            validateTONAddress: Utils.validateTONAddress,
            hex2String: Utils.hex2String,
            string2Hex: Utils.string2Hex

        }
    }

    /**
     * Create networks subobject
     * @private
     */
    _setupNetwork() {

        let that = this;
        /**
         * Network objects
         * @type {{get: (function(*=): *), getNetworks: (function(): *)}}
         */
        this.network = {
            /**
             * Get current network or network by name
             * @param {string} name
             * @returns {Promise<*>}
             */
            get: async (name = undefined) => {
                return await that._extensionRPCCall('main_getNetwork', [name]);
            },
            /**
             * Get all networks
             * @returns {Promise<*>}
             */
            getNetworks: async () => {
                return await that._extensionRPCCall('main_getNetworks');
            },
        }
    }
}

export default NewTonClientWrapper;