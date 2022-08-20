/**
 * @name ScaleWallet - Everscale browser wallet and injector
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */


import FreetonInstance from "./FreetonInstance.mjs";
import WalletContract from "../const/WalletContract.mjs";
import TIP3Contract from "../const/TIP3Contract.mjs";
import Utils from "../utils.mjs";

class FreetonDeploy {

    constructor(server) {
        this.server = server;
    }


    async getDeployData(ton, params) {
        let encodeParams = {
            abi: {
                type: "Contract",
                value: params.abi,
            },
            deploy_set: {
                tvc: params.imageBase64,
                initial_data: params.initParams ? params.initParams : {},
            },
            call_set: {
                function_name: 'constructor',
                input: params.constructorParams ? params.constructorParams : {},
            },
            signer: {
                type: 'None',
            }
        };

        if(params.keyPair) {
            encodeParams = {
                ...encodeParams,
                signer: {
                    type: 'Keys',
                    keys: params.keyPair,
                }
            }
        }
        debugger;

        return ton.abi.encode_message(encodeParams);
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

        debugger;
        const deployMessage = await this.getDeployData(ton, {
            abi: contractData.abi,
            imageBase64: contractData.imageBase64,
            initParams,
            constructorParams: {owners: []},
            publicKeyHex: publicKey,
            workchainId: 0,
        });

        debugger;

        /* const deployMessage = (await ton.contracts.getDeployData({
             abi: contractData.abi,
             imageBase64: contractData.imageBase64,
             initParams,
             publicKeyHex: publicKey,
             workchainId: 0,
         }))*/


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

    async predictTIP3RootAddress(type = TIP3Contract.ROOT_TYPES.BroxusTIP3, options, publicKey) {
        let rootContractData = await TIP3Contract.getTIP3RootData(type);
        let rootWalletData = await TIP3Contract.getTIP3WalletData(type);

        const constructorParams = {
            root_public_key_: `0x${publicKey}`,
            root_owner_address_: '0:0000000000000000000000000000000000000000000000000000000000000000',
        };

        const initParams = {
            name: Utils.string2Hex(options.tokenName),
            symbol: Utils.string2Hex(options.tokenTicker),
            decimals: 9,
            wallet_code: rootWalletData.compiled,
            _randomNonce: options.randomNonce
        }

        return await this.getPreDeployContractAddress(rootContractData, constructorParams, initParams, publicKey);

    }

    async deployTIP3Root(type = TIP3Contract.ROOT_TYPES.BroxusTIP3, options, keyPair) {
        let rootContractData = await TIP3Contract.getTIP3RootData(type);
        let rootWalletData = await TIP3Contract.getTIP3WalletData(type);

        let publicKey = keyPair.public;

        const constructorParams = {
            root_public_key_: `0x${publicKey}`,
            root_owner_address_: '0:0000000000000000000000000000000000000000000000000000000000000000',
        };


        const initParams = {
            name: Utils.string2Hex(options.tokenName),
            symbol: Utils.string2Hex(options.tokenTicker),
            decimals: 9,
            wallet_code: rootWalletData.compiled,
            _randomNonce: options.randomNonce
        }

        return await this.deployContract(rootContractData, constructorParams, initParams, keyPair);

    }
}

export default FreetonDeploy;