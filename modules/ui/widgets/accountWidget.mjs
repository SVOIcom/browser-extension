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
import {default as popups} from "../popups.mjs"
import LOCALIZATION from "../../Localization.mjs";


const _ = LOCALIZATION._;
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
                    text: _('Change account'),
                    label: true
                },
            ];

            for (let key of keys) {
                let accHaveName = await this.messenger.rpcCall('main_getAccountName', [key], 'background');
                let buttonText = Utils.shortenPubkey(key);
                if(accHaveName !== "") {
                    buttonText = accHaveName;
                }

                buttons.push({
                    text: buttonText,
                    //bold: key === currentNetwork.name,
                    onClick: async function () {
                        await that.changeAccount(key);

                    }
                })
            }

            buttons.push({
                text: _('Add existing keypair'),
                color: '',
                onClick: async () => {
                    popups.importSeed()
                }
            });
            buttons.push({
                text: _('Create keypair'),
                color: '',
                onClick: async () => {
                    popups.getSeed()
                }
            });
            buttons.push({
                text: _('Cancel'),
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

        let accHaveName = await this.messenger.rpcCall('main_getAccountName', [account.public], 'background');
        let buttonText = Utils.shortenPubkey(account.public)
        if(accHaveName !== "") {
            buttonText = accHaveName;
        }

        $('#accountChanger').text(buttonText);
    }


}

export default function (messenger, app,) {
    return new accountWidget(messenger, app,);
}