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
import EXCEPTIONS from "../const/Exceptions.mjs";
import uiUtils from "./uiUtils.mjs";
import LOCALIZATION from "../Localization.mjs";
import DeNsResolver from "../partners/agual/DeNs/DeNsResolver.mjs";

const $ = Dom7;
const _ = LOCALIZATION._;

class Popups {

    /**
     * Open accept transaction popup
     * @param publicKey
     * @param type
     * @param callingDetails
     * @returns {Promise<unknown>}
     */
    acceptTransaction(publicKey, type = 'run', callingDetails) {
        return new Promise((resolve, reject) => {
            window.app.views.main.router.navigate("/accept");

            app.once('pageInit', () => {
                console.log('PAGE');

                $('#acceptPublicKey').text(Utils.shortenPubkey(publicKey));
                $('#acceptPublicKey').attr('title', publicKey);
                $('#acceptTxType').text(type);

                if(callingDetails.functionName) {
                    $('#acceptFunctionName').text(callingDetails.functionName);
                } else {
                    $('#acceptFunctionNameHolder').hide();
                }

                if(callingDetails.additionalMessage && callingDetails.additionalMessage !== '') {
                    $('#acceptMessageFromCaller').html(callingDetails.additionalMessage);
                } else {
                    $('#acceptMessageFromCallerHolder').hide();
                }

                if(callingDetails.address) {
                    $('#acceptRunAddress').text(Utils.shortenPubkey(callingDetails.address));
                    $('#acceptRunAddress').attr('title', callingDetails.address);
                } else {
                    $('#acceptRunAddress').text(_('Error'));
                }


                $('#txCancelButton').once('click', () => {
                    Utils.appBack();
                    reject(EXCEPTIONS.rejectedByUser);
                });

                $('#txAcceptButton').once('click', () => {
                    Utils.appBack();
                    /*setTimeout(() => {
                        app.toast.create({
                            closeTimeout: 3000,
                            destroyOnClose: true,
                            text: 'Transaction created'
                        }).open();
                    }, 500);*/

                    resolve(true);
                });

                LOCALIZATION.updateLocalization();

                // resolve();
            });

        })


    }

    /**
     * Create transaction popup
     * @returns {Promise<unknown>}
     */
    createTransaction() {
        return new Promise((resolve, reject) => {
            window.app.views.main.router.navigate("/createTransaction");

            app.once('pageInit', () => {

                $('#transferAmount').on('keyup', () => {
                    let amount = $('#transferAmount').val();
                    let checker = Utils.numberToUnsignedNumber(amount);
                    if(!checker) {
                        $('#transferAmount').parent().parent().parent().addClass('item-input-invalid');
                    } else {
                        $('#transferAmount').parent().parent().parent().removeClass('item-input-invalid');
                    }
                });

                $('#transferAddress').on('keyup', async () => {
                    let address = $('#transferAddress').val();

                    let currentNetwork = await messenger.rpcCall('main_getNetwork', undefined, 'background');

                    const resolver = new DeNsResolver(!(currentNetwork.name === 'main'));

                    if(!Utils.validateTONAddress(address)) {
                        try {
                            address = await resolver.resolveAddress(address.toLowerCase());
                            $('#resolvedAddressHolder').show();
                        } catch (e) {
                            console.log(e);
                            $('#resolvedAddressHolder').hide();
                        }
                    }

                    $('#resolvedAddress').val(address);

                    $('#transferAddress').parent().find('.input-clear-button').click(() => {
                        $('#resolvedAddressHolder').hide();
                    })

                    if(!Utils.validateTONAddress(address)) {
                        $('#transferAddress').parent().parent().parent().addClass('item-input-invalid');
                    } else {
                        $('#transferAddress').parent().parent().parent().removeClass('item-input-invalid');
                    }
                });

                $('#txTransfer').once('click', async () => {
                    let amount = $('#transferAmount').val();
                    let address = $('#resolvedAddress').val();
                    let payload = $('#transferComment').val();
                    let checker = Utils.numberToUnsignedNumber(amount);

                    if(!Utils.validateTONAddress(address)) {
                        return app.dialog.alert(_('Invalid address'));
                    }

                    if(!checker) {
                        return app.dialog.alert(_('Invalid amount'));
                    }

                    let account = await this.messenger.rpcCall('main_getAccount', undefined, 'background');
                    let currentNetwork = await this.messenger.rpcCall('main_getNetwork', undefined, 'background');

                    let encodedPayload = ''
                    if(payload.length !== 0) {
                        encodedPayload = await this.messenger.rpcCall('main_encodePayloadComment', [payload], 'background');
                    }


                    console.log(account.wallets[currentNetwork.name]);

                    Utils.appBack();

                    try {
                        resolve(await this.messenger.rpcCall('main_transfer', [
                            account.wallets[currentNetwork.name].address,
                            account.public,
                            address,
                            checker,
                            encodedPayload,
                            false
                        ], 'background'));
                    } catch (e) {
                        reject(e);
                        console.error(e);
                        app.dialog.alert(`${_('Transaction error')}: ${_(e.message)}`);
                        // app.dialog.alert(`Transaction error: <br> ${JSON.stringify(e)}`);
                    }


                });

                $('#txCancelButton').once('click', () => {
                    Utils.appBack();
                    reject(EXCEPTIONS.rejectedByUser);
                });

                LOCALIZATION.updateLocalization();
            })
        })
    }

    /**
     * Initial page
     * @returns {Promise<unknown>}
     */
    initPage() {
        let self = this;

        return new Promise((resolve, reject) => {
            window.app.views.main.router.navigate("/initPage", {animate: false});

            app.once('pageInit', () => {

                $("#importSeed").on("click", () => {
                    self.importSeed();
                });

                $("#createNewSeed").on("click", () => {
                    self.getSeed();
                });

                $('#returnButton3').once('click', () => {
                    Utils.appBack();
                });

            });

        });
    }

    /**
     * Import seed popup
     * @returns {Promise<unknown>}
     */
    importSeed() {
        return new Promise((resolve, reject) => {
            let self = this;

            window.app.views.main.router.navigate("/importSeed");

            let passwordCheck = 0;
            let policyCheck = 0;
            let seedPhraseEntered = 0;
            let seedPhraseCheck = 0;

            app.once('pageInit', () => {

                policyCheck = checkPolicyCheckbox();

                $("#policy1").on("click", () => {
                    self.goToPolicy();
                });

                $("#submit").on("click", async () => {
                    passwordCheck = validatePassword();
                    seedPhraseEntered = checkSeedPhraseExist();
                    policyCheck = checkPolicyCheckbox();

                    if(seedPhraseEntered === 1 && passwordCheck === 1 && policyCheck === 1) {
                        let seedPhraseVal = $("#seedPhaseArea").val();

                        try {
                            let keyPair = ""

                            try {
                                keyPair = await this.messenger.rpcCall('main_getKeysFromSeedPhrase', [seedPhraseVal,], 'background');
                                seedPhraseCheck = 1;
                            } catch (e) {
                                seedPhraseCheck = seedPhraseInvalid(e.code);
                                return false;
                            }

                            // Utils.appBack("/", {force : true,  reloadCurrent: true, ignoreCache: true,});
                            // Utils.reloadPage();
                            // location.reload();

                            let publicKey = keyPair.public;
                            let privateKey = keyPair.secret;
                            let password = $("#password").val();

                            try {
                                await this.messenger.rpcCall('main_addAccount', [publicKey, privateKey, password], 'background');
                                await this.messenger.rpcCall('main_changeAccount', [publicKey,], 'background');
                                seedPhraseCheck = 1;

                            } catch (e) {
                                seedPhraseCheck = seedPhraseInvalid(e.code);
                                return false;

                            }

                            if(seedPhraseCheck === 1) {
                                location.reload();
                            }

                        } catch (e) {
                            console.log(e);

                        }
                    }

                });

                $("#policyCheckbox").on("change", () => {
                    policyCheck = checkPolicyCheckbox();
                });

                $('#returnButton').once('click', () => {
                    Utils.appBack();
                });

                LOCALIZATION.updateLocalization();

            });

        });
    }

    /**
     * Generate seed popup
     * @returns {Promise<unknown>}
     */
    getSeed() {
        return new Promise(async (resolve, reject) => {
            let self = this;

            let seedPhraseVal = await this.messenger.rpcCall('main_generateSeedPhrase', undefined, 'background');

            window.app.views.main.router.navigate("/getSeed");

            app.once('pageInit', () => {

                let passwordCheck = 0;
                let policyCheck = 0;

                $("#seedPhrase").text(seedPhraseVal);

                checkPolicyCheckbox();

                $("#policy").on("click", () => {
                    self.goToPolicy();
                });

                $("#submit").on("click", async () => {
                    passwordCheck = validatePassword();
                    policyCheck = checkPolicyCheckbox();
                    if(passwordCheck === 1 && policyCheck === 1) {
                        try {
                            let keyPair = await this.messenger.rpcCall('main_getKeysFromSeedPhrase', [seedPhraseVal,], 'background');

                            let publicKey = keyPair.public;
                            let privateKey = keyPair.secret;
                            let password = $("#password").val();


                            await this.messenger.rpcCall('main_addAccount', [publicKey, privateKey, password], 'background');
                            await this.messenger.rpcCall('main_changeAccount', [publicKey,], 'background');

                            location.reload();
                        } catch (e) {
                            app.dialog.alert(_('Error') + ':' + e.message);
                        }
                    }
                });

                $("#policyCheckbox").on("change", () => {
                    policyCheck = checkPolicyCheckbox();
                });

                $('#returnButton').once('click', () => {
                    Utils.appBack();
                });

                LOCALIZATION.updateLocalization();

            });

        });
    }

    /**
     * Policy popup
     * @returns {Promise<unknown>}
     */
    goToPolicy() {
        return new Promise((resolve, reject) => {
            window.app.views.main.router.navigate("/policy");

            app.once('pageInit', () => {

                $('#returnButton2').once('click', () => {
                    Utils.appBack();
                });

            });

        });
    }

    /**
     * Token transaction popup
     * @param {string} walletAddress
     * @param {string} rootTokenAddress
     * @param {ExtensionMessenger} messenger
     * @returns {Promise<unknown>}
     */
    createTokenTransaction(walletAddress, rootTokenAddress, messenger) {
        return new Promise((resolve, reject) => {
            window.app.views.main.router.navigate("/createTransaction");

            app.once('pageInit', () => {

                $('.transferCommentField').hide();

                $('#transferAmount').on('keyup', () => {
                    let amount = $('#transferAmount').val();
                    let checker = Utils.numberToUnsignedNumber(amount);
                    if(!checker) {
                        $('#transferAmount').parent().parent().parent().addClass('item-input-invalid');
                    } else {
                        $('#transferAmount').parent().parent().parent().removeClass('item-input-invalid');
                    }
                });

                $('#transferAddress').on('keyup', async () => {
                    let address = $('#transferAddress').val();

                    let currentNetwork = await messenger.rpcCall('main_getNetwork', undefined, 'background');

                    const resolver = new DeNsResolver(!(currentNetwork.name === 'main'));

                    if(!Utils.validateTONAddress(address)) {
                        try {
                            address = await resolver.resolveAddress(address.toLowerCase());
                            $('#resolvedAddressHolder').show();

                        } catch (e) {
                            $('#resolvedAddressHolder').hide();
                        }
                    }

                    $('#resolvedAddress').val(address);

                    if(!Utils.validateTONAddress(address)) {
                        $('#transferAddress').parent().parent().parent().addClass('item-input-invalid');
                    } else {
                        $('#transferAddress').parent().parent().parent().removeClass('item-input-invalid');
                    }
                });
                $('#transferAddress').parent().find('.input-clear-button').click(() => {
                    $('#resolvedAddressHolder').hide();
                })

                $('#txTransfer').once('click', async () => {

                    let tokenInfo = await messenger.rpcCall('main_getTokenInfo', [rootTokenAddress], 'background');

                    let amount = $('#transferAmount').val();
                    let address = $('#resolvedAddress').val();
                    let checker = Utils.numberToUnsignedNumber(amount, tokenInfo.decimals);

                    if(!Utils.validateTONAddress(address)) {
                        return app.dialog.alert(_('Invalid address'));
                    }

                    if(!checker) {
                        return app.dialog.alert(_('Invalid amount'));
                    }

                    let account = await messenger.rpcCall('main_getAccount', undefined, 'background');
                    let currentNetwork = await messenger.rpcCall('main_getNetwork', undefined, 'background');


                    Utils.appBack();

                    // try {
                    resolve(await messenger.rpcCall('main_tokenTransfer', [
                        rootTokenAddress,
                        walletAddress,
                        account.public,
                        address,
                        checker
                    ], 'background'));
                    /* } catch (e) {

                         reject(e);
                         app.dialog.alert(`Transaction error: <br> ${JSON.stringify(e)}`);
                         throw e;
                     }*/


                });

                $('#txCancelButton').once('click', () => {
                    Utils.appBack();
                    reject(EXCEPTIONS.rejectedByUser);
                });
                LOCALIZATION.updateLocalization();

            })
        })
    }

    /**
     * Token wallet popup
     * @param {string} rootTokenAddress
     * @param {string} publicKey
     * @param {ExtensionMessenger} messenger
     * @param {string} userWalletAddress
     * @returns {Promise<unknown>}
     */
    tokenWallet(rootTokenAddress, publicKey, messenger, userWalletAddress) {
        return new Promise((resolve, reject) => {
            window.app.views.main.router.navigate("/tokenWallet");

            app.once('pageInit', async () => {
                console.log('TOKEN ADDRESS', rootTokenAddress);

                let tokenInfo = await messenger.rpcCall('main_getTokenInfo', [rootTokenAddress], 'background');
                let walletAddress = await messenger.rpcCall('main_getTokenWalletAddress', [rootTokenAddress, publicKey], 'background');

                console.log(tokenInfo);

                $('.tokenName').text(tokenInfo.name);
                $('.tokenWalletAddress').html(`<a data-clipboard="${walletAddress}" class="autoClipboard" ><i class="material-icons buttonIcon">content_copy</i>${Utils.shortenPubkey(walletAddress)}</a>`)
                $('.tokenWalletTokenIcon').html(tokenInfo.icon);

                $('.getTokenButton').attr('href', tokenInfo.url);
                $('.getTokenButton').click(function () {
                    window.open($(this).attr('href'));
                });

                let tokenBalance = null;
                try {
                    tokenBalance = await messenger.rpcCall('main_getTokenBalance', [rootTokenAddress, publicKey], 'background');

                    $('.tokenWalletBalance').text(Utils.unsignedNumberToSigned(tokenBalance, tokenInfo.decimals));

                    $('.ifTokenWalletNotExists').hide();
                    $('.ifTokenWalletExists').show();
                } catch (e) {
                    $('.ifTokenWalletNotExists').show();
                    $('.ifTokenWalletExists').hide();
                }

                $('.sendTokenButton').click(async () => {

                    try {
                        await popups.createTokenTransaction(walletAddress, rootTokenAddress, messenger);
                    } catch (e) {
                        //app.dialog.alert(`Transaction error: <br> ${JSON.stringify(e)}`);
                    }
                    console.log('Transaction created');
                });

                $('.deployTokenWalletButton').click(async () => {
                    let deployTokenWallet = await messenger.rpcCall('main_deployTokenWallet', [publicKey, userWalletAddress, rootTokenAddress], 'background');

                });


                $('.autoClipboard').click(uiUtils.selfCopyElement());

                LOCALIZATION.updateLocalization();

                resolve();
            });
        });
    }

    /**
     * Account settings popup
     * @param {string} pubKey
     * @returns {Promise<unknown>}
     */
    accSettings(pubKey) {
        let self = this;

        return new Promise((resolve, reject) => {
            window.app.views.main.router.navigate("/accSettings", {animate: false});
            app.once('pageInit', () => {

                $("#submit").on("click", async () => {
                    let AccountValid = checkAccountName();
                    let succesNameChange = false
                    if(AccountValid === 1) {
                        let accountName = $("#accountName").val();
                        try {
                            succesNameChange = await this.messenger.rpcCall('main_setAccountName', [pubKey, accountName], 'background');
                        } catch (e) {
                            console.log(e);
                            return e;
                        }
                        location.reload();
                    }
                });

                $("#forgetAccount").on("click", async () => {
                    try {
                        await this.messenger.rpcCall('main_deleteAccount', [pubKey], 'background');
                        location.reload();
                        self.initPage();
                    } catch (e) {
                        app.dialog.alert(_('Error') + ':' + e.message);
                    }
                });

                $("#getAccountInfo").on("click", async () => {
                    try {
                        let keyPair = await this.messenger.rpcCall('main_getAccountInfo', [pubKey], 'background');

                        let message =
                            `Private key for 
                         <a data-clipboard="${pubKey}" class="autoClipboard">${Utils.shortenPubkey(pubKey)}</a> account is 
                        <a data-clipboard="${keyPair.secret}" class="autoClipboard">${Utils.shortenPubkey(keyPair.secret)}</a> (click for copy)`

                        // messenger.rpcCall('popup_alert', [text, publicKey], 'popup');

                        app.dialog.alert(message);
                        $('.autoClipboard').click(uiUtils.selfCopyElement());

                    } catch (e) {
                        app.dialog.alert(_('Error') + ':' + e.message);
                    }
                });

                $('#returnButton').once('click', () => {
                    location.reload();
                    // Utils.appBack();
                });

                LOCALIZATION.updateLocalization();

            });

        });
    }

    /**
     * TIP3 constructor popup
     * @returns {Promise<undefined>}
     */
    tip3Constructor() {
        return new Promise((resolve, reject) => {
            window.app.views.main.router.navigate("/tip3Constructor");

            app.once('pageInit', () => {


                $('#tokenConstructorCreate').on('click', async () => {

                    let tokenName = $('#tokenName').val();
                    let tokenTicker = $('#tokenTicker').val();
                    let initialMint = $('#initialMint').val();

                    if(!tokenName.trim()) {
                        return app.dialog.alert(_('Invalid token name'));
                    }

                    if(!tokenTicker.trim()) {
                        return app.dialog.alert(_('Invalid ticker name'));
                    }

                    if(!Utils.numberToUnsignedNumber(initialMint)) {
                        return app.dialog.alert(_('Invalid amount'));
                    }


                    Utils.appBack();

                    let account = await this.messenger.rpcCall('main_getAccount', undefined, 'background');
                    let currentNetwork = await this.messenger.rpcCall('main_getNetwork', undefined, 'background');


                    await this.messenger.rpcCall('main_createTip3Token', [undefined,
                        {
                            tokenName,
                            tokenTicker,
                            initialMint: Utils.numberToUnsignedNumber(initialMint),
                            randomNonce: +new Date()
                        },
                        account.wallets[currentNetwork.name].address,
                        account.public

                    ], 'background');

                });

                LOCALIZATION.updateLocalization();

                resolve();
            });

        })


    }

    /**
     * Add custom network popup
     * @returns {Promise<unknown>}
     */
    customNetwork() {
        return new Promise((resolve, reject) => {
            window.app.views.main.router.navigate("/customNetwork");

            app.once('pageInit', () => {


                $('#tokenConstructorCreate').on('click', async () => {

                    let networkName = $('#networkName').val();
                    let networkUrl = $('#networkUrl').val();
                    let networkDescription = $('#networkDescription').val();

                    if(!networkName.trim()) {
                        return app.dialog.alert(_('Invalid network name'));
                    }

                    if(!networkUrl.trim()) {
                        return app.dialog.alert(_('Invalid network URL'));
                    }


                    Utils.appBack();


                    await this.messenger.rpcCall('main_addCustomNetwork', [networkName, networkUrl, networkDescription], 'background');


                });

                LOCALIZATION.updateLocalization();

                resolve();
            });

        })


    }


}

export default new Popups();