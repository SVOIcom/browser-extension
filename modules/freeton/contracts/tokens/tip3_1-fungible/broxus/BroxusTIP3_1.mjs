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

import Utils from "../../../../../utils.mjs";
import FreetonInstance from "../../../../FreetonInstance.mjs";
import Wallet from "../../../Wallet.mjs";

class BroxusTIP3_1 {

    static CLASS_NAME = 'BroxusTIP3_1';
    static ROOT_CODE_HASH = '2ff4aaaab0f31d5a7b276b78a490277aa043d445bb71ac7c3dac8ae9e39b4d23';
    static WALLET_CODE_HASH = '2f062cde9cc0e2999f6bded5b4f160578b81530aaa3ae7d7077df60cd40f6056';
    static TOKEN_TYPE = 'TIP3_1';
    static TOKEN_FUNGUBLE = true;
    static IS_DEPRECATED = false;

    constructor(ton, rootAddress) {
        this.ton = ton;
        this.rootAddress = rootAddress;
    }

    //TODO Refactor to external module
    async runLocal(abi, address, functionName, input = {}) {
        let TON = this.ton.lowLevel;

        const account = (await TON.net.query_collection({
            collection: 'accounts',
            filter: { id: { eq: address } },
            result: 'boc'
        })).result[0].boc;

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

        return response.decoded.output;
    }

    async init() {
        this.RootABI = await Utils.fetchJSON('/modules/freeton/contracts/tokens/tip3_1-fungible/broxus/TokenRoot.abi.json', true);//1d0bafcaa5a39a39f7567bcd5ddaa556eaa12a4eecc87ea142bd0a991e9cf749
        this.WalletABI = await Utils.fetchJSON('/modules/freeton/contracts/tokens/tip3_1-fungible/broxus/TokenWallet.abi.json', true);
        return this;
    }

    /**
     * Get token info
     * @returns {Promise<{symbol, totalSupply: number, decimals: number, name, icon: null}>}
     */
    async getTokenInfo() {

        console.log('Get token info');
       // try {
            console.log(await this.runLocal(this.RootABI, this.rootAddress, 'name', {answerId: 0}))
       // } catch (e) {
       //     console.log(e);
        //}

        try {
            let name = (await this.runLocal(this.RootABI, this.rootAddress, 'name', {answerId: 0})).value0;
            let symbol = (await this.runLocal(this.RootABI, this.rootAddress, 'symbol', {answerId: 0})).value0;
            let decimals = (await this.runLocal(this.RootABI, this.rootAddress, 'decimals', {answerId: 0})).value0;
            let totalSupply = (await this.runLocal(this.RootABI, this.rootAddress, 'totalSupply', {answerId: 0})).value0;


            return {
                decimals: Number(decimals),
                name: (name),
                symbol: (symbol),
                totalSupply: Number(totalSupply),
                icon: null
            };
        }catch (e) {
            console.log(e);
            throw e;
        }
    }

    /**
     * Get wallet token balance
     * @param {string} walletAddress
     * @returns {Promise<number>}
     */
    async getBalance(walletAddress) {

        let balance = (await this.runLocal(this.WalletABI, walletAddress, 'balance', {answerId: 0})).value0;
        return balance;
    }

    /**
     * Get wallet address from publicKey
     * @param {string} publicKey
     * @returns {Promise<string>}
     */
    async getWalletAddressByPubkey(publicKey) {
        throw new Error('Not implemented');
    }

    /**
     * Returns token wallet by multisig address
     * @param walletOwner
     * @returns {Promise<*>}
     */
    async getWalletAddressByMultisig(walletOwner) {

        let tokenWaletAddress = (await this.runLocal(this.RootABI, this.rootAddress, 'walletOf', {
            answerId: 0,
            walletOwner
        })).value0;
        return tokenWaletAddress;
    }


    /**
     * Transfer tokens
     * @param dest
     * @param amount
     * @param keyPair
     * @returns {Promise<*>}
     */
    async transfer(dest, amount, keyPair) {

        //console.log('TIP# pretransfer', dest, amount, keyPair)

        let walletAddress = await this.getWalletAddressByPubkey(keyPair.public);

        //console.log('TIP# pretransfer2', walletAddress)

        try {
            let params = {
                address: walletAddress,
                abi: this.WalletABI,
                functionName: 'transfer',
                input: {
                    to: dest,
                    tokens: amount,
                    grams: 2e8,
                    send_gas_to: '0:0000000000000000000000000000000000000000000000000000000000000000',
                    notify_receiver: true,
                    payload: ''
                },
                keyPair
            };

            //console.log('BROXUS TIP3 RUN PARAMS', params)

            let message = await this.ton.contracts.createRunMessage(params);

            //console.log('BROXUS TIP3 RUN MSG', message)

            let transaction = await this.ton.contracts.sendMessage(message.message);
            //console.log('BROXUS TIP3 TX', transaction)

            let result = await this.ton.contracts.waitForRunTransaction(message, transaction);

            //console.log('BROXUS TIP3 TX RESULT',result);

            result.tx = transaction;

            return result;
        } catch (e) {
            console.log('DEPLOY ERROR', e);
            throw e;
        }
    }

    /**
     * Transfer tokens by multisig
     * @param dest
     * @param amount
     * @param keyPair
     * @param multisigAddress
     * @returns {Promise<*>}
     */
    async multisigTransfer(dest, amount, keyPair, multisigAddress) {

        const ton = await FreetonInstance.getFreeTON();

        console.log('TIP# pretransfer', dest, amount, keyPair)

        let walletAddress = await this.getWalletAddressByMultisig(multisigAddress);

        console.log('TIP# pretransfer2', walletAddress)

        try {

            const payload = (await ton.contracts.createRunBody({
                abi: this.WalletABI,
                function: 'transfer',
                params: {
                    to: dest,
                    tokens: amount,
                    grams: 2e8,
                    send_gas_to: multisigAddress,//'0:0000000000000000000000000000000000000000000000000000000000000000',
                    notify_receiver: true,
                    payload: ''
                },
                internal: true
            })).bodyBase64;

            console.log('BROXUS TIP3 PAYLOAD', payload)

            let wallet = await (new Wallet(multisigAddress, this.ton)).init();

            let transferResult = await wallet.transfer(walletAddress, 2e8, payload, keyPair);

            console.log('BROXUS TIP3 TRANSFER RESULT', transferResult)

            return transferResult;

        } catch (e) {
            console.log('DEPLOY ERROR', e);
            throw e;
        }
    }

    /**
     * Deploy token wallet
     * @param tokens
     * @param {Wallet} userWallet
     * @param keyPair
     * @param ownerAddress
     * @returns {Promise<*>}
     */
    async deployWallet(tokens = 0, userWallet = null, keyPair, ownerAddress = null) {
        let publicKey = keyPair.public;
        console.log('DEPLOY TOKEN WALLET', userWallet, keyPair, ownerAddress);

        try {


            if(tokens === 0) {

                let params = {
                    address: this.rootAddress,
                    abi: this.RootABI,
                    functionName: 'deployEmptyWallet',
                    input: {
                        wallet_public_key_: `0x0000000000000000000000000000000000000000000000000000000000000000`,
                        //wallet_public_key_: `0x${publicKey}`,
                        deploy_grams: 2e8,
                        gas_back_address: userWallet.address,//'0:0000000000000000000000000000000000000000000000000000000000000000',
                        owner_address_: ownerAddress ? ownerAddress : userWallet.address//'0:0000000000000000000000000000000000000000000000000000000000000000',
                    },
                    // keyPair
                };

                console.log('Deploy TIP3 empty wallet params', params)
                // let message = await this.ton.contracts.createRunMessage(params);

                let tton = new tonclientWeb.TonClient()

                let message = await tton.abi.encode_message_body({
                    abi: {
                        type: 'Json',
                        value: JSON.stringify(this.RootABI)
                    },
                    call_set: {
                        function_name: 'deployEmptyWallet',
                        input: {
                            wallet_public_key_: `0x0000000000000000000000000000000000000000000000000000000000000000`,
                            //wallet_public_key_: `0x${publicKey}`,
                            deploy_grams: 2e8,
                            gas_back_address: userWallet.address,//'0:0000000000000000000000000000000000000000000000000000000000000000',
                            owner_address_: ownerAddress ? ownerAddress : userWallet.address//'0:0000000000000000000000000000000000000000000000000000000000000000',
                        },
                    },
                    is_internal: true,
                    signer: {type: 'None'}
                });

                console.log('DEPLOY MESSAGE ', message);

                // throw 'ttt';

                let transferResult = await userWallet.transfer(this.rootAddress, 3e8, message.body, keyPair);

                console.log('DEPLOY TRANSFER RSULT ', transferResult);

                tton.close();

                return transferResult;
            } else {
                let params = {
                    address: this.rootAddress,
                    abi: this.RootABI,
                    functionName: 'deployWallet',
                    input: {
                        tokens: tokens,
                        wallet_public_key_: `0x0000000000000000000000000000000000000000000000000000000000000000`,
                        //wallet_public_key_: `0x${publicKey}`,
                        deploy_grams: 2e8,
                        gas_back_address: userWallet.address,//'0:0000000000000000000000000000000000000000000000000000000000000000',
                        owner_address_: ownerAddress ? ownerAddress : userWallet.address//'0:0000000000000000000000000000000000000000000000000000000000000000',
                    },
                    keyPair
                };
                console.log('BROXUS TIP3 RUN PARAMS', params)

                let message = await this.ton.contracts.createRunMessage(params);

                //console.log('BROXUS TIP3 RUN MSG', message)

                let transaction = await this.ton.contracts.sendMessage(message.message);
                //console.log('BROXUS TIP3 TX', transaction)

                let result = await this.ton.contracts.waitForRunTransaction(message, transaction);

                //console.log('BROXUS TIP3 TX RESULT',result);

                result.tx = transaction;

                return result;
            }
        } catch (e) {
            console.log('DEPLOY ERROR', e);
            throw e;
        }
    }
}

export default BroxusTIP3_1;