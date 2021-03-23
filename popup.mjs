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

const RPC = {
    'popup_test': async (a, b) => {
        return a * b;
    },
    'popup_fall': async () => {
        throw new Error('Some exception');
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
    routes: [],
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



window.theme = theme;