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
import WalletContract from "../../const/WalletContract.mjs";
import TOKEN_LIST from "../../const/TokenList.mjs";
import popups from "../popups.mjs";

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

            let walletType = await uiUtils.popupSelector(WalletContract.WALLET_TYPES_LIST, 'Wallet type');

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

        $('.createWalletButton, .editWalletButton').click(async () => {
            let walletType = await uiUtils.popupSelector([...WalletContract.WALLET_TYPES_LIST, {
                text: 'Enter custom address', onClick: async () => {
                    $('.enterWalletButton').click();
                }
            }], 'Wallet type');

            if(!walletType) {
                return;
            }

            let currentNetwork = await this.messenger.rpcCall('main_getNetwork', undefined, 'background');
            let account = await this.messenger.rpcCall('main_getAccount', undefined, 'background');

            let newWallet = await this.messenger.rpcCall('main_createWallet', [account.public, walletType], 'background');

            console.log('NEW WALLET', newWallet);

            const walletObj = {
                address: newWallet,
                type: walletType,
                config: {},
            }

            await this.messenger.rpcCall('main_setNetworkWallet', [account.public, currentNetwork.name, walletObj], 'background');

            await this.updateWalletWidget();


        });

        $('.deployWalletButton').click(async () => {

            let currentNetwork = await this.messenger.rpcCall('main_getNetwork', undefined, 'background');
            let account = await this.messenger.rpcCall('main_getAccount', undefined, 'background');
            if(account.wallets[currentNetwork.name]) {
                let wallet = account.wallets[currentNetwork.name];

                let balance = 0;
                try {
                    balance = await this.messenger.rpcCall('main_getWalletBalance', [wallet.address], 'background');
                } catch (e) {
                }

                if(balance === 0) {
                    app.dialog.alert(`The balance of the current wallet is empty. To create a wallet contract, you need to top up the balance by at least 1 TON`);
                    await this.updateWalletWidget();
                    return;
                }

                try {
                    await this.messenger.rpcCall('main_deployWallet', [account.public, wallet.type], 'background');
                } catch (e) {
                    app.dialog.alert(`Wallet deploy error: ${JSON.stringify(e)}`);
                }

                await this.updateWalletWidget();

                app.toast.create({closeTimeout: 3000, destroyOnClose: true, text: 'Wallet deployed'}).open();

            }

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

            let deployed = await this.messenger.rpcCall('main_getWalletDeployed', [wallet.address], 'background');

            try {
                //Get wallet balance
                let balance = await this.messenger.rpcCall('main_getWalletBalance', [wallet.address], 'background');


                $('.walletBalance').text(Utils.unsignedNumberToSigned(balance));

            } catch (e) {
                $('.walletBalance').text('0.0');
            }

            //If not deployed, show deploy button
            if(deployed) {
                $('.ifWalletExists').show();
                $('.ifWalletNotExists').hide();
            } else {
                $('.ifWalletExists').hide();
                $('.createWalletButton').hide();
                $('.deployWalletButton').show();
                $('.ifWalletNotExists').show();
                $('.ifWalletNotDeployed').show();
            }
        } else {
            //If wallet not deployed and not created
            $('.walletBalance').text('0.0');
            $('.ifWalletExists').hide();
            $('.ifWalletNotExists').show();
            $('.createWalletButton').show();
            $('.deployWalletButton').hide();
            $('.ifWalletNotDeployed').hide();
        }

        await this.updateAssetsList();

        await this.updateHistoryList();

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

    /**
     * Update wallet history list
     * @returns {Promise<void>}
     */
    async updateHistoryList() {

        let currentNetwork = await this.messenger.rpcCall('main_getNetwork', undefined, 'background');
        let account = await this.messenger.rpcCall('main_getAccount', undefined, 'background');
        if(account.wallets[currentNetwork.name]) {
            let wallet = account.wallets[currentNetwork.name];
            //historyList
            try {


                let history = await this.messenger.rpcCall('main_getWalletHistory', [wallet.address, 10], 'background');
                let html = `<ul>`;

                for (let story of history) {
                    // console.log(story);
                    html += ` <li>
                                <a href="https://${currentNetwork.network.explorer}/messages/messageDetails?id=${story.id}" class="item-link item-content externalHref" target="_blank">
                                    <div class="item-media"><i class="material-icons">${story.src === wallet.address ? 'call_made' : 'call_received'}</i></div>
                                    <div class="item-inner">
                                        <div class="item-title"> ${currentNetwork.network.tokenIcon}  <span>${Utils.shortenPubkey(story.id)}</span> </div>
                                        <div class="item-after">${story.value === null ? 'ext' : Utils.unsignedNumberToSigned(story.value)}</div>
                                    </div>
                                </a>
                             </li>`
                }


                html += ` <li>
                                <a href="https://${currentNetwork.network.explorer}/accounts/accountDetails?id=${wallet.address}" class="item-link item-content externalHref" target="_blank">
                                    <div class="item-media"><i class="material-icons">visibility</i></div>
                                    <div class="item-inner">
                                        <div class="item-title"> View all in explorer </div>
                                        <div class="item-after"></div>
                                    </div>
                                </a>
                             </li>`

                html += `</ul>`;

                $('.historyList').html(html);

                $('.externalHref').click(function () {
                    window.open($(this).attr('href'));
                })
            } catch (e) {

                $('.historyList').html(`<div class="block block-strong text-align-center">
                        Empty
                           <a class="button externalHref" href="https://${currentNetwork.network.explorer}/accounts/accountDetails?id=${wallet.address}" target="_blank">View in explorer</a>
                    </div>`);

            }
        } else {
            $('.historyList').html(`<div class="block block-strong text-align-center">Empty</div>`);
        }
    }

    /**
     * Update UI assets list
     * @returns {Promise<void>}
     */
    async updateAssetsList() {

        const that = this;
        let currentNetwork = await this.messenger.rpcCall('main_getNetwork', undefined, 'background');
        let account = await this.messenger.rpcCall('main_getAccount', undefined, 'background');

        let tokens = await this.messenger.rpcCall('main_getAccountTokens', [account.public, currentNetwork.name], 'background');

        let html = `<ul>`;

        for (let tokenAddress of Object.keys(tokens)) {

            let tokenInfo = tokens[tokenAddress];
            let tokenBalance = null;

            try {
                tokenBalance = await this.messenger.rpcCall('main_getTokenBalance', [tokenAddress, account.public], 'background');
            } catch (e) {
            }

            console.log(tokenInfo);

            html += ` <li>
                        <a href="#" data-address="${tokenAddress}" class="item-link item-content tokenButton">
                            <div class="item-media">${tokenInfo.icon}</div>
                            <div class="item-inner">
                                <div class="item-title">${tokenInfo.name} (${tokenInfo.symbol})</div>
                                <div class="item-after">${tokenInfo.fungible ? (tokenBalance !== null ? Utils.unsignedNumberToSigned(tokenBalance, tokenInfo.decimals)  : 'Not deployed') : 'NFT'}</div>
                            </div>
                        </a>
                    </li>`;
        }


        html += ` <li>
                    <a href="#" class="item-link item-content addTokenToAccount">
                        <div class="item-media"><i class="material-icons">add</i></div>
                        <div class="item-inner">
                            <div class="item-title"> Add token </div>
                            <div class="item-after"></div>
                        </div>
                    </a>
                 </li>`

        html += '</ul>';

        $('.assetsList').html(html);

        $('.addTokenToAccount').click(async () => {
            let tokenClickList = [];

            async function addTokenToAccount(rootTokenAddress) {
                try {
                    await that.messenger.rpcCall('main_addAccountToken', [account.public, rootTokenAddress, currentNetwork.name], 'background');
                } catch (e) {
                    console.log(e);
                    app.toast.create({closeTimeout: 3000, destroyOnClose: true, text: 'Token adding error'}).open();
                }

                await that.updateAssetsList();

            }

            for (let token of TOKEN_LIST.TIP3_FUNGIBLE) {
                tokenClickList.push({
                    text: token.name, onClick: async () => {
                        await addTokenToAccount(token.rootAddress);
                    }
                });
            }

            let addToken = await uiUtils.popupSelector([...tokenClickList, {
                text: 'Enter custom token address', onClick: async () => {

                    app.dialog.prompt(`Enter root token address:`, 'Entering address', async (rootTokenAddress) => {
                        let tokenInfo = await this.messenger.rpcCall('main_getTokenInfo', [rootTokenAddress], 'background');

                        console.log('TOKEN INFO', tokenInfo);

                        await addTokenToAccount(rootTokenAddress);
                    });


                }
            }], 'Select token');
        });

        $('.tokenButton').click(async function () {
            let tokenAddress = $(this).data('address');
            await popups.tokenWallet(tokenAddress, account.public, that.messenger);
        })
    }
}

export default function (messenger, app,) {
    return new walletWidget(messenger, app,);
}