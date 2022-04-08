/**
 * @name ScaleWallet - Everscale browser wallet and injector
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */

import BroxusTIP3 from "./tip3-fungible/broxus/BroxusTIP3.mjs";
import BroxusTIP3_1 from "./tip3_1-fungible/broxus/BroxusTIP3_1.mjs";

class Tokens {
    static  TIP3_FUNGIBLE_TOKENS = {
        broxus: 'BroxusTIP3',
        tip31: 'BroxusTIP3_1',
    };

    static  TIP3_NONFUNGIBLE_TOKENS = {};

    static   ERC20_TOKENS = {};

    static  ERC721_TOKENS = {};

    static TOKEN_TYPE = {
        TIP3_FUNGIBLE_TOKENS: this.TIP3_FUNGIBLE_TOKENS,
        TIP3_NONFUNGIBLE_TOKENS: this.TIP3_NONFUNGIBLE_TOKENS,
        ERC20_TOKENS: this.ERC20_TOKENS,

    }

    /**
     * Get all suppoerted tokens object
     * @returns {{erc20: {}, erc721: {}, tip3: {nonfungible: {}, fungible: {BroxusTIP3: BroxusTIP3}}}}
     */
    static getTokens() {
        return {
            tip3:
                {
                    fungible:
                        {
                            BroxusTIP3: BroxusTIP3,
                            BroxusTIP3_1: BroxusTIP3_1
                        },
                    nonfungible: {}
                },
            erc20: {},
            erc721: {}
        }
    }

    /**
     * Get token contract by type
     * @param {string} tokenType
     * @returns {null|BroxusTIP3}
     */
    static getTokenContract(tokenType) {
        switch (tokenType) {
            case 'BroxusTIP3':
                return BroxusTIP3;
            case 'BroxusTIP3_1':
                return BroxusTIP3_1;
            default:
                return null;
        }
    }
}

export default Tokens;