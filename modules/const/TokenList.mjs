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
            name: 'Test',
            symbol: 'TT',
            rootAddress: '0:0c4cad39cf61d92df6ab7c78552441b0524973e282f1e7a6acf5f06773cdc605',
            icon: '<img src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2ecB13A8c458c379c4d9a7259e202De03c8F3D19/logo.png" class="tokenIcon">',
            url: '',
        },
        {
            classType: 'BroxusTIP3',
            name: 'Wrapped Ruby',
            symbol: 'WRUBY',
            rootAddress: '0:e5863ff972464c4200dba9ed764d3a57533adb2bd4e88b9230859d1953b4b1d4',
            icon: '<span style="color: red">♦️</span>',
            url: '',
        },
    ]
};

export default TOKEN_LIST;