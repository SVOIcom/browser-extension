/*_______ ____  _   _  _____
 |__   __/ __ \| \ | |/ ____|
    | | | |  | |  \| | (_____      ____ _ _ __
    | | | |  | | . ` |\___ \ \ /\ / / _` | '_ \
    | | | |__| | |\  |____) \ V  V / (_| | |_) |
    |_|  \____/|_| \_|_____/ \_/\_/ \__,_| .__/
                                         | |
                                         |_| */
import utils from "../utils.mjs";
//import TokenRootContract from "./contracts/TokenRootContract.mjs";

/**
 * @name TONSwap project - tonswap.com
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */

const TONSWAP_EXPLORERS_TOKEN_LIST = {
    main: 'https://swap-explorer.block-chain.com/api/tokens',
    test: 'https://explorer.tonswap.com/api/tokens'
}

class TonSwapTokenList {
    constructor(listUrl = '/json/tokensList.json', ton = null) {
        this.listUrl = listUrl;
        this.name = '';
        this.version = '';
        this.url = '';
        this.tokens = [];
        this.ton = ton;
    }

    /**
     * Load token list
     * @returns {Promise<TokensList>}
     */
    async load(network = 'main') {
        /*let listJSON = await ((await fetch(this.listUrl))).json();
        for (let key of Object.keys(listJSON)) {
            this[key] = listJSON[key];
        }*/

        let newTokens = [];

        for (let token of this.tokens) {
            if(token.network === network) {
                newTokens.push(token);
            }
        }

        let explorerTokens = await utils.fetchJSON(TONSWAP_EXPLORERS_TOKEN_LIST[network]);

        for (let token of explorerTokens) {
            token.rootAddress = token.tokenRoot;
            token.icon = token.tokenIcon;
            token.symbol = token.ticker;
        }

        console.log(explorerTokens);

        this.tokens = [...newTokens, ...explorerTokens];


        return this;
    }

    /**
     * Get full tokenlist
     * @returns {Promise<[]>}
     */
    async getTokens() {
        return this.tokens;
    }

    async getTokensInWalletFormat(baseTokenList) {
        let formattedTokens = [];

        let usedAddresses = {};

        for (let token of await this.getTokens()) {
            formattedTokens.push({
                classType: "BroxusTIP3",
                name: token.name,
                symbol: token.symbol,
                decimals: token.decimals,
                icon: `<img src="${token.icon}" class="tokenIcon">`,
                rootAddress: token.rootAddress,
                //network: token.network,
            });

            usedAddresses[token.rootAddress] = true;
        }

        for (let token of baseTokenList) {
            if(!usedAddresses[token.rootAddress]) {
                formattedTokens.push(token);
            }
        }

        return formattedTokens;
    }

    /**
     * Get token by root address
     * @param {string} rootAddress
     * @returns {Promise<*>}
     */
    async getTokenByRootAddress(rootAddress) {
        for (let token of this.tokens) {
            if(token.rootAddress === rootAddress) {
                return token;
            }
        }

        //If no token in list, get info from blockchain
        /*
                const senderToken = await new TokenRootContract(this.ton, null).init(rootAddress);
                const tokenInfo = await senderToken.getDetails();
                return {
                    "rootAddress": rootAddress,
                    "name": utils.hex2String(tokenInfo.name),
                    "symbol": utils.hex2String(tokenInfo.symbol),
                    "decimals": Number(tokenInfo.decimals),
                    "icon": ""
                };

        */
    }
}

export default TonSwapTokenList;