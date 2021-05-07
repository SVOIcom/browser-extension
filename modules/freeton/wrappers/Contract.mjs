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

/**
 * Contract class
 */
class Contract {
    constructor(abi, address, ton) {
        this.abi = abi;
        this.address = address;
        this.ton = ton;


        let that = this;

        //Setup methods
        for (let {name} of abi.functions) {
            if(name === 'constructor') {
                continue;
            }
            this[name] = async function (args = undefined) {
                return await that.getMethod(name, args);
            }

            //Make method deployable
            this[name].deploy = async function (args = undefined, keyPair = undefined) {
                return await that.deployMethod(name, args, keyPair);
            }
        }
    }

    /**
     * Get current provider
     * @returns {*}
     */
    getProvider() {
        return this.ton;
    }

    /**
     * Get TON client
     * @returns {TONClient}
     */
    getTONClient() {
        return this.ton;
    }

    /**
     * Get raw contract object
     * @returns {*}
     */
    getProviderContract() {
        return this.contract;
    }

    /**
     * Return account info for contract
     * @returns {Promise<*>}
     */
    async getAccount() {
        return await this.ton.contracts.getAccount(this.address);
    }

    /**
     * Return balance for contract
     * @returns {Promise<number>}
     */
    async getBalance() {
        let account = await this.getAccount();
        return Number(account.balance);
    }

    /**
     * Run method locally
     * @param {string} method
     * @param {array|object} args
     * @returns {Promise<*>}
     */
    async getMethod(method, args = {}) {
        return (await this.ton.contracts.runLocal({
            abi: this.abi,
            functionName: method,
            input: args,
            address: this.address
        })).output;
    }

    /**
     * Deploy method
     * @param {string} method
     * @param {undefined|array|object} args
     * @param {object} keyPair
     * @returns {Promise<*>}
     */
    async deployMethod(method, args = {}, keyPair = undefined) {
        try {
            let params = {
                address: this.address,
                abi: this.abi,
                functionName: method,
                input: args,
                keyPair
            };

            let message = await this.ton.contracts.createRunMessage(params);
            let transaction = await this.ton.contracts.sendMessage(message.message);

            console.log(transaction);

            let result = await this.ton.contracts.waitForRunTransaction(message, transaction);

            console.log(result);

            result.tx = transaction;
            result.message = message;

            return result;
        } catch (e) {
            console.log('DEPLOY ERROR', e);
            throw e;
        }


    }

}

export default Contract;