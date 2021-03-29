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
        await updateNetworkWidget();
        await updateWalletWidget();
        return true;
    },

    /**
     * Account changed event
     * @returns {Promise<boolean>}
     */
    popup_accountChanged: async () => {
        console.log('ACCOUNT CHANGED');
        await updateAccountWidget();
        await updateWalletWidget();
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

async function changeNetwork(network) {
    console.log('CHANGE NETWORK', network);
    await messenger.rpcCall('main_changeNetwork', [network], 'background');
}

async function updateNetworkWidget() {
    let currentNetwork = await messenger.rpcCall('main_getNetwork', undefined, 'background');
    $('#networkChanger').text(`Network: ${currentNetwork.name}`);

}

await updateNetworkWidget();

$('#networkChanger').on('click', async () => {
    let networks = await messenger.rpcCall('main_getNetworks', undefined, 'background');
    let currentNetwork = await messenger.rpcCall('main_getNetwork', undefined, 'background');

    let buttons = [
        {
            text: 'Select network',
            label: true
        },
    ];

    for (let networkName of Object.keys(networks)) {
        let network = networks[networkName];
        buttons.push({
            text: networkName + `<span class="greyText smallText"> <br> ${network.description} <br><i>${network.url}</i></span>`,
            bold: networkName === currentNetwork.name,
            onClick: async function () {
                await changeNetwork(networkName);

            }
        })
    }

    buttons.push({
        text: 'Add network',
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
        text: 'Add existing wallet',
        color: ''
    });
    buttons.push({
        text: 'Create wallet',
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

/**
 * Update wallet info
 * @returns {Promise<void>}
 */
async function updateWalletWidget() {
    let currentNetwork = await messenger.rpcCall('main_getNetwork', undefined, 'background');
    let account = await messenger.rpcCall('main_getAccount', undefined, 'background');


    console.log(account);
    $('.walletTokenIcon').html(currentNetwork.network.tokenIcon);

    console.log(account.wallets[currentNetwork.name], currentNetwork.name);

    if(account.wallets[currentNetwork.name]) {
        let wallet = account.wallets[currentNetwork.name];
        $('.walletAddress').html(`<a data-clipboard="${wallet.address}" class="autoClipboard" title="${wallet.type}">${Utils.shortenPubkey(wallet.address)}</a>`)

        $('.ifWalletExists').show();
        $('.ifWalletNotExists').hide();
    } else {


        $('.ifWalletExists').hide();
        $('.ifWalletNotExists').show();
    }

    $('.autoClipboard').click(uiUtils.selfCopyElement());

}

$('.enterWalletButton').click(async () => {

    let address = await promptWalletAddress();
    let currentNetwork = await messenger.rpcCall('main_getNetwork', undefined, 'background');
    let account = await messenger.rpcCall('main_getAccount', undefined, 'background');

    if(!address || address.length === 0) {
        return;
    }

    let walletType = await uiUtils.popupSelector(['SafeMultisig', 'SafeMultisig2', 'SURF'], 'Wallet type');

    if(!walletType) {
        return;
    }

    const walletObj = {
        address: address,
        type: walletType,
        config: {},
    }

    console.log(walletObj);

    //main_setNetworkWallet
    await messenger.rpcCall('main_setNetworkWallet', [account.public, currentNetwork.name, walletObj], 'background');

    await updateWalletWidget();

});

function promptWalletAddress() {
    return new Promise((resolve, reject) => {
        app.dialog.prompt(`Enter wallet address:`, 'Entering address', (address) => {
            resolve(address)
        }, reject);
    })
}

await updateWalletWidget();