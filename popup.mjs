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

import ExtensionMessenger from "./modules/ExtensionMessenger.mjs";
import {default as theme} from "./modules/ui/theme.mjs"
import {default as popups} from "./modules/ui/popups.mjs"
import ROUTES from "./modules/ui/routes.mjs";
import EXCEPTIONS from "./modules/const/Exceptions.mjs";
import Utils from "./modules/utils.mjs";
import uiUtils from "./modules/ui/uiUtils.mjs";
import walletWidget from "./modules/ui/widgets/walletWidget.mjs";
import networkWidget from "./modules/ui/widgets/networkWidget.mjs";

const RPC = {
    'popup_test': async (a, b) => {
        return a * b;
    },
    'popup_fall': async () => {
        throw EXCEPTIONS.testException;
    },
    popup_testSign: (message, publicKey) => {
        return new Promise((resolve, reject) => {
            app.dialog.confirm(`${message} Pubkey: ${publicKey}`, `Action required`, () => {
                resolve(true)
            }, () => {
                resolve(false)
            });
        })
    },

    /**
     * Show password input window
     * @param message
     * @param publicKey
     * @returns {Promise<unknown>}
     */
    popup_password: (message, publicKey) => {
        return new Promise((resolve, reject) => {
            app.dialog.password(`${message} \nAction password required for public key: ${publicKey}`, 'Password required', (password) => {
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
        await updateAccountWidget();
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
        callingData.additionalMessage = acceptMessage;
        return popups.acceptTransaction(publicKey, type, callingData);
    }
}
let messenger = new ExtensionMessenger('popup', RPC);

// Dom7
const $ = Dom7;


// Init App
const app = new Framework7({
    id: "tonwallet",
    root: "#app",
    theme: "aurora",
    autoDarkTheme: true,
    dialog: {
        title: 'TONWallet',
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

await theme.updateState();
await theme.loadState();


window.theme = theme;

window.popups = popups;


//Glue code




async function updateAccountWidget() {
    let account = await messenger.rpcCall('main_getAccount', undefined, 'background');
    $('#accountChanger').text(`${Utils.shortenPubkey(account.public)}`);
}

await updateAccountWidget();

async function changeAccount(publicKey) {
    console.log('CHANGE ACCOUNT', publicKey);
    await messenger.rpcCall('main_changeAccount', [publicKey], 'background');
}

$('#accountChanger').on('click', async () => {
    let keys = await messenger.rpcCall('main_getPublicKeys', undefined, 'background');
//TODO get wallets for keys
    //Todo get current account

    let buttons = [
        {
            text: 'Change account',
            label: true
        },
    ];

    for (let key of keys) {
        buttons.push({
            text: Utils.shortenPubkey(key),
            //bold: key === currentNetwork.name,
            onClick: async function () {
                await changeAccount(key);

            }
        })
    }

    buttons.push({
        text: 'Add existing keypair',
        color: ''
    });
    buttons.push({
        text: 'Create keypair',
        color: ''
    });
    buttons.push({
        text: 'Cancel',
        color: 'red'
    });


    const actions = app.actions.create({
        buttons

    });

    actions.open();
    actions.$el.addClass('selectNetworkActions')
})

let network = networkWidget(messenger, app);

await network.updateNetworkWidget();

let wallet = walletWidget(messenger, app);

await wallet.updateWalletWidget();