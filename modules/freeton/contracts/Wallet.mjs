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
     * Transfer TON
     * @param to
     * @param amount
     * @param keyPair
     * @returns {Promise<*>}
     */
    async transfer(to, amount, keyPair){
            return await this.sendTransaction.deploy({to, amount}, keyPair);
    }
}

export default Wallet;