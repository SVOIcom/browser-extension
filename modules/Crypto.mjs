/**
 * @name ScaleWallet - Everscale browser wallet and injector
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */


const JsonFormatter = {
    stringify: function (cipherParams) {
        // create json object with ciphertext
        let jsonObj = {ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64)};

        // optionally add iv or salt
        if(cipherParams.iv) {
            jsonObj.iv = cipherParams.iv.toString();
        }

        if(cipherParams.salt) {
            jsonObj.s = cipherParams.salt.toString();
        }

        // stringify json object
        return JSON.stringify(jsonObj);
    },
    parse: function (jsonStr) {
        // parse json string
        let jsonObj = JSON.parse(jsonStr);

        // extract ciphertext from json object, and create cipher params object
        let cipherParams = CryptoJS.lib.CipherParams.create({
            ciphertext: CryptoJS.enc.Base64.parse(jsonObj.ct)
        });

        // optionally extract iv or salt

        if(jsonObj.iv) {
            cipherParams.iv = CryptoJS.enc.Hex.parse(jsonObj.iv);
        }

        if(jsonObj.s) {
            cipherParams.salt = CryptoJS.enc.Hex.parse(jsonObj.s);
        }

        return cipherParams;
    }
};

/**
 * Crypto module based on CryptoJS
 */
class Crypto {
    constructor() {

    }

    async encrypt(text, key) {
        return CryptoJS.AES.encrypt(text, key, {
            format: JsonFormatter
        });
    }

    async decrypt(endryptedData, key) {
        return CryptoJS.AES.decrypt(endryptedData, key, {
            format: JsonFormatter
        }).toString(CryptoJS.enc.Utf8);
    }
}

export {Crypto as default};