const Utils = {
    /**
     * Simple promised timeout
     * @param timeout
     * @returns {Promise<unknown>}
     */
    wait: (timeout = 500) => {
        return new Promise(resolve => {
            setTimeout(resolve, timeout)
        })
    },
    appBack: () => {
        app.views.main.router.back();
    },
    shortenPubkey: (pubkey, delimiter = '...') => {
        pubkey = String(pubkey);
        return pubkey.substr(0, 6) + delimiter + pubkey.substr(-4);
    },
    /**
     * Transfer hack ABI
     */
    TRANSFER_BODY: {
        "ABI version": 2,
        "functions": [
            {
                "name": "transfer",
                "id": "0x00000000",
                "inputs": [
                    {
                        "name": "pubkey",
                        "type": "uint256"
                    }
                ],
                "outputs": []
            }
        ],
        "events": [],
        "data": []
    },

    /**
     * Big hex string to big dec string
     * @param {string} s
     * @returns {string}
     */
    hexString2DecString(s) {

        function add(x, y) {
            let c = 0, r = [];
            x = x.split('').map(Number);
            y = y.split('').map(Number);
            while (x.length || y.length) {
                let s = (x.pop() || 0) + (y.pop() || 0) + c;
                r.unshift(s < 10 ? s : s - 10);
                c = s < 10 ? 0 : 1;
            }
            if(c) {
                r.unshift(c);
            }
            return r.join('');
        }

        let dec = '0';
        s.split('').forEach(function (chr) {
            let n = parseInt(chr, 16);
            for (let t = 8; t; t >>= 1) {
                dec = add(dec, dec);
                if(n & t) {
                    dec = add(dec, '1');
                }
            }
        });
        return dec;
    },
    /**
     * Show token
     * @param {number|string} amount
     * @param {number} precision
     * @returns {string}
     */
    showToken(amount, precision = 9) {
        amount = Number(amount);
        if(!amount) {
            return '0';
        }

        return String(amount.toFixed(precision));
    },
    /**
     * Js number to raw unsigned number
     * @param num
     * @param decimals
     * @returns {number}
     */
    numberToUnsignedNumber(num, decimals = 9) {
        return Number(Number(num).toFixed(decimals).replace('.', ''))
    },
    /**
     * Raw unsigned number to js number
     * @param num
     * @param decimals
     * @returns {number}
     */
    unsignedNumberToSigned(num, decimals = 9) {
        return Number(Number(Number(num) / Math.pow(10, decimals)).toFixed(9));
    },
    /**
     * Big number to big string
     * @param number
     * @returns {string}
     */
    bigNumberToString(number) {
        return Number(number).toLocaleString('en').replace(/,/g, '');
    },
    /**
     * Extract transaction id
     * @param tx
     * @returns {null|*}
     */
    getTxId(tx) {
        if(tx.txid) {
            return tx.txid;
        }

        if(tx.transaction) {
            if(tx.transaction.id) {
                return tx.transaction.id
            }
        }

        if(tx.tx) {
            if(tx.tx.lastBlockId) {
                return tx.tx.lastBlockId
            }

        }


    },
    /**
     * Hex string to base64 string
     * @param hexstring
     * @returns {string}
     */
    hexToBase64(hexstring) {
        return btoa(hexstring.match(/\w{2}/g).map(function (a) {
            return String.fromCharCode(parseInt(a, 16));
        }).join(""));
    },


    /**
     * Create tvm cell payload with public key
     * @param pubkey
     * @returns {string}
     */
    createPubkeyTVMCELL(pubkey) {
        let data = 'b5ee9c720101010100' + '22000040' + pubkey;
        return this.hexToBase64(data);
    }
};

export default Utils;