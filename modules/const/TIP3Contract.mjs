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


import Utils from "../utils.mjs";

class TIP3Contract {

    static ROOT_TYPES = {
        BroxusTIP3: 'BroxusTIP3',
    }

    static WALLET_TYPES = {
        BroxusTIP3: 'BroxusTIP3',
    }

    static TYPES_LIST = [
        'BroxusTIP3',
    ];


    static async BroxusTIP3Root() {
        return {
            abi: await Utils.fetchJSON('/abi/BroxusTIP3Root.abi.json', true),
            imageBase64: await Utils.fetchJSON('/abi/contracts/BroxusTIP3Root.base64.json', true)
        }
    }

    static async BroxusTIP3Wallet() {
        return {
            abi: await Utils.fetchJSON('/abi/BroxusTIP3Wallet.abi.json', true),
            imageBase64: await Utils.fetchJSON('/abi/contracts/BroxusTIP3Wallet.base64.json', true),
            compiled: await Utils.fetchJSON('/abi/contracts/BroxusTIP3WalletCompiled.base64.json', true),
        }
    }

    /**
     * Get TIP3 root
     * @param type
     * @returns {Promise<{imageBase64: *, abi: *, compiled:*}>}
     */
    static async getTIP3RootData(type = TIP3Contract.ROOT_TYPES.BroxusTIP3) {
        switch (type) {
            case 'BroxusTIP3':
            default:
                return TIP3Contract.BroxusTIP3Root();
        }
    }

    static async getTIP3WalletData(type = TIP3Contract.WALLET_TYPES.BroxusTIP3) {
        switch (type) {
            case 'BroxusTIP3':
            default:
                return TIP3Contract.BroxusTIP3Wallet();
        }
    }
}

export default TIP3Contract;