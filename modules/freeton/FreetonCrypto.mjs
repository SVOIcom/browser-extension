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

    /**
     * Create SEED phrase
     * @param dict
     * @param length
     * @returns {Promise<*>}
     */
    static async generateSeed(dict = MNEMONIC_DICTIONARY.ENGLISH, length = SEED_LENGTH.w12) {
        const ton = await FreetonInstance.getFreeTON();
        return await ton.crypto.mnemonicFromRandom({dictionary: dict, wordCount: length});
    }

    /**
     * Seed phrase or private key to keypair
     * @param seed
     * @param dict
     * @param length
     * @returns {Promise<*>}
     */
    static async seedOrPrivateToKeypair(seed, dict = MNEMONIC_DICTIONARY.ENGLISH, length = SEED_LENGTH.w12) {
        const ton = await FreetonInstance.getFreeTON();
        //Is a private key
        if(seed.length === 64) {
            return await ton.crypto.naclBoxKeypairFromSecretKey(seed);
        }
        return await ton.crypto.mnemonicDeriveSignKeys({
            dictionary: dict,
            wordCount: length,
            phrase: seed,
            path: HD_PATH
        });
    }

}

export default FreetonCrypto;