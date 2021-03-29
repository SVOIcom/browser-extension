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

const UPDATE_INTERVAL = 10000;

const $ = Dom7;

/**
 * Wallet widget logic
 */
class walletWidget {
    constructor(messenger, app) {
        this.messenger = messenger;
        this.app = app;
        this.wallet = null;


        $('.enterWalletButton').click(async () => {

            let address = await this.promptWalletAddress();
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
            await this.messenger.rpcCall('main_setNetworkWallet', [account.public, currentNetwork.name, walletObj], 'background');

            await this.updateWalletWidget();

        });

        setInterval(async () => {
            await this.updateWalletWidget();
        }, UPDATE_INTERVAL)
    }

    /**
     * Update wallet widget view
     * @returns {Promise<void>}
     */
    async updateWalletWidget() {
        let currentNetwork = await this.messenger.rpcCall('main_getNetwork', undefined, 'background');
        let account = await this.messenger.rpcCall('main_getAccount', undefined, 'background');


        //console.log(account);
        $('.walletTokenIcon').html(currentNetwork.network.tokenIcon);

        //console.log(account.wallets[currentNetwork.name], currentNetwork.name);

        if(account.wallets[currentNetwork.name]) {
            let wallet = account.wallets[currentNetwork.name];
            this.wallet = wallet;
            $('.walletAddress').html(`<a data-clipboard="${wallet.address}" class="autoClipboard" title="${wallet.type}">${Utils.shortenPubkey(wallet.address)}</a>`)

            try {
                //Get wallet balance
                let balance = await this.messenger.rpcCall('main_getWalletBalance', [wallet.address], 'background');

                $('.walletBalance').text( Utils.unsignedNumberToSigned(balance));

            }catch (e){
                $('.walletBalance').text('0.0');
            }

            $('.ifWalletExists').show();
            $('.ifWalletNotExists').hide();
        } else {

            $('.walletBalance').text('0.0');
            $('.ifWalletExists').hide();
            $('.ifWalletNotExists').show();
        }

        $('.autoClipboard').click(uiUtils.selfCopyElement());

    }

    /**
     * Prompt wallet address
     * @returns {Promise<unknown>}
     */
    promptWalletAddress() {
        return new Promise((resolve, reject) => {
            app.dialog.prompt(`Enter wallet address:`, 'Entering address', (address) => {
                resolve(address)
            }, reject);
        })
    }
}

export default function (messenger, app,) {
    return new walletWidget(messenger, app,);
}