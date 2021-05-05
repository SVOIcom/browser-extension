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

import LOCALIZATION from "../../Localization.mjs";
import popups from "../popups.mjs";


const _ = LOCALIZATION._;
const $ = Dom7;


class networkWidget {
    constructor(messenger, app) {
        this.messenger = messenger;
        this.app = app;

        let that = this;


        $('#networkChanger').on('click', async () => {
            let networks = await this.messenger.rpcCall('main_getNetworks', undefined, 'background');
            let currentNetwork = await this.messenger.rpcCall('main_getNetwork', undefined, 'background');

            let buttons = [
                {
                    text: _('Select network'),
                    label: true
                },
            ];

            for (let networkName of Object.keys(networks)) {
                let network = networks[networkName];
                buttons.push({
                    text: networkName + `<span class="greyText smallText"> <br> ${network.description} <br><i>${network.url}</i></span>`,
                    bold: networkName === currentNetwork.name,
                    onClick: async function () {
                        await that.changeNetwork(networkName);

                    }
                })
            }

            buttons.push({
                text: _('Add network'),
                onClick: async function () {
                    await popups.customNetwork();

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

    async updateNetworkWidget() {
        let currentNetwork = await this.messenger.rpcCall('main_getNetwork', undefined, 'background');
        $('#networkChanger').text(_('Network') + `: ${currentNetwork.name}`);

    }

    async changeNetwork(network) {
        console.log('CHANGE NETWORK', network);
        await this.messenger.rpcCall('main_changeNetwork', [network], 'background');
    }


}

export default function (messenger, app,) {
    return new networkWidget(messenger, app,);
}