/**
 * @name ScaleWallet - Everscale browser wallet and injector
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */

import ExtensionMessenger from "./modules/ExtensionMessenger.mjs";
import {default as theme} from "./modules/ui/theme.mjs";
import {default as popups} from "./modules/ui/popups.mjs";
import ROUTES from "./modules/ui/routes.mjs";
import EXCEPTIONS from "./modules/const/Exceptions.mjs";
import walletWidget from "./modules/ui/widgets/walletWidget.mjs";
import networkWidget from "./modules/ui/widgets/networkWidget.mjs";
import accountWidget from "./modules/ui/widgets/accountWidget.mjs";

import Utils from "./modules/utils.mjs";
import LOCALIZATION from "./modules/Localization.mjs";
import MISC from "./modules/const/Misc.mjs";
import LocalStorage from "./modules/LocalStorage.mjs";
import Browser from "./modules/internalBrowser/Browser.mjs";
import FingerprintAuth from "./modules/ui/FingerprintAuth.mjs";
import PluginManager from "./modules/PluginManager.mjs";


async function startPopup() {
    const _ = LOCALIZATION._;

    const RPC = {
        'popup_test': async (a, b) => {
            return a * b;
        },
        'popup_fall': async () => {
            throw EXCEPTIONS.testException;
        },
        popup_testSign: (message, publicKey) => {
            return new Promise((resolve, reject) => {
                app.dialog.confirm(`${message} Pubkey: ${publicKey}`, _(`Action required`), () => {
                    resolve(true)
                }, () => {
                    resolve(false)
                });
            })
        },

        /**
         * Show toast message
         * @param message
         * @returns {Toast.Toast}
         */
        popup_showToast: (message) => {
            return new Promise((resolve, reject) => {
                app.toast.create({
                    closeTimeout: 3000,
                    destroyOnClose: true,
                    text: message
                }).open();
                resolve(true);
            });

        },

        /**
         * Show password input window
         * @param message
         * @param publicKey
         * @returns {Promise<unknown>}
         */
        popup_password: (message, publicKey) => {
            return new Promise((resolve, reject) => {

                app.dialog.password(`${message} \n${_('Action password required for public key')}: ${Utils.shortenPubkey(publicKey)}`, _('Password required'), (password) => {
                    resolve(password)
                }, () => {
                    resolve(false)
                });
            })
        },

        /**
         * Show alert
         * @param message
         * @returns {Promise<unknown>}
         */
        popup_alert: (message) => {
            return new Promise((resolve, reject) => {
                return app.dialog.alert(message, () => {
                    resolve()
                })
            });
        },

        /**
         * Close current window
         * @returns {Promise<boolean>}
         */
        popup_close: async () => {
            setTimeout(() => {
                window.close();
            }, 10);
            return true;
        },

        /**
         * Network changed event
         * @returns {Promise<boolean>}
         */
        popup_networkChanged: async () => {
            console.log('NETWORK CHANGED');
            await network.updateNetworkWidget();
            await wallet.updateWalletWidget();
            return true;
        },

        /**
         * Account changed event
         * @returns {Promise<boolean>}
         */
        popup_accountChanged: async () => {
            console.log('ACCOUNT CHANGED');
            await account.updateAccountWidget();
            await wallet.updateWalletWidget();
            return true;
        },

        /**
         * Show accept signing window
         * @param publicKey
         * @param type
         * @param callingData
         * @param acceptMessage
         * @returns {Promise<*>}
         */
        popup_acceptSignMessage: async (publicKey, type = 'run', callingData, acceptMessage) => {
            callingData.additionalMessage = !callingData.additionalMessage ? acceptMessage : callingData.additionalMessage;
            return popups.acceptTransaction(publicKey, type, callingData);
        }
    }
    let messenger = new ExtensionMessenger('popup', RPC);
    popups.messenger = messenger;
    window.messenger = messenger;

    if(location.hash === '#popNewWindow') {
        try {
            await messenger.rpcCall('mainOpenPopup', [{left: window.screenLeft, top: window.screenTop}], 'background');
            window.close();
           // return;
        } catch (e) {
            console.error(`Can't open new window: ${e}`);
        }
    }

// Dom7
    const $ = Dom7;


    let appTheme = "aurora";
    if(window._isApp) {
        if(navigator.userAgent.toLowerCase().includes('android')) {
            appTheme = 'md';
        }

        if(navigator.platform.toLowerCase().includes('ios')) {
            appTheme = 'ios';
        }
    }

// Init App
    const app = new Framework7({
        id: "tonwallet",
        root: "#app",
        theme: appTheme,
        autoDarkTheme: true,
        view: {stackPages: true,},
        dialog: {
            title: 'ScaleWallet',
        },
        data: function () {
            return {
                user: {
                    firstName: "John",
                    lastName: "Doe",
                },
            };
        },
        methods: {
            helloWorld: function () {
                app.dialog.alert("Hello World!");
            },
        },
        on: {
            pageAfterIn: async function (event, page) {
                await theme.updateState();
            },
            pageInit: async function (event, page) {

            },
        },
        routes: ROUTES,
        popup: {
            closeOnEscape: true,
        },
        sheet: {
            closeOnEscape: true,
        },
        popover: {
            closeOnEscape: true,
        },
        actions: {
            closeOnEscape: true,
        },
    });
    window.app = app;

    let localStorage = new LocalStorage();

    await theme.updateState();
    await theme.loadState();


    window.theme = theme;

    window.popups = popups;

    let walletsObj = (await messenger.rpcCall('main_getAccount', undefined, 'background')).public;
// console.log(walletsObj, "<<<<<<");
// popups.initPage();

    if(walletsObj == null) {
        popups.initPage();
    }

    LOCALIZATION.updateLocalization();


//Glue code
    let account = accountWidget(messenger, app);
    await account.updateAccountWidget();

    let network = networkWidget(messenger, app);
    await network.updateNetworkWidget();

    let wallet = walletWidget(messenger, app);
    await wallet.updateWalletWidget();

    LOCALIZATION.updateLocalization();
    LOCALIZATION.startTimer();


    let manifest = await Utils.fetchJSON('/package.json');
    console.log('manifest', manifest);
    $('#version').text('Version ' + manifest.version);

    let currentLang = LOCALIZATION.currentLang;
    console.log(currentLang);
    $(`#${currentLang}`).attr("style", "color: blue");

    $("#languageMenu li a").on("click", function (e) {
        // $(this).attr("style", "color: blue");

        // $("#languageMenu li a").find(".colour-change").attr("style", "");
        // $(`#${e.target.id}`).attr("style", "color: blue");
        // LOCALIZATION.changeLang(`${e.target.id}`);

        // console.log(e.target);
        // console.log(Dom7(this));

        $("#languageMenu").find(".colour-change").attr("style", "");

        $(this).attr("style", "color: blue");

        LOCALIZATION.changeLang($(this).attr("id"));

    })


    $('.sendMoneyButton').click(async () => {

        try {
            await popups.createTransaction();
        } catch (e) {
            //app.dialog.alert(`Transaction error: <br> ${JSON.stringify(e)}`);
        }
        console.log('Transaction created');
    })

    //EVERWallet emulation
    let everWalletEmulationToggle = app.toggle.get('#everWalletEmulation');
    let everWalletEmulation = await localStorage.get('everWalletEmulation', true);
    everWalletEmulationToggle.checked = !!everWalletEmulation;
    everWalletEmulationToggle.on('change', async function () {
        await localStorage.set('everWalletEmulation', everWalletEmulationToggle.checked);
    });


    let pluginManager = window.pluginManager = await (new PluginManager()).init();
    await pluginManager.runUIPlugins();

    /**
     * Update sidebar accounts list
     * @returns {Promise<void>}
     */
    async function updateAccountsInSettings() {
        $('#accountList').empty();

        let pubKeys = await messenger.rpcCall('main_getPublicKeys', [], 'background');

        for (let pubKey of pubKeys) {
            let accHaveName = await messenger.rpcCall('main_getAccountName', [pubKey], 'background');
            let buttonText = Utils.shortenPubkey(pubKey);
            if(accHaveName !== "") {
                buttonText = accHaveName;
            }


            let appendStr = `<li><a href="" id="${pubKey}">${buttonText}</a></li>`;
            $('#accountList').append(appendStr);
            $(`#${pubKey}`).on('click', () => {
                popups.accSettings(pubKey);
                app.panel.close('right', true);

            });
        }

    }

    window.updateAccounsInSettings = updateAccountsInSettings

    $('#openSettings').on('click', async () => {
        await updateAccountsInSettings();
        app.panel.open($('.panel-right'));
    })

    //Cancel pending TX on window closing
    window.addEventListener("beforeunload", function (e) {
        $('#txCancelButton').click();
    }, false);


    $(window).on('focus', async () => {
        //console.log('FOCUS IN');
        clearInterval(window.focusOutTimer);
        clearTimeout(window.closeReminderTimer);
        if(window.closeReminder) {
            window.closeReminder.close();
            delete window.closeReminder;
        }
    })

    $(window).on('mousemove', async () => {
        if(document.hasFocus()) {
            //console.log('MOUSE MOVE');
            clearInterval(window.focusOutTimer);
            clearTimeout(window.closeReminderTimer);
            if(window.closeReminder) {
                window.closeReminder.close();
                delete window.closeReminder;
            }
        }
    })

    $(window).on('blur', async () => {
        //console.log('FOCUS OUT');

        window.focusOutTimer = setInterval(async () => {

            let activeActions = await messenger.rpcCall('main_getActiveActions', undefined, 'background');

            if(activeActions.length === 0) {
                console.log('NO ACTIVITY DETECTED. CLOSING');


                window.closeReminder = app.dialog.alert(_('The wallet popup will be closed in 5 seconds due to inactivity'))
                window.closeReminderTimer = setTimeout(() => {
                    $('#txCancelButton').click();
                    window.close();
                }, 5000);
            }

        }, MISC.POPUP_FOCUSOUT_CLOSE_TIMER);


    })


    //Heartbeat to background for saving popup info
    const popupHeartbeat = async () => {
        try {
            await messenger.rpcCall('main_popupHeartbeat', undefined, 'background');

        } catch (e) {
        }
    };
    setInterval(popupHeartbeat, 500);


}

if(!window._isApp) {

    startPopup();

} else {
    //If app is started from popup, start popup

    let fingerprint = new FingerprintAuth();
    await fingerprint.init();
    window.finger = fingerprint;

    let internalBrowser;
    let messenger = new ExtensionMessenger('page', {
        page_hideBrowser: () => {
            internalBrowser.hideBrowser();
        },

        page_showBrowser: () => {
            internalBrowser.showBrowser();
        },
    });

    internalBrowser = new Browser(messenger);
    window.internalBrowser = internalBrowser;

    $('.mobileHide').hide();
    $('.mobileShow').show();

    $('#openBrowser').click(() => {
        if(internalBrowser.tabs.length === 0) {
            internalBrowser.newTab();
        } else {
            internalBrowser.showBrowser();
        }

    })

    document.addEventListener("backbutton", () => {
        Utils.appBack();
    }, false);
}

export default startPopup;