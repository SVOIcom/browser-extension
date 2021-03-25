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
    popup_password: (message, publicKey) => {
        return new Promise((resolve, reject) => {
            app.dialog.password(`${message} \nAction password required for public key: ${publicKey}`, 'Password required', (password) => {
                resolve(password)
            }, () => {
                resolve(false)
            });
        })
    },
    popup_close: async () => {
        setTimeout(() => {
            window.close();
        }, 10);
        return true;
    },

    popup_networkChanged: async () => {
        console.log('NETWORK CHANGED');
        await updateNetworkWidget();
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

async function updateNetworkWidget(){
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