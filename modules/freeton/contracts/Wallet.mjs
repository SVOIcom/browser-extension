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
        this.abi = await Utils.fetchJSON('/abi/SafeMultisigWallet.abi.json');
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
            bounce: true,
            allBalance: false,
            payload: payload
        }, keyPair);
    }
}

export default Wallet;