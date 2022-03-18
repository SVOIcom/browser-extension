/**
 * @name Everscale Wallet EVERWallet emulation proxy
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */

const MAINNET_NAME = 'mainnet';

const EMULATED_VERSION = '0.2.27';
const EMULATED_VERSION_NUMERIC = 2027;

const SUBSCRIPTIONS_INTERVAL = 10000;

let that = null;


class OutputDecoder {
    constructor(output, functionAttributes, BigNumber) {
        this.output = output;
        this.functionAttributes = functionAttributes;
        this.BigNumber = BigNumber;
    }

    decode_value(encoded_value, schema, value) {
        switch (schema.type) {
            case 'bytes':
                return this.decodeBytes(encoded_value);
            case 'bytes[]':
                return this.decodeBytesArray(encoded_value);
            case 'cell':
                return encoded_value;
            case 'uint256':
            case 'uint160':
            case 'uint128':
            case 'uint64':
            case 'uint32':
            case 'uint16':
            case 'uint8':
            case 'int256':
            case 'int160':
            case 'int128':
            case 'int64':
            case 'int32':
            case 'int16':
            case 'int8':
                return this.decodeInt(encoded_value);
            case 'uint256[]':
            case 'uint128[]':
            case 'uint64[]':
            case 'uint32[]':
            case 'uint16[]':
            case 'uint8[]':
            case 'int256[]':
            case 'int128[]':
            case 'int64[]':
            case 'int32[]':
            case 'int16[]':
            case 'int8[]':
                return this.decodeIntArray(encoded_value);
            case 'bool':
                return this.decodeBool(encoded_value);
            case 'address':
            case 'address[]':
                return encoded_value;
            case 'tuple':
                return this.decodeTuple(encoded_value, schema.components);
            case 'tuple[]':
                let tuples = [];
                for (let tuple of encoded_value) {
                    tuples.push(this.decodeTuple(tuple, schema.components));
                }
                return tuples;
            case 'string':
                return encoded_value;

            //Дополнительные случаи-исключения TODO требует доработки для поддержки всех типов
            case 'map(address,uint128)':
            case 'map(address,address)':
                if(Object.keys({}).length === Object.keys(encoded_value).length) {
                    return [];
                }

                let arrayMap = [];
                for (let key of Object.keys(encoded_value)) {
                    arrayMap.push([key, encoded_value[key]]);
                }

                //debugger;
                return arrayMap;

            default:
                console.log('EVERWALLET: Decoder gets WTF', schema.type, encoded_value);
                debugger;
        }
    }

    decodeBytes(value) {
        return Buffer.from(value, 'hex').toString('base64');
    }

    decodeBytesArray(value) {
        return value.map(v => this.decodeBytes(v));
    }

    decodeBool(value) {
        return Boolean(value);
    }

    decodeInt(value) {
        return this.BigNumber(value).toFixed();
    }

    decodeIntArray(value) {
        return value.map(hexInt => BigInt(hexInt));
    }

    decode() {
        const outputDecoded = this.decodeTuple(
            this.output,
            this.functionAttributes.outputs
        );

        // Return single output without array notation
        /*if (Object.keys(outputDecoded).length === 1) {
            return Object.values(outputDecoded)[0];
        }*/

        return outputDecoded;
    }

    decodeTuple(value, schema) {
        const res_struct = {};

        schema.forEach((field_value_schema) => {
            const field_value = value[field_value_schema.name];
            res_struct[field_value_schema.name] = this.decode_value(field_value, field_value_schema, value)
        });

        return res_struct;
    }
}

/**
 * CrystalWallet emulation proxy
 */
class EVERWalletEmulationProxy extends EventEmitter3 {

    constructor() {
        super();
        this.verbose = false;
    }

    /**
     * Initialize proxy
     * @returns {Promise<ExtraTONEmulationProxy>}
     */
    async init() {
        if(that) {
            return that;
        }

        this.BigNumber = (await import('https://unpkg.com/bignumber.js@latest/bignumber.mjs')).default;

        this.ton = await getTONWeb();
        this.everClient = await getEverClient();
        that = this;

        this.subscriptionsStates = {};
        this.subscriptionsTransactions = {};

        this.subscriptionsAddresses = [];

        setInterval(async () => {
            await this._checkSubscriptions();
        }, SUBSCRIPTIONS_INTERVAL);

        return this;
    }

    /**
     * ExtraTON request endpoint
     * @param request Params
     * @returns {Promise<*>}
     */
    request(request) {
        let {method, params} = request;
        let address, publicKey;


        return new Promise(async (resolve, reject) => {
            if(!that) {
                await this.init();
            }
            setTimeout(async () => {


                try {
                    let result = await (async () => {
                        if(that.verbose) {
                            console.log('EVERWALLET: EMULATION CALL:', method, params);
                        }
                        switch (method) {
                            case 'getVersion':
                                return EMULATED_VERSION;
                            case 'getNetwork':
                                return await that._getNetwork();
                            case 'runGet':
                                return await that._runGet(params);
                            case 'deploy':
                                return await that._deploy(params);
                            case 'waitDeploy':
                            case 'waitRun':
                                return await that._waitMessage(params);
                            case'getPublicKey':
                                return (await that.ton.accounts.getAccount()).public;

                            case'getAddress':
                                return (await that.ton.accounts.getWalletInfo()).address;
                            case 'transfer':
                                return that._transfer(params);

                            case 'runLocal':
                                try {
                                    //   console.log('!!! runLocal', params);
                                    let runLocalResults = await that._runLocal(params.functionCall.abi, params.address, params.functionCall.method, params.functionCall.params);
                                    //console.log('!!! runLocalRESULT', runLocalResults);
                                    return {...runLocalResults, code: 0};
                                } catch (e) {
                                    if(that.verbose) {
                                        console.log('EVERWALLET: !!! runLocalERROR', e, params);
                                    }
                                    //throw {code: 2, message: e.message, data: {originalError: e}};
                                    throw {code: 2, message: 'runLocal: Account not found', data: {originalError: e}};
                                }

                            /**
                             * Base provider state info
                             */
                            case 'getProviderState':
                                address = (await that.ton.accounts.getWalletInfo()).address;
                                publicKey = (await that.ton.accounts.getAccount()).public;

                                // console.log('getProviderState', address, publicKey);

                                return {
                                    "version": EMULATED_VERSION,
                                    "numericVersion": EMULATED_VERSION_NUMERIC,
                                    "selectedConnection": MAINNET_NAME,
                                    "supportedPermissions": [
                                        "basic",
                                        "accountInteraction"
                                    ],
                                    "permissions": {
                                        "accountInteraction": {
                                            "address": address,
                                            "contractType": "SafeMultisigWallet",
                                            "publicKey": publicKey
                                        },
                                        "basic": true
                                    },
                                    "subscriptions": {}
                                };

                            /**
                             * Requesting permissions. Emits event with permissions
                             */
                            case 'requestPermissions':
                                address = (await that.ton.accounts.getWalletInfo()).address;
                                publicKey = (await that.ton.accounts.getAccount()).public;

                                let newPermissions = {
                                    "accountInteraction": {
                                        "address": address,
                                        "contractType": "SafeMultisigWallet",
                                        "publicKey": publicKey
                                    },
                                    "basic": true
                                };

                                that.emit('permissionsChanged', {permissions: newPermissions});

                                //console.log('requestPermissions', address, publicKey);
                                return newPermissions;

                            /**
                             * Request account info
                             */
                            case 'getFullContractState':
                                let contractState = await that._getFullContractState(params.address);
                                //console.log('!!!!!!getFullContractState', params, contractState);
                                return contractState;

                            case 'getTransactions':
                                let transactions = await that._getTransactions(params.address);
                                //console.log('Transactions', transactions);
                                return {transactions};

                            case 'decodeTransaction':
                                try {
                                    let decodedTransaction = await that._decodeTransaction(params.transaction, params.abi, params.method);

                                    if(!decodedTransaction) {
                                        return {};
                                    }

                                    //console.log('!!!Decoded transaction', decodedTransaction);
                                    return decodedTransaction;
                                } catch (e) {
                                    //console.log('EVERWALLET: !!!Error in decodeTransaction', e, params);
                                    return {};
                                }


                            /*
                            * Creates payload for transaction and sends it to the blockchain
                             */
                            case 'sendMessage':
                                address = (await that.ton.accounts.getWalletInfo()).address;
                                publicKey = (await that.ton.accounts.getAccount()).public;

                                let transferResult = null;
                                let messagePayload = null;
                                if(!params.payload) {
                                    transferResult = await that.everClient.accounts.walletTransfer(publicKey, params.sender, params.recipient, params.amount, '', params.bounce);
                                } else {
                                    messagePayload = await that._payload(params.payload.abi, params.payload.method, params.payload.params);
                                    transferResult = await that.everClient.accounts.walletTransfer(publicKey, params.sender, params.recipient, params.amount, messagePayload, params.bounce);
                                }


                                let transaction = await that._getTransaction(transferResult.transaction.id);

                                console.log('EVERWALLET: SendMSG:', messagePayload, transferResult, transaction);
                                return {transaction};

                            case 'signDataRaw':
                                let sign = await that.everClient.accounts.signDataRaw(params.publicKey, params.data);
                                //console.log('!!!Sign', sign);
                                return sign;

                            case 'subscribe':
                                await that.subscribe(params.address);
                                if(!params.subscriptions.state && !params.subscriptions.transactions) {
                                    await that.unsubscribe(params.address);
                                }
                                return {
                                    "state": true,
                                    "transactions": true
                                };

                            case 'unsubscribe':
                                await that.subscribe(params.address);
                                return {
                                    "state": false,
                                    "transactions": false
                                };
                            case 'disconnect':
                                that.emit('permissionsChanged', {permissions: {}});
                                return {};

                            case 'packIntoCell':
                                let packed = await that.everClient.everscale.packIntoCell(params);
                                //TODO Это костыль но почему то пейлоад в Burn токена не проходит
                                if(packed.boc === 'te6ccgEBAgEABQABAAEAAA==') {
                                    return {boc: ''}
                                }
                                return packed;

                            case 'unpackFromCell':
                                return await that.everClient.everscale.unpackFromCell(params);

                            case 'decodeTransactionEvents':
                                return await that.everClient.everscale.decodeTransactionEvents(params);
                        }

                        throw new Error('Unsupported method ' + method);
                    })()
                    // console.log('LL', result)
                    return resolve(result);
                } catch (e) {
                    console.log('EVERWALLET: !!!Emulator error', e)
                    reject(e);
                }
            }, 10);
        })

    }

    async subscribe(address) {
        this.subscriptionsAddresses.push(address);
        await this._checkSubscriptions(true);
    }

    async unsubscribe(address) {
        let index = this.subscriptionsAddresses.includes(address);
        if(index !== -1) {
            this.subscriptionsAddresses.splice(index, 1);
        }
    }

    async _checkSubscriptions(noNotify = false) {
        for (let address of this.subscriptionsAddresses) {

            //In case we just simplified emulator we just send all transactions as transactionsFound event every check
            let transactions = await this._getTransactions(address);
            if(JSON.stringify(transactions) !== JSON.stringify(this.subscriptionsTransactions[address])) {
                if(!noNotify) {
                    this.emit('transactionsFound', {address, transactions});
                }
                this.subscriptionsTransactions[address] = transactions;
            }


            let state = await this._getFullContractState(address);

            if(JSON.stringify(state) !== JSON.stringify(this.subscriptionsStates[address])) {
                if(!noNotify) {
                    this.emit('contractStateChanged', {address, state: state.state});
                }
                this.subscriptionsStates[address] = state;
            }


        }
    }


    /**
     * Extraton get network wrapper
     * @returns {Promise<*>}
     * @private
     */
    async _getNetwork() {
        let currentNetwork = await this.ton.network.get();
        return {
            id: (currentNetwork.name === MAINNET_NAME) ? 1 : 2,
            server: currentNetwork.network.url,
            explorer: currentNetwork.network.explorer
        }
    }

    async _getFullContractState(address) {
        let TON = this.everClient;

        let contractState = (await TON.net.query_collection({
            collection: 'accounts',
            filter: {id: {eq: address}},
            result: 'boc balance acc_type'
        })).result[0];

        if(!contractState || contractState.balance === undefined) {
            return {};
        }

        let lastTx = (await this._getTransactions(address)).shift();

        return {
            "state": {
                "balance": Number(contractState.balance),
                "genTimings": { //TODO WTF is that? Check it
                    "genLt": "0",
                    "genUtime": 0
                },
                "lastTransactionId": { //TODO make it real
                    ...lastTx.id
                    /*"isExact": true,
                    "lt": "24188629000001",
                    "hash": "54e00fa3aaeac28c1d630f2d754d1df59f4c71eb40207feffe3c1d05c27d93b2"*/
                },
                "isDeployed": contractState.acc_type !== 3 ? true : false,
                "boc": contractState.boc
            }
        }

    }

    async _decodeMessage(msg, abi) {
        let TON = this.everClient;
        let result = await TON.abi.decode_message_body({
            body: msg.body,
            is_internal: true,
            abi: {
                type: 'Contract',
                value: abi
            }
        });

        return result;
    }

    async _decodeTransaction(tx, abi, methods) {
        let TON = this.everClient;

        if(typeof abi === 'string') {
            abi = JSON.parse(abi);
        }

        try {
            let result = await this._decodeMessage(tx.inMessage, abi);

            return {
                method: result.name,
                input: result.value,
                output: result.output,
            }
        } catch (e) {
            return null;
        }

    }

    _formatMessage(msg) {
        return {
            ...msg,
            bodyHash: msg.body_hash,
            value: msg.value ? Number(msg.value) : 0,
        }
    }

    _formatTransaction(tx) {

        let outMessages = [];

        for (let msg of tx.out_messages) {
            outMessages.push(this._formatMessage(msg));
        }

        return {
            ...tx,
            id: {
                hash: tx.id,
                lt: Number(tx.lt)
            },
            prevTransactionId: {
                hash: tx.prev_trans_hash,
                lt: Number(tx.prev_trans_lt)
            },
            createdAt: Number(tx.now),
            origStatus: tx.orig_status_name?.toLowerCase(),
            endStatus: tx.end_status_name?.toLowerCase(),
            totalFees: tx.total_fees ? Number(tx.total_fees) : 0,
            exitCode: 0, //TODO Dont know where get it
            inMessage: this._formatMessage(tx.in_message),
            outMessages
        }

    }

    async _getMessage(id) {
        let TON = this.everClient;
        return (await TON.net.query_collection({
            collection: 'messages',
            filter: {id: {eq: id}},
            result: 'id src dst body body_hash created_at value bounce bounced'
        })).result[0];
    }

    async _getTransactions(address) {
        let TON = this.everClient;

        let transactionsRaw = (await TON.net.query_collection({
            collection: 'transactions',
            filter: {account_addr: {eq: address}},
            order: [
                {path: "now", direction: "DESC"}],
            result: 'id prev_trans_hash prev_trans_lt in_message { id src dst body body_hash created_at value bounce bounced  } out_messages { id src dst body body_hash created_at value bounce bounced  }  now status status_name end_status_name aborted lt total_fees orig_status_name'
        })).result;
//out_messages in_message

        let transactions = [];

        for (let tx of transactionsRaw) {
            transactions.push(this._formatTransaction(tx));
        }


        window.everrr = TON;
        return transactions;
    }

    async _getTransaction(id) {
        let TON = this.everClient;

        let transactionsRaw = (await TON.net.query_collection({
            collection: 'transactions',
            filter: {id: {eq: id}},
            order: [
                {path: "now", direction: "DESC"}],
            result: 'id prev_trans_hash prev_trans_lt in_message { id src dst body body_hash created_at value bounce bounced  } out_messages { id src dst body body_hash created_at value bounce bounced  }  now status status_name end_status_name aborted lt total_fees orig_status_name'
        })).result[0];

        return this._formatTransaction(transactionsRaw)
    }

    /**
     * Run get 2 runLocal
     * @param options
     * @returns {Promise<*>}
     * @private
     */
    async _runGet(options) {
        try {

            options = {
                ...options,
                abi: options.abi,
                functionName: options.method,
                input: options.input ? options.input : {},
                address: options.address
            }

            let runLocalResult = await this.ton.contracts.runLocal(options);
            //console.log('RUN LOCAL RESULT', runLocalResult);
            return runLocalResult.output;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async _runLocal(abi, address, functionName, input = {}) {
        let TON = this.everClient;

        input = await this._normalizeArguments(functionName, input, abi);

        const account = (await TON.net.query_collection({
            collection: 'accounts',
            filter: {id: {eq: address}},
            result: 'boc'
        })).result[0].boc;

        if(typeof abi === 'string') {
            abi = JSON.parse(abi);
        }

        const message = await TON.abi.encode_message({
            abi: {
                type: 'Contract',
                value: (abi)
            },
            address: address,
            call_set: {
                function_name: functionName,
                input: input
            },
            signer: {
                type: 'None'
            }
        });

        let response = await TON.tvm.run_tvm({
            message: message.message,
            account: account,
            abi: {
                type: 'Contract',
                value: (abi)
            },
        });

        const functionAttributes = abi.functions.find(({name}) => name === functionName);


        const outputDecoder = new OutputDecoder(
            response.decoded.output,
            functionAttributes,
            this.BigNumber
        );

        let decodedOutput = {output: outputDecoder.decode()}

        //console.log('COMPARE', response.decoded, decodedOutput);

        return decodedOutput;

        //return response.decoded;
    }


    async _normalizeArguments(method, args, abi) {
        if(typeof abi === 'string') {
            abi = JSON.parse(abi);
        }

        let methodParams = null;
        for (let methodParam of abi.functions) {
            if(methodParam.name === method) {
                methodParams = methodParam;
                break;
            }
        }

        // console.log('methodParams', methodParams);

        let inputsMap = {};
        for (let input of methodParams.inputs) {
            inputsMap[input.name] = input.type;
        }

        // console.log('inputsMap', inputsMap);

        for (let keyOfArgs of Object.keys(args)) {
            if(inputsMap[keyOfArgs] === 'bytes') {
                args[keyOfArgs] = Buffer.from(args[keyOfArgs], 'base64').toString('hex');
            }

            /*if(typeof args[keyOfArgs] === 'object'){
                args[keyOfArgs] = JSON.stringify(args[keyOfArgs]);
            }*/

            if(Array.isArray(args[keyOfArgs]) && args[keyOfArgs].length === 0) {
                args[keyOfArgs] = {};
            }
        }

        return args;
    }

    async _payload(abi, method, args = {}) {
        let TON = this.everClient;

        const callSet = {
            function_name: method,
            input: await this._normalizeArguments(method, args, abi)
        }

        if(typeof abi === 'string') {
            abi = JSON.parse(abi);
        }

        const encoded_msg = await TON.abi.encode_message_body({
            abi: {
                type: 'Contract',
                value: (abi)
            },
            call_set: callSet,
            is_internal: true,
            signer: {
                type: 'None'
            }
        });

        return encoded_msg.body;

    }

    /**
     * Deploy contract emulation
     * @param options
     * @returns {Promise<{processingState: *, message: *}>}
     * @private
     */
    async _deploy(options) {

        try {
            let deployMessageParams = {
                ...options,
                package: {
                    abi: options.abi,
                    imageBase64: options.imageBase64
                },
                constructorParams: options.constructorParams,
                initParams: options.options.initParams ? options.options.initParams : {},
                keyPair: {
                    public: (await this.ton.accounts.getAccount()).public
                }
            };


            //Create deploy message
            let deployMessage = await this.ton.contracts.createDeployMessage(deployMessageParams);

            //Transfer TON fro deploy
            if(options.options.initAmount) {
                await this.ton.accounts.walletTransfer((await this.ton.accounts.getAccount()).public, (await this.ton.accounts.getWalletInfo()).address, deployMessage.address, options.options.initAmount)
            }

            //Send deploy message
            let processingState = await this.ton.contracts.sendMessage(deployMessage.message);
            console.log('DEPLOY MESSAGE', deployMessage);
            return {message: deployMessage, processingState};
        } catch (e) {
            console.log(e);
            throw e;
        }

    }

    /**
     * Wait for message
     * @param params
     * @returns {Promise<*>}
     * @private
     */
    async _waitMessage(params) {
        return await this.ton.contracts.waitForRunTransaction(params.message, params.processingState);
    }

    /**
     * Transfer method mockup
     * @param params
     * @returns {Promise<{processingState: *, message: *}>}
     * @private
     */
    async _transfer(params) {
        let transferResult = await this.ton.accounts.walletTransfer((await this.ton.accounts.getAccount()).public, params.walletAddress ? params.walletAddress : (await this.ton.accounts.getWalletInfo()).address, params.address, params.amount, params.payload ? params.payload : '');

        console.log('TRANSFER RESULT', transferResult);

        return {message: transferResult.message, processingState: transferResult.tx};
    }
}

export default new EVERWalletEmulationProxy()