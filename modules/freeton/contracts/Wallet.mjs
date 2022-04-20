/**
 * @name ScaleWallet - Everscale browser wallet and injector
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */

import Contract from "../wrappers/Contract.mjs";
import Utils from "../../utils.mjs";


class Wallet {
    constructor(address, ton) {
        this.address = address;
        this.ton = ton;
        this.contract = null;
        this.abi = null;
    }

    /**
     * Initialize wallet contract
     * @returns {Promise<Wallet>}
     */
    async init() {
        this.abi = await Utils.fetchJSON('/abi/SafeMultisigWallet.abi.json', true);
        this.contract = new Contract(this.abi, this.address, this.ton);

        return this;
    }

    /**
     * Get wallet balance
     * @returns {Promise<*>}
     */
    async getBalance() {
        return await this.contract.getBalance();
    }

    /**
     * Check is contract deployed
     * @returns {Promise<boolean>}
     */
    async contractDeployed() {
        let result = await this.ton.queries.accounts.query({
            filter: {id: {eq: this.address}},
            result: 'balance acc_type'
        });


        if(result.length === 0) {
            return false;
        }

        if(result[0].acc_type === 0) {
            return false;
        }

        return true;
    }

    /**
     * Transfer TON
     * @param to
     * @param amount
     * @param payload
     * @param keyPair
     * @returns {Promise<*>}
     */
    async transfer(to, amount, payload = '', keyPair) {
        return await this.contract.submitTransaction.deploy({
            dest: to,
            value: amount,
            bounce: false,
            allBalance: false,
            payload: payload
        }, keyPair);
    }

    async transferNew(to, amount, payload = '', bounce = false, keyPair) {
        return await this.contract.submitTransaction.deploy({
            dest: to,
            value: amount,
            bounce: bounce,
            allBalance: false,
            payload: payload
        }, keyPair);
    }

    /**
     * Return messages for current wallet by filter
     * @param filter
     * @param limit
     * @returns {Promise<*>}
     * @private
     */
    async getWalletMessages(filter = {}, limit = 20) {
        return this.ton.queries.messages.query({
            filter: filter,
            /*orderBy:[
                {path:"now",direction:"ASC"},
                {path:"lt",direction:"ASC"}
            ],*/
            orderBy: [
                {path: "created_at", direction: "DESC"}],
            limit: limit,
            result: 'id created_at dst src boc value'
        })
    }


    /**
     * Get wallet messages history
     * @returns {Promise<this>}
     */
    async getHistory(limit = 20) {
        try {
            window.getWalletMessages = this.getWalletMessages;
            let outcomes = await this.getWalletMessages({
                src: {
                    eq: this.address
                }
            }, limit);
            let incomes = await this.getWalletMessages({
                dst: {
                    eq: this.address
                }
            }, limit);
            let messages = [...outcomes, ...incomes];

            messages = messages.sort((a, b) => b.created_at - a.created_at);

            console.log('Messages', messages);

            for (let i in messages) {
                if(messages[i].value !== null) {
                    messages[i].value = Number(messages[i].value);
                }
            }

            return messages;
        } catch (e) {
            console.log(e);
        }

    }
}

export default Wallet;