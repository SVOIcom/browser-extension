/**
 * @name ScaleWallet - Everscale browser wallet and injector
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */
let window = self;

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

        window.ton = ton;
        window.test = {
            dictionary: dict,
            wordCount: length,
            phrase: seed,
            path: HD_PATH
        };



        //Is a private key
        if(seed.length === 64) {
            return await ton.crypto.nacl_box_keypair_from_secret_key(seed);
        }

        //TODO Даня делает регулярку
        if(seed.split(' ').length === 24) {
            length = SEED_LENGTH.w24;
        }

        for (let dictKey in MNEMONIC_DICTIONARY) {
            dict = MNEMONIC_DICTIONARY[dictKey];
            try {
                return await ton.crypto.mnemonic_derive_sign_keys({
                    dictionary: dict,
                    wordCount: length,
                    phrase: seed,
                    path: HD_PATH
                });
            } catch (e) {

            }

        }
        throw new Error('Invalid seed phrase or private key')

    }

}

export default FreetonCrypto;