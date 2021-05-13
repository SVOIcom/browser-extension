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

const TOKEN_LIST = {
    TIP3_FUNGIBLE: [
        {
            classType: 'BroxusTIP3',
            name: 'Wrapped TON',
            symbol: 'WTON',
            rootAddress: '0:eed3f331634d49a5da2b546f4652dd4889487a187c2ef9dd2203cff17b584e3d',
            icon: '<img src="https://raw.githubusercontent.com/broxus/ton-assets/master/icons/WTONv3/logo.svg" class="tokenIcon">',
            url: '',
        },
        {
            classType: 'BroxusTIP3',
            name: 'Tether',
            symbol: 'USDT',
            rootAddress: '0:5b325f4f364366d9b3fe46cc77f622b013da7a7edf99a3d5d25e5510dca50d13',
            icon: '<img src="https://raw.githubusercontent.com/broxus/ton-assets/master/icons/USDTv3/logo.svg" class="tokenIcon">',
            url: '',
        },
    ]
};

export default TOKEN_LIST;