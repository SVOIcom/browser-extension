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

const EMULATED_VERSION = {name: "extraton", version: "0.14.0"};
const MAINNET_NAME = 'main';

/**
 * extraTON emulation proxy
 */
class ExtraTONEmulationProxy {

    /**
     * Initialize proxy
     * @returns {Promise<ExtraTONEmulationProxy>}
     */
    async init() {
        this.ton = await getTON();
        return this;
    }

    /**
     * ExtraTON request endpoint
     * @param method
     * @param params
     * @returns {Promise<*>}
     */
    async request(method, params) {
        console.log('extraTON Emulation call:', method, params);
        switch (method) {
            case 'getVersion':
                return EMULATED_VERSION;
            case 'getNetwork':
                return await this._getNetwork();
            case 'runGet':
                return await this._runGet(params);
            case 'deploy':
                return await this._deploy(params);
            case 'waitDeploy':
            case 'waitRun':
                return await this._waitMessage(params);


        }

        throw new Error('Unsupported method');
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
            console.log('RUN LOCAL RESULT', runLocalResult);
            return runLocalResult.output;
        } catch (e) {
            console.error(e);
            throw e;
        }
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
}

export default new ExtraTONEmulationProxy()