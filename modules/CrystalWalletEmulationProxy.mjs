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

//const EMULATED_VERSION = {name: "extraton", version: "0.14.0"};
const MAINNET_NAME = 'main';

const EMULATED_VERSION = '0.2.26';
const EMULATED_VERSION_NUMERIC = 2026;

let that = null;

/**
 * CrystalWallet emulation proxy
 */
class CrystalWalletEmulationProxy extends EventEmitter3 {

    /**
     * Initialize proxy
     * @returns {Promise<ExtraTONEmulationProxy>}
     */
    async init() {
        if(that) {
            return that;
        }
        this.ton = await getTONWeb();
        that = this;
        return this;
    }

    /**
     * ExtraTON request endpoint
     * @param request Params
     * @returns {Promise<*>}
     */
     request(request) {
        let {method, params} = request;
        let address, publicKey;

        return new Promise(async (resolve, reject) => {
            setTimeout(async () => {

                try {
                    let result = await (async () => {
                        console.log('CrystalWallet Emulation call:', method, params);
                        switch (method) {
                            case 'getVersion':
                                return EMULATED_VERSION;
                            case 'getNetwork':
                                return await that._getNetwork();
                            case 'runGet':
                                return await that._runGet(params);
                            case 'deploy':
                                return await that._deploy(params);
                            case 'waitDeploy':
                            case 'waitRun':
                                return await that._waitMessage(params);
                            case'getPublicKey':
                                return (await that.ton.accounts.getAccount()).public;

                            case'getAddress':
                                return (await that.ton.accounts.getWalletInfo()).address;
                            case 'transfer':
                                return this._transfer(params);

                            case 'getProviderState':
                                address = (await that.ton.accounts.getWalletInfo()).address;
                                publicKey = (await that.ton.accounts.getAccount()).public;

                                console.log('getProviderState', address, publicKey);

                                return {
                                    "version": EMULATED_VERSION,
                                    "numericVersion": EMULATED_VERSION_NUMERIC,
                                    "selectedConnection": "mainnet",
                                    "supportedPermissions": [
                                        "basic",
                                        "accountInteraction"
                                    ],
                                    "permissions": {
                                        "accountInteraction": {
                                            "address": address,
                                            "contractType": "SafeMultisigWallet",
                                            "publicKey": publicKey
                                        },
                                        "basic": true
                                    },
                                    "subscriptions": {}
                                };

                            case 'requestPermissions':
                                address = (await that.ton.accounts.getWalletInfo()).address;
                                publicKey = (await that.ton.accounts.getAccount()).public;


                                console.log('requestPermissions', address, publicKey);
                                return {
                                    "accountInteraction": {
                                        "address": address,
                                        "contractType": "SafeMultisigWallet",
                                        "publicKey": publicKey
                                    },
                                    "basic": true
                                }
                            case 'getFullContractState':
                                return {
                                    "state": {
                                        "balance": "18097459956",
                                        "genTimings": {
                                            "genLt": "0",
                                            "genUtime": 0
                                        },
                                        "lastTransactionId": {
                                            "isExact": true,
                                            "lt": "24188629000001",
                                            "hash": "54e00fa3aaeac28c1d630f2d754d1df59f4c71eb40207feffe3c1d05c27d93b2"
                                        },
                                        "isDeployed": true,
                                        "boc": "te6ccgECRgEAEYkAAnCABn4z3ZFdCn0BB27piGYM0g0mWJO8Y10Mq3uUns0oO2dFGUH1BiH2keAAAK/+1Rz6EoIbWKl6JgMBAdWP1kRpGI3ddBzUs5vKkhcz+DEtgO5bqR9YHC8wqsQN2wAAAX9KsjDax+siNIxG7roOalnN5UkLmfwYlsB3LdSPrA4XmFViBu2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAsAIARaAR+siNIxG7roOalnN5UkLmfwYlsB3LdSPrA4XmFViBu2AQAib/APSkICLAAZL0oOGK7VNYMPShBgQBCvSkIPShBQAAAgEgCQcByP9/Ie1E0CDXScIBjifT/9M/0wDT/9P/0wfTB/QE9AX4bfhs+G/4bvhr+Gp/+GH4Zvhj+GKOKvQFcPhqcPhrbfhsbfhtcPhucPhvcAGAQPQO8r3XC//4YnD4Y3D4Zn/4YeLTAAEIALiOHYECANcYIPkBAdMAAZTT/wMBkwL4QuIg+GX5EPKoldMAAfJ64tM/AfhDIbkgnzAg+COBA+iogggbd0Cgud6TIPhjlIA08vDiMNMfAfgjvPK50x8B8AH4R26Q3gIBICwKAgEgHAsCASAUDAIBIA4NAAm3XKcyIAHNtsSL3L4QW6OKu1E0NP/0z/TANP/0//TB9MH9AT0Bfht+Gz4b/hu+Gv4an/4Yfhm+GP4Yt7RcG1vAvgjtT+BDhChgCCs+EyAQPSGjhoB0z/TH9MH0wfT/9MH+kDTf9MP1NcKAG8Lf4A8BaI4vcF9gjQhgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEcHDIyXBvC3DikSAQAv6OgOhfBMiCEHMSL3KCEIAAAACxzwsfIW8iAssf9ADIglhgAAAAAAAAAAAAAAAAzwtmIc8xgQOYuZZxz0AhzxeVcc9BIc3iIMlx+wBbMMD/jiz4QsjL//hDzws/+EbPCwD4SvhL+E74T/hM+E1eUMv/y//LB8sH9AD0AMntVN5/EhEABPhnAdJTI7yOQFNBbyvIK88LPyrPCx8pzwsHKM8LByfPC/8mzwsHJc8WJM8LfyPPCw8izxQhzwoAC18LAW8iIaQDWYAg9ENvAjXeIvhMgED0fI4aAdM/0x/TB9MH0//TB/pA03/TD9TXCgBvC38TAGyOL3BfYI0IYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABHBwyMlwbwtw4gI1MzECAnYYFQEHsFG70RYB+vhBbo4q7UTQ0//TP9MA0//T/9MH0wf0BPQF+G34bPhv+G74a/hqf/hh+Gb4Y/hi3tF1gCCBDhCCCA9CQPhPyIIQbSjd6IIQgAAAALHPCx8lzwsHJM8LByPPCz8izwt/Ic8LB8iCWGAAAAAAAAAAAAAAAADPC2YhzzGBA5i5FwCUlnHPQCHPF5Vxz0EhzeIgyXH7AFtfBcD/jiz4QsjL//hDzws/+EbPCwD4SvhL+E74T/hM+E1eUMv/y//LB8sH9AD0AMntVN5/+GcBB7A80nkZAfr4QW6OXu1E0CDXScIBjifT/9M/0wDT/9P/0wfTB/QE9AX4bfhs+G/4bvhr+Gp/+GH4Zvhj+GKOKvQFcPhqcPhrbfhsbfhtcPhucPhvcAGAQPQO8r3XC//4YnD4Y3D4Zn/4YeLe+EaS8jOTcfhm4tMf9ARZbwIB0wfR+EUgbhoB/JIwcN74Qrry4GQhbxDCACCXMCFvEIAgu97y4HX4AF8hcHAjbyIxgCD0DvKy1wv/+GoibxBwm1MBuSCVMCKAILnejjRTBG8iMYAg9A7ystcL/yD4TYEBAPQOIJEx3rOOFFMzpDUh+E1VAcjLB1mBAQD0Q/ht3jCk6DBTEruRIRsAcpEi4vhvIfhuXwb4QsjL//hDzws/+EbPCwD4SvhL+E74T/hM+E1eUMv/y//LB8sH9AD0AMntVH/4ZwIBICkdAgEgJR4CAWYiHwGZsAGws/CC3RxV2omhp/+mf6YBp/+n/6YPpg/oCegL8Nvw2fDf8N3w1/DU//DD8M3wx/DFvaLg2t4F8JsCAgHpDSoDrhYO/ybg4OHFIkEgAf6ON1RzEm8CbyLIIs8LByHPC/8xMQFvIiGkA1mAIPRDbwI0IvhNgQEA9HyVAdcLB3+TcHBw4gI1MzHoXwPIghBbANhZghCAAAAAsc8LHyFvIgLLH/QAyIJYYAAAAAAAAAAAAAAAAM8LZiHPMYEDmLmWcc9AIc8XlXHPQSHN4iDJIQBycfsAWzDA/44s+ELIy//4Q88LP/hGzwsA+Er4S/hO+E/4TPhNXlDL/8v/ywfLB/QA9ADJ7VTef/hnAQewyBnpIwH++EFujirtRNDT/9M/0wDT/9P/0wfTB/QE9AX4bfhs+G/4bvhr+Gp/+GH4Zvhj+GLe1NHIghB9cpzIghB/////sM8LHyHPFMiCWGAAAAAAAAAAAAAAAADPC2YhzzGBA5i5lnHPQCHPF5Vxz0EhzeIgyXH7AFsw+ELIy//4Q88LPyQASvhGzwsA+Er4S/hO+E/4TPhNXlDL/8v/ywfLB/QA9ADJ7VR/+GcBu7YnA0N+EFujirtRNDT/9M/0wDT/9P/0wfTB/QE9AX4bfhs+G/4bvhr+Gp/+GH4Zvhj+GLe0XBtbwJwcPhMgED0ho4aAdM/0x/TB9MH0//TB/pA03/TD9TXCgBvC3+AmAXCOL3BfYI0IYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABHBwyMlwbwtw4gI0MDGRICcB/I5sXyLIyz8BbyIhpANZgCD0Q28CMyH4TIBA9HyOGgHTP9Mf0wfTB9P/0wf6QNN/0w/U1woAbwt/ji9wX2CNCGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARwcMjJcG8LcOICNDAx6FvIghBQnA0NghCAAAAAsSgA3M8LHyFvIgLLH/QAyIJYYAAAAAAAAAAAAAAAAM8LZiHPMYEDmLmWcc9AIc8XlXHPQSHN4iDJcfsAWzDA/44s+ELIy//4Q88LP/hGzwsA+Er4S/hO+E/4TPhNXlDL/8v/ywfLB/QA9ADJ7VTef/hnAQm5ncyNkCoB/PhBbo4q7UTQ0//TP9MA0//T/9MH0wf0BPQF+G34bPhv+G74a/hqf/hh+Gb4Y/hi3vpBldTR0PpA39cNf5XU0dDTf9/XDACV1NHQ0gDf1w0HldTR0NMH39TR+E7AAfLgbPhFIG6SMHDe+Eq68uBk+ABUc0LIz4WAygBzz0DOASsArvoCgGrPQCHQyM4BIc8xIc81vJTPg88RlM+BzxPiySL7AF8FwP+OLPhCyMv/+EPPCz/4Rs8LAPhK+Ev4TvhP+Ez4TV5Qy//L/8sHywf0APQAye1U3n/4ZwIBSEEtAgEgNi4CASAxLwHHtfAocemP6YPouC+RL5i42o+RVlhhgCqgL4KqiC3kQQgP8ChxwQhAAAAAWOeFj5DnhQBkQSwwAAAAAAAAAAAAAAAAZ4WzEOeYwIHMXMs456AQ54vKuOegkObxEGS4/YAtmGB/wDAAZI4s+ELIy//4Q88LP/hGzwsA+Er4S/hO+E/4TPhNXlDL/8v/ywfLB/QA9ADJ7VTef/hnAa21U6B2/CC3RxV2omhp/+mf6YBp/+n/6YPpg/oCegL8Nvw2fDf8N3w1/DU//DD8M3wx/DFvaZ/o/CKQN0kYOG8QfCbAgIB6BxBKAOuFg8i4cRD5cDIYmMAyAqCOgNgh+EyAQPQOII4ZAdM/0x/TB9MH0//TB/pA03/TD9TXCgBvC5Ft4iHy4GYgbxEjXzFxtR8irLDDAFUwXwSz8uBn+ABUcwIhbxOkIm8Svj4zAaqOUyFvFyJvFiNvGsjPhYDKAHPPQM4B+gKAas9AIm8Z0MjOASHPMSHPNbyUz4PPEZTPgc8T4skibxj7APhLIm8VIXF4I6isoTEx+Gsi+EyAQPRbMPhsNAH+jlUhbxEhcbUfIawisTIwIgFvUTJTEW8TpG9TMiL4TCNvK8grzws/Ks8LHynPCwcozwsHJ88L/ybPCwclzxYkzwt/I88LDyLPFCHPCgALXwtZgED0Q/hs4l8H+ELIy//4Q88LP/hGzwsA+Er4S/hO+E/4TPhNXlDL/8v/ywfLBzUAFPQA9ADJ7VR/+GcBvbbHYLN+EFujirtRNDT/9M/0wDT/9P/0wfTB/QE9AX4bfhs+G/4bvhr+Gp/+GH4Zvhj+GLe+kGV1NHQ+kDf1w1/ldTR0NN/39cMAJXU0dDSAN/XDACV1NHQ0gDf1NFwgNwHsjoDYyIIQEx2CzYIQgAAAALHPCx8hzws/yIJYYAAAAAAAAAAAAAAAAM8LZiHPMYEDmLmWcc9AIc8XlXHPQSHN4iDJcfsAWzD4QsjL//hDzws/+EbPCwD4SvhL+E74T/hM+E1eUMv/y//LB8sH9AD0AMntVH/4ZzgBqvhFIG6SMHDeXyD4TYEBAPQOIJQB1wsHkXDiIfLgZDExJoIID0JAvvLgayPQbQFwcY4RItdKlFjVWqSVAtdJoAHiIm7mWDAhgSAAuSCUMCDBCN7y4Hk5AtyOgNj4S1MweCKorYEA/7C1BzExdbny4HH4AFOGcnGxIZ0wcoEAgLH4J28QtX8z3lMCVSFfA/hPIMABjjJUccrIz4WAygBzz0DOAfoCgGrPQCnQyM4BIc8xIc81vJTPg88RlM+BzxPiySP7AF8NcD46AQqOgOME2TsBdPhLU2BxeCOorKAxMfhr+CO1P4AgrPglghD/////sLEgcCNwXytWE1OaVhJWFW8LXyFTkG8TpCJvEr48AaqOUyFvFyJvFiNvGsjPhYDKAHPPQM4B+gKAas9AIm8Z0MjOASHPMSHPNbyUz4PPEZTPgc8T4skibxj7APhLIm8VIXF4I6isoTEx+Gsi+EyAQPRbMPhsPQC8jlUhbxEhcbUfIawisTIwIgFvUTJTEW8TpG9TMiL4TCNvK8grzws/Ks8LHynPCwcozwsHJ88L/ybPCwclzxYkzwt/I88LDyLPFCHPCgALXwtZgED0Q/hs4l8DIQ9fDwH0+CO1P4EOEKGAIKz4TIBA9IaOGgHTP9Mf0wfTB9P/0wf6QNN/0w/U1woAbwt/ji9wX2CNCGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARwcMjJcG8LcOJfIJQwUyO73iCzkl8F4PgAcJlTEZUwIIAoud4/Af6OfaT4SyRvFSFxeCOorKExMfhrJPhMgED0WzD4bCT4TIBA9HyOGgHTP9Mf0wfTB9P/0wf6QNN/0w/U1woAbwt/ji9wX2CNCGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARwcMjJcG8LcOICNzUzUyKUMFNFu94yQABi6PhCyMv/+EPPCz/4Rs8LAPhK+Ev4TvhP+Ez4TV5Qy//L/8sHywf0APQAye1U+A9fBgIBIEVCAdu2tmgjvhBbo4q7UTQ0//TP9MA0//T/9MH0wf0BPQF+G34bPhv+G74a/hqf/hh+Gb4Y/hi3tM/0XBfUI0IYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABHBwyMlwbwsh+EyAQPQOIIEMB/o4ZAdM/0x/TB9MH0//TB/pA03/TD9TXCgBvC5Ft4iHy4GYgM1UCXwPIghAK2aCOghCAAAAAsc8LHyFvK1UKK88LPyrPCx8pzwsHKM8LByfPC/8mzwsHJc8WJM8LfyPPCw8izxQhzwoAC18LyIJYYAAAAAAAAAAAAAAAAM8LZiFEAJ7PMYEDmLmWcc9AIc8XlXHPQSHN4iDJcfsAWzDA/44s+ELIy//4Q88LP/hGzwsA+Er4S/hO+E/4TPhNXlDL/8v/ywfLB/QA9ADJ7VTef/hnAGrbcCHHAJ0i0HPXIdcLAMABkJDi4CHXDR+Q4VMRwACQ4MEDIoIQ/////byxkOAB8AH4R26Q3g=="
                                    }
                                }

                            case 'subscribe':
                                return {
                                    "state": true,
                                    "transactions": false
                                };

                        }

                        throw new Error('Unsupported method');
                    })()
                    console.log('LL', result)
                    return resolve(result);
                } catch (e) {
                    reject(e);
                }
            }, 1000);
        })

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

    /**
     * Transfer method mockup
     * @param params
     * @returns {Promise<{processingState: *, message: *}>}
     * @private
     */
    async _transfer(params) {
        let transferResult = await this.ton.accounts.walletTransfer((await this.ton.accounts.getAccount()).public, params.walletAddress ? params.walletAddress : (await this.ton.accounts.getWalletInfo()).address, params.address, params.amount, params.payload ? params.payload : '');

        console.log('TRANSFER RESULT', transferResult);

        return {message: transferResult.message, processingState: transferResult.tx};
    }
}

export default new CrystalWalletEmulationProxy()