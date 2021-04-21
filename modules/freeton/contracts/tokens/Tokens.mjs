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

import BroxusTIP3 from "./tip3-fungible/broxus/BroxusTIP3.mjs";

class Tokens {
    TIP3_FUNGIBLE_TOKENS = {
        broxus: 'BroxusTIP3'
    };

    TIP3_NONFUNGIBLE_TOKENS = {};

    ERC20_TOKENS = {};

    ERC721_TOKENS = {};

    /**
     * Get all suppoerted tokens object
     * @returns {{erc20: {}, erc721: {}, tip3: {nonfungible: {}, fungible: {BroxusTIP3: BroxusTIP3}}}}
     */
    getTokens() {
        return {
            tip3:
                {
                    fungible:
                        {
                            BroxusTIP3: BroxusTIP3
                        },
                    nonfungible: {}
                },
            erc20: {},
            erc721: {}
        }
    }
}