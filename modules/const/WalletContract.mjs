import Utils from "../utils.mjs";

class WalletContract {

    static WALLET_TYPES = {
        SafeMultisig: 'SafeMultisig',
        SurfMultisig: 'SurfMultisig'
    }

    static WALLET_TYPES_LIST = [
        'SafeMultisig',
        'SURF'
    ];

    /**
     * Returns SafeMultisig wallet
     * @returns {Promise<{imageBase64: *, abi: *}>}
     * @constructor
     */
    static async SafeMultisig() {
        return {
            abi: await Utils.fetchJSON('/abi/SafeMultisigWallet.abi.json'),
            imageBase64: await Utils.fetchJSON('/abi/contracts/SafeMultisigWallet.base64.json')
        }
    }

    static async SurfMultisig() {
        return {
            abi: await Utils.fetchJSON('/abi/SurfMultisigWallet.abi.json'),
            imageBase64: await Utils.fetchJSON('/abi/contracts/SurfMultisigWallet.base64.json')
        }
    }

    /**
     * Get wallet
     * @param type
     * @returns {Promise<{imageBase64: *, abi: *}>}
     */
    static async getWalletData(type = WalletContract.WALLET_TYPES.SafeMultisig) {
        switch (type) {
            case 'SafeMultisig':
            case 'SafeMultisigWallet':
            case 'SafeMultisigVerified':
            default:
                return WalletContract.SafeMultisig();

            case 'SurfMultisig':
            case 'Surf':
            case 'SURF':
            case 'surf':
                return WalletContract.SurfMultisig();
        }
    }
}

export default WalletContract;