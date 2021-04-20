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

import FreetonInstance from "./FreetonInstance.mjs";
export const MNEMONIC_DICTIONARY = {
    TON: 0,
    ENGLISH: 1,
    CHINESE_SIMPLIFIED: 2,
    CHINESE_TRADITIONAL: 3,
    FRENCH: 4,
    ITALIAN: 5,
    JAPANESE: 6,
    KOREAN: 7,
    SPANISH: 8,
};

export const SEED_LENGTH = {
    w12: 12,
    w24: 24
}

export const HD_PATH = "m/44'/396'/0'/0/0";

class FreetonCrypto {

    static async generateSeed(dict = MNEMONIC_DICTIONARY.ENGLISH, length = SEED_LENGTH.w12) {
        const ton = await FreetonInstance.getFreeTON();
        return await ton.crypto.mnemonicFromRandom({dictionary: dict, wordCount: length});
    }

    static async seedToKeypair(seed, dict = MNEMONIC_DICTIONARY.ENGLISH, length = SEED_LENGTH.w12) {
        const ton = await FreetonInstance.getFreeTON();
        return await ton.crypto.mnemonicDeriveSignKeys({
            dictionary: dict,
            wordCount: length,
            phrase: seed,
            path: HD_PATH
        });
    }

}

export default FreetonCrypto;