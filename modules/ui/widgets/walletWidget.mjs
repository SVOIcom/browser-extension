/**
 * @name ScaleWallet - Everscale browser wallet and injector
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */

import Utils from "../../utils.mjs";
import TonSwapTokenList from "../../const/TonSwapTokenList.mjs";
import uiUtils from "../uiUtils.mjs";
import WalletContract from "../../const/WalletContract.mjs";
import TOKEN_LIST from "../../const/TokenList.mjs";
import popups from "../popups.mjs";
import LOCALIZATION from "../../Localization.mjs";

const UPDATE_INTERVAL = 30000;


const _ = LOCALIZATION._;
const $ = Dom7;

/**
 * Wallet widget logic
 */
class walletWidget {
    constructor(messenger, app) {
        this.messenger = messenger;
        this.app = app;
        this.wallet = null;

        /*$(window).on('focus', async ()=>{
            $('.walletTokenIcon tgs-player')[0].getLottie().play();
        })

        $(window).on('blur', async ()=>{
            $('.walletTokenIcon tgs-player')[0].getLottie().stop();
        })*/

        const enterWallet = async () => {

            let address = await this.promptWalletAddress();
            let currentNetwork = await messenger.rpcCall('main_getNetwork', undefined, 'background');
            let account = await messenger.rpcCall('main_getAccount', undefined, 'background');

            if(!address || address.length === 0) {
                return;
            }

            let walletType = await uiUtils.popupSelector(WalletContract.WALLET_TYPES_LIST, _('Wallet type'));

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

        }

        $('.enterWalletButton').click(enterWallet);

        $('.createWalletButton, .editWalletButton').click(async () => {

            app.preloader.showIn($('.userWalletHolder'));
            let currentNetwork = await this.messenger.rpcCall('main_getNetwork', undefined, 'background');
            let account = await this.messenger.rpcCall('main_getAccount', undefined, 'background');

            let walletsWithBalances = [];

            for (let walletType of WalletContract.WALLET_TYPES_LIST) {
                let newWallet = await this.messenger.rpcCall('main_createWallet', [account.public, walletType], 'background');
                let balance = 0;
                try {
                    balance = await this.messenger.rpcCall('main_getWalletBalance', [newWallet], 'background');
                } catch (e) {
                }

                walletsWithBalances.push(`${walletType} - ${Utils.nFormatter(Utils.unsignedNumberToSigned(balance), 2)} ${currentNetwork.network.tokenIcon}`)
            }

            app.preloader.hideIn($('.userWalletHolder'));

            let walletType = await uiUtils.popupSelector([...walletsWithBalances, {
                text: _('Enter custom address'), onClick: async () => {
                    await enterWallet();
                }
            }], _('Wallet type'));

            if(!walletType) {
                return;
            }

            //Parse wallet type
            walletType = walletType.split(' - ')[0];


            let newWallet = await this.messenger.rpcCall('main_createWallet', [account.public, walletType], 'background');

            console.log('NEW WALLET', newWallet);

            const walletObj = {
                address: newWallet,
                type: walletType,
                config: {},
            }

            app.preloader.showIn($('.userWalletHolder'));
            try {
                await this.messenger.rpcCall('main_setNetworkWallet', [account.public, currentNetwork.name, walletObj], 'background');

                await this.updateWalletWidget();
            } catch (e) {
                app.toast.create({
                    closeTimeout: 3000,
                    destroyOnClose: true,
                    text: LOCALIZATION._('Wallet change error')
                }).open();
                console.log('Wallet change error', e);
            }
            app.preloader.hideIn($('.userWalletHolder'));


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
                    app.dialog.alert(_(`The balance of the current wallet is empty. To create a wallet contract, you need to top up the balance by at least 1 TON`));
                    await this.updateWalletWidget();
                    return;
                }

                try {
                    await this.messenger.rpcCall('main_deployWallet', [account.public, wallet.type], 'background');
                } catch (e) {
                    app.dialog.alert(_('Wallet deploy error') + ':' + e.message);
                }

                await this.updateWalletWidget();

                app.toast.create({closeTimeout: 3000, destroyOnClose: true, text: _('Wallet deployed')}).open();

            }

        });

        setInterval(async () => {
            await this.updateWalletWidget();

        }, UPDATE_INTERVAL)


        setInterval(async () => {
            await this.updateActiveActionsWidget();

            $('.autoClipboard:not(.action-hooked)').click(uiUtils.selfCopyElement()).addClass('action-hooked');
            $('.externalHref:not(.action-hooked)').click(function () {
                window.open($(this).attr('href'));
            }).addClass('action-hooked');

        }, 1000)

        //Set global methods
        window.updateWalletWidget = async () => {
            return await this.updateWalletWidget();
        }


    }

    /**
     * Update active actions widget
     * @returns {Promise<void>}
     */
    async updateActiveActionsWidget() {
        let activeActions = await this.messenger.rpcCall('main_getActiveActions', undefined, 'background');

        if(activeActions.length !== 0) {
            app.progressbar.show('multi')
        } else {
            app.progressbar.hide();
        }
    }

    /**
     * Update wallet widget view
     * @returns {Promise<void>}
     */
    async updateWalletWidget() {


        let currentNetwork = await this.messenger.rpcCall('main_getNetwork', undefined, 'background');
        let account = await this.messenger.rpcCall('main_getAccount', undefined, 'background');

        console.log('CURRENT NETWORK', currentNetwork)

        if(currentNetwork.network.faucet) {
            if(currentNetwork.network.faucet.type === 'url') {
                $('.getMoneyButton').show();
                $('.getMoneyButton').off('click');
                $('.getMoneyButton').click(function () {
                    window.open(currentNetwork.network.faucet.address);
                });
            }

        } else {
            $('.getMoneyButton').hide();
        }

        //console.log(account);
        if(this.lastNetwork !== currentNetwork.name) {
            this.lastNetwork = currentNetwork.name;
            $('.walletTokenIcon').html(currentNetwork.network.tokenIcon);
        }

        //console.log(account.wallets[currentNetwork.name], currentNetwork.name);

        if(account.wallets[currentNetwork.name]) {
            let wallet = account.wallets[currentNetwork.name];
            this.wallet = wallet;
            $('.walletAddress').html(`<a data-clipboard="${wallet.address}" class="autoClipboard" title="${wallet.type}"><i class="material-icons buttonIcon">content_copy</i>${Utils.shortenPubkey(wallet.address)}</a>`)

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
            $('.ifWalletNotDeployed').show();
        }


        await this.updateAssetsList(this.wallet?.address);

        await this.updateHistoryList();


    }

    /**
     * Prompt wallet address
     * @returns {Promise<unknown>}
     */
    promptWalletAddress() {
        return new Promise((resolve, reject) => {
            app.dialog.prompt(_(`Enter wallet address:`), _('Entering address'), (address) => {
                resolve(address)
            }, reject);
        })
    }

    /**
     * Update wallet history list
     * @returns {Promise<void>}
     */
    async updateHistoryList() {

        app.preloader.showIn($('.historyList'));
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
                                        <div class="item-after">${story.value === null ? _('ext') : Utils.unsignedNumberToSigned(story.value)}</div>
                                    </div>
                                </a>
                             </li>`
                }


                html += ` <li>
                                <a href="https://${currentNetwork.network.explorer}/accounts/accountDetails?id=${wallet.address}" class="item-link item-content externalHref" target="_blank">
                                    <div class="item-media"><i class="material-icons">visibility</i></div>
                                    <div class="item-inner">
                                        <div class="item-title">${_('View all in explorer')}</div>
                                        <div class="item-after"></div>
                                    </div>
                                </a>
                             </li>`

                html += `</ul>`;

                $('.historyList').html(html);

                app.preloader.hideIn($('.historyList'));

                $('.externalHref').click(function () {
                    window.open($(this).attr('href'));
                })
            } catch (e) {

                $('.historyList').html(`<div class="block block-strong text-align-center">
                        ${_('Empty')}
                           <a class="button externalHref" href="https://${currentNetwork.network.explorer}/accounts/accountDetails?id=${wallet.address}" target="_blank">View in explorer</a>
                    </div>`);

            }
        } else {
            $('.historyList').html(`<div class="block block-strong text-align-center">${_('Empty')}</div>`);
        }
    }

    /**
     * Update UI assets list
     * @returns {Promise<void>}
     */
    async updateAssetsList(userWalletAddress) {

        app.preloader.showIn($('.assetsList'));

        const that = this;
        let currentNetwork = await this.messenger.rpcCall('main_getNetwork', undefined, 'background');
        let account = await this.messenger.rpcCall('main_getAccount', undefined, 'background');

        let tokens = await this.messenger.rpcCall('main_getAccountTokens', [account.public, currentNetwork.name], 'background');

        let html = `<ul>`;

        let tokenBalancesPromises = [];
        let tokenBalances = {};

        for (let tokenAddress of Object.keys(tokens)) {
            tokenBalancesPromises.push((async () => {
                try {
                    let balance = await this.messenger.rpcCall('main_getTokenBalance', [tokenAddress, account.public, userWalletAddress], 'background');
                    tokenBalances[tokenAddress] = balance;
                } catch (e) {
                    tokenBalances[tokenAddress] = null;
                }
            })())
        }

        await Promise.all(tokenBalancesPromises);


        for (let tokenAddress of Object.keys(tokens)) {

            let tokenInfo = tokens[tokenAddress];
            let tokenBalance = tokenBalances[tokenAddress];

            console.log(tokenInfo);

            html += ` <li>
                        <a href="#" data-address="${tokenAddress}" class="item-link item-content tokenButton">
                            <div class="item-media">${tokenInfo.icon ? tokenInfo.icon : ''}${tokenInfo.deprecated ? '<span style="color: white;background: red;position: absolute;left: 0;z-index: 10000;font-size: 7px;/* top: 10px; */border-radius: 5px;opacity: 80%;padding: 2px;">OLD</span>' : ''}</div>
                            <div class="item-inner">
                                <div class="item-title">  ${tokenInfo.name} (${tokenInfo.symbol})</div>
                                <div class="item-after">${tokenInfo.fungible ? (tokenBalance !== null ? Utils.nFormatter(Utils.unsignedNumberToSigned(tokenBalance, tokenInfo.decimals), 1) : 'Not deployed') : 'NFT'}</div>
                            </div>
                        </a>
                    </li>`;
        }


        html += ` <li>
                    <a href="#" class="item-link item-content addTokenToAccount">
                        <div class="item-media"><i class="material-icons">add</i></div>
                        <div class="item-inner">
                            <div class="item-title">${_('Add token')}</div>
                            <div class="item-after"></div>
                        </div>
                    </a>
                 </li>`

        html += '</ul>';

        $('.assetsList').html(html);

        app.preloader.hideIn($('.assetsList'));

        $('.addTokenToAccount').click(async () => {
            let tokenClickList = [];

            async function addTokenToAccount(rootTokenAddress) {
                try {
                    await that.messenger.rpcCall('main_addAccountToken', [account.public, rootTokenAddress, currentNetwork.name], 'background');
                } catch (e) {
                    console.log(e);
                    app.toast.create({closeTimeout: 3000, destroyOnClose: true, text: _('Token adding error')}).open();
                }

                await that.updateAssetsList(that.wallet?.address);

            }

            let tokenList = TOKEN_LIST.TIP3_FUNGIBLE;
            try {
                let externalList = await (new TonSwapTokenList(null, null)).load();
                tokenList = await externalList.getTokensInWalletFormat(tokenList);
            } catch (e) {
                console.log('Error loading external tokens', e)
            }


            for (let token of tokenList) {
                tokenClickList.push({
                    text: `
                            <div style="width: 100%">
                                <div style="width: 5%;    display: inline-block;">${token.icon}</div>
                                <div style="width: 70%; text-align: center;     display: inline-block;">${token.name}</div>
                                <div style="width: 25%;text-align: left; opacity: 60%; display: inline-block;">${token.symbol}</div>
                            </div>
                            `, onClick: async () => {
                        await addTokenToAccount(token.rootAddress);
                    }
                });
            }

            let addToken = await uiUtils.popupSelector([...tokenClickList,
                {
                    text: _('Enter custom token address'),
                    onClick: async () => {

                        app.dialog.prompt(_(`Enter root token address:`), _('Entering address'), async (rootTokenAddress) => {
                            let tokenInfo = await this.messenger.rpcCall('main_getTokenInfo', [rootTokenAddress], 'background');

                            console.log('TOKEN INFO', tokenInfo);

                            await addTokenToAccount(rootTokenAddress);
                        });


                    }
                },
                /*{
                    text: _('Create TIP3 token'),
                    onClick: async () => {

                        await popups.tip3Constructor();


                    }
                }*/
            ], _('Select token'));
        });

        $('.tokenButton').click(async function () {
            let tokenAddress = $(this).data('address');
            let account = await that.messenger.rpcCall('main_getAccount', undefined, 'background');
            if(account.wallets[currentNetwork.name]) {
                let wallet = account.wallets[currentNetwork.name];
                await popups.tokenWallet(tokenAddress, account.public, that.messenger, wallet.address);
            } else {

            }
        })
    }
}

export default function (messenger, app,) {
    return new walletWidget(messenger, app,);
}