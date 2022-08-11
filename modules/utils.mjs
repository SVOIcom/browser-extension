/*
  _____ ___  _   ___        __    _ _      _
 |_   _/ _ \| \ | \ \      / /_ _| | | ___| |_
   | || | | |  \| |\ \ /\ / / _` | | |/ _ \ __|
   | || |_| | |\  | \ V  V / (_| | | |  __/ |_
   |_| \___/|_| \_|  \_/\_/ \__,_|_|_|\___|\__|

 */
import FreetonInstance from "./freeton/FreetonInstance.mjs";

/**
 * @name FreeTON browser wallet and injector
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */


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
    appBack: (url = "", options = {}) => {
        app.views.main.router.back(url, options);
    },
    reloadPage: () => {
        app.views.main.router.reloadPage();
        app.views.main.router.clearPreviousHistory();
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
    TRANSFER_ABI: {
        "ABI version": 2,
        "functions": [
            {
                "name": "transfer",
                "id": "0x00000000",
                "inputs": [
                    {
                        "name": "comment",
                        "type": "bytes"
                    }
                ],
                "outputs": []
            }
        ],
        "events": [],
        "data": []
    },

    /**
     * Encode payload comment
     * @param comment
     * @returns {Promise<*>}
     */
    async encodePayloadComment(comment) {
        comment = Utils.string2Hex(comment);
        const ton = await FreetonInstance.getFreeTON();

        return (await ton.contracts.createRunBody({
            abi: Utils.TRANSFER_ABI,
            function: 'transfer',
            params: {comment},
            internal: true
        })).bodyBase64
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
        if(decimals === 0) {
            return BigNumber(num).toFixed(decimals);
        }
        return (BigNumber(num).toFixed(decimals).replace('.', ''))
    },
    /**
     * Raw unsigned number to js number
     * @param num
     * @param decimals
     * @returns {number}
     */
    unsignedNumberToSigned(num, decimals = 9) {
        if(decimals === 0) {
            return BigNumber(num).toFixed(decimals);
        }
        return BigNumber(num).div(Math.pow(10, decimals)).toFixed(decimals);
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
     * Base64 string to hex string
     * @param str
     * @returns {string}
     */
    base64ToHex(str) {
        const raw = atob(str);
        let result = '';
        for (let i = 0; i < raw.length; i++) {
            const hex = raw.charCodeAt(i).toString(16);
            result += (hex.length === 2 ? hex : '0' + hex);
        }
        return result.toLowerCase();
    },

//console.log(base64ToHex("oAAABTUAAg=="));


    /**
     * Create tvm cell payload with public key
     * @param {string} pubkey
     * @returns {string}
     */
    createPubkeyTVMCELL(pubkey) {
        let data = 'b5ee9c720101010100' + '22000040' + pubkey;
        return this.hexToBase64(data);
    },

    fetchLocal(url) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest
            xhr.onload = function () {
                resolve(new Response(xhr.response, {status: xhr.status}))
            }
            xhr.onerror = function () {
                reject(new TypeError('Local request failed'))
            }
            xhr.open('GET', url)
            xhr.responseType = "arraybuffer";
            xhr.send(null)
        })
    },

    /**
     * Get JSON file
     * @param {string} url
     * @param {boolean} local
     * @returns {Promise<any>}
     */
    /* async fetchJSON(url, local = false) {
         if(url.includes('file:') || local) {
             if(!url.includes('file:') && window._isApp) {
                 url = 'file:///android_asset/www' + url;
             }
             return await (await this.fetchLocal(url)).json();
         }
         return await ((await fetch(url))).json();
     },*/
    async fetchJSON(url) {
        return await ((await fetch(url))).json();
    },

    /**
     * Check TON address
     * @param {string} address
     * @returns {boolean}
     */
    validateTONAddress(address) {
        const regex = /^-?[0-9a-fA-F]?[0-9a-fA-F]:[a-fA-F0-9]{64}$/gm;

        return (regex.exec(address)) !== null;
    },

    /**
     * Hex encoded string to string
     * @param {string} hexString
     * @returns {string}
     */
    hex2String(hexString) {
        return Buffer.from(hexString, 'hex').toString();
    },

    /**
     * String to hex string
     * @param {string} str
     * @returns {string}
     */
    string2Hex(str) {
        return Buffer.from(str, 'utf8').toString('hex');
    },

    /**
     * Async JSONP
     * @async
     * @param url
     * @param callback
     * @returns {Promise<unknown>}
     */
    jsonp(url, callback = "jsonpCallback_" + String(Math.round(Math.random() * 100000))) {
        return new Promise((resolve, reject) => {
            try {
                let script = document.createElement("script");

                window[callback] = function (data) {
                    window[callback] = undefined;
                    resolve(data);
                };

                let urlNew = new URL(url);

                urlNew.searchParams.append("callback", callback);

                script.src = String(urlNew);
                document.body.appendChild(script);
            } catch (e) {
                reject(e);
            }
        });
    },
    nFormatter(num, digits) {
        if(num < 1) {
            return Number(num).toFixed(digits);
        }
        const lookup = [
            {value: 1, symbol: ""},
            {value: 1e3, symbol: "k"},
            {value: 1e6, symbol: "M"},
            {value: 1e9, symbol: "G"},
            {value: 1e12, symbol: "T"},
            {value: 1e15, symbol: "P"},
            {value: 1e18, symbol: "E"}
        ];
        const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        let item = lookup.slice().reverse().find(function (item) {
            return num >= item.value;
        });
        return item ? (this.floatToFixedFloor((num / item.value), digits)).replace(rx, "$1") + item.symbol : "0";
    },
    floatToFixedFloor(num, fixed) {
        fixed = fixed || 0;
        fixed = Math.pow(10, fixed);
        return String(Math.floor(num * fixed) / fixed);
    },

    /**
     * Check is valid domain
     * @param str
     * @returns {boolean}
     */
    isValidDomain(str) {
        return /^(((?!\-))(xn\-\-)?[a-z0-9\-_]{0,61}[a-z0-9]{1,1}\.)*(xn\-\-)?([a-z0-9\-]{1,61}|[a-z0-9\-]{1,30})\.[a-z]{2,}$/.test(str);

    },

    /**
     * Generate random string with custom length
     */
    generateRandomString(length) {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    },
    /**
     * Pack networks list
     * @param networks
     * @returns {*}
     */
    packNetworks(networks) {
        networks = networks.sort();
        return networks.join('|');
    },
    /**
     * Unpack networks list
     * @param networks
     * @returns {*}
     */
    unpackNetworks(networks) {
        let networksArray = networks.split('|');
        return networksArray.map(network => {
            return network.toLowerCase().trim();
        });
    },
    fixZeroes(str) {
        str = String(str);
        if(!str.includes('.')) {
            return str;
        }

        str = str.replace(/0*$/g, '');

        if(str.substr(-1) === '.') {
            str = str.substr(0, str.length - 1);
        }
        return str;
    },
};

window._utils = Utils;

export default Utils;