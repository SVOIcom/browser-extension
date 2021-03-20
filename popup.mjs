import ExtensionMessenger from "./modules/ExtensionMessenger.mjs";

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
    id: "baton",
    root: "#app",
    theme: "aurora",
    autoDarkTheme: true,
    dialog: {
        title: 'baTON',
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