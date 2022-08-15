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

const BROXUS_TOKEN_LIST = 'https://raw.githubusercontent.com/SVOIcom/ton-assets/master/manifest.json';

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

        let explorerTokens = [];

        for (let token of explorerTokens) {
            token.rootAddress = token.tokenRoot;
            token.icon = token.tokenIcon;
            token.symbol = token.ticker;
        }

        let processedExplorerTokens = [];

        for (let rawToken of explorerTokens) {
            if(await this.tokenExists(rawToken.tokenRoot)) {
                continue;
            }

            rawToken.name = rawToken.name + ' (OLD)';
            rawToken.deprecated = true;
            processedExplorerTokens.push(rawToken);
        }

        console.log(explorerTokens);

        this.tokens = [...newTokens, ...processedExplorerTokens];

        //Load Broxus list
        try {
            let broxusFile = await utils.fetchJSON(BROXUS_TOKEN_LIST);
            let tokens = broxusFile.tokens;
            let processedTokens = [];
            for (let rawToken of tokens) {
                if(await this.tokenExists(rawToken.address)) {
                    continue;
                }
                let token = {
                    rootAddress: rawToken.address,
                    tokenRoot: rawToken.address,
                    decimals: rawToken.decimals,
                    icon: rawToken.logoURI ? `<img src="${rawToken.logoURI}" class="tokenIcon">` : null,
                    tokenIcon: rawToken.logoURI ? `<img src="${rawToken.logoURI}" class="tokenIcon">` : null,
                    symbol: rawToken.symbol,
                    name: rawToken.name,
                    deprecated: false,
                    _version: rawToken.version
                    //We can identify other fields from the root address
                };
                processedTokens.push(token);
            }
            this.tokens = [...this.tokens, ...processedTokens];


        } catch (e) {
            console.log('Error loading Broxus list', e);
        }


        this.tokens.sort((a, b) => {
            return a.name.localeCompare(b.name)
        });


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
            //console.log(token.icon)
            formattedTokens.push({
                classType: "BroxusTIP3",
                name: token.name,
                symbol: token.symbol,
                decimals: token.decimals,
                icon: typeof token.icon === 'string' ? (token.icon.includes('tokenIcon') ? token.icon : `<img src="${token.icon}" class="tokenIcon">`) : '',
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

    async tokenExists(rootAddress) {
        for (let token of this.tokens) {
            if(token.rootAddress === rootAddress) {
                return true;
            }
        }

        return false;
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