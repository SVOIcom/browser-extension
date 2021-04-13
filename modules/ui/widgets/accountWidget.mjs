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

import Utils from "../../utils.mjs";
import uiUtils from "../uiUtils.mjs";
import {default as popups} from "/modules/ui/popups.mjs"


const $ = Dom7;


class accountWidget {
    constructor(messenger, app) {
        this.messenger = messenger;
        this.app = app;

        let that = this;


        $('#accountChanger').on('click', async () => {
            let keys = await this.messenger.rpcCall('main_getPublicKeys', undefined, 'background');
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
                        await that.changeAccount(key);

                    }
                })
            }

            buttons.push({
                text: 'Add existing keypair',
                color: '',
                onClick: async () => {popups.importSeed()}
            });
            buttons.push({
                text: 'Create keypair',
                color: '',
                onClick: async () => {popups.getSeed()}
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
    }

    async changeAccount(publicKey) {
        console.log('CHANGE ACCOUNT', publicKey);
        await this.messenger.rpcCall('main_changeAccount', [publicKey], 'background');
    }

    async updateAccountWidget() {
        let account = await this.messenger.rpcCall('main_getAccount', undefined, 'background');
        $('#accountChanger').text(`${Utils.shortenPubkey(account.public)}`);
    }



}

export default function (messenger, app,) {
    return new accountWidget(messenger, app,);
}