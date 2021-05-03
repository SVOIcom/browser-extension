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



import FreetonInstance from "./FreetonInstance.mjs";
import WalletContract from "../const/WalletContract.mjs";

class FreetonDeploy {

    constructor(server) {
        this.server = server;
    }


    /**
     * Predicts contract address
     * @param contractData
     * @param constructorParams
     * @param initParams
     * @param publicKey
     * @returns {Promise<*>}
     */
    async getPreDeployContractAddress(contractData, constructorParams, initParams, publicKey) {
        const ton = await FreetonInstance.getFreeTON(this.server);

        const deployMessage = (await ton.contracts.getDeployData({
            abi: contractData.abi,
            imageBase64: contractData.imageBase64,
            initParams,
            publicKeyHex: publicKey,
            workchainId: 0,
        }))

        return deployMessage.address;
    }

    /**
     * Deploy contract to network
     * @param contractData
     * @param constructorParams
     * @param initParams
     * @param keyPair
     * @returns {Promise<*>}
     */
    async deployContract(contractData, constructorParams, initParams, keyPair) {
        const ton = await FreetonInstance.getFreeTON(this.server);

        const deployObject = {
            package: contractData,
            constructorParams,
            initParams,
            keyPair,
        };

        try {

            // console.log(data);
            const deployMessage = await ton.contracts.createDeployMessage(deployObject);

            console.log('DEPLOY CONTRACT', deployMessage);

            let transaction = await ton.contracts.sendMessage(deployMessage.message);

            console.log('DEPLOY CONTRACT', transaction);

            let result = await ton.contracts.waitForRunTransaction(deployMessage, transaction);

            console.log('DEPLOY CONTRACT', result);

            result.tx = transaction;

            return result;
        } catch (e) {
            console.log('DEPLOY CONTRACT', e);
            throw e;
        }
    }

    /**
     * Deploy new wallet
     * @param keyPair
     * @param type
     * @returns {Promise<*>}
     */
    async deployWallet(keyPair, type = WalletContract.WALLET_TYPES.SafeMultisig) {
        let publicKey = keyPair.public;
        let walletContractData = await WalletContract.getWalletData(type);
        const constructorParams = {
            owners: [
                `0x${publicKey}`
            ],
            reqConfirms: 1
        };

        return await this.deployContract(walletContractData, constructorParams, {}, keyPair);
    }

    /**
     * Create wallet address
     * @param publicKey
     * @param type
     * @returns {Promise<*>}
     */
    async createWallet(publicKey, type = WalletContract.WALLET_TYPES.SafeMultisig) {

        let walletContractData = await WalletContract.getWalletData(type);
        const constructorParams = {
            owners: [
                `0x${publicKey}`
            ],
            reqConfirms: 1
        };

        return await this.getPreDeployContractAddress(walletContractData, constructorParams, {}, publicKey);
    }
}

export default FreetonDeploy;