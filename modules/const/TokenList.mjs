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
        {
            classType: 'BroxusTIP3',
            name: 'USD Coin',
            symbol: 'USDC',
            rootAddress: '0:4a2c894ef8780735ae52bf8caf82d214477ceea494ad547a6832bf695d230ed1',
            icon: '<img src="https://raw.githubusercontent.com/broxus/ton-assets/master/icons/USDCv3/logo.svg" class="tokenIcon">',
            url: '',
        },
        {
            classType: 'BroxusTIP3',
            name: 'Dai Stablecoin',
            symbol: 'DAI',
            rootAddress: '0:31540aa0100da4b7f6cfb47ff987be4910b27ce1b5cf228fddce82cb4bf4f518',
            icon: '<img src="https://raw.githubusercontent.com/broxus/ton-assets/master/icons/DAIv3/logo.svg" class="tokenIcon">',
            url: '',
        },
        {
            classType: 'BroxusTIP3',
            name: 'Wrapped BTC',
            symbol: 'WBTC',
            rootAddress: '0:382c14808ed11f735410d67407802dff46b74f935b89b65649e1841ab09fd8b4',
            icon: '<img src="https://raw.githubusercontent.com/broxus/ton-assets/master/icons/WBTCv3/logo.svg" class="tokenIcon">',
            url: '',
        },
        {
            classType: 'BroxusTIP3',
            name: 'Wrapped Ether',
            symbol: 'WETH',
            rootAddress: '0:9ca758fb99002a61d22c594fa2db6f0e1d8934580815565057be47f94a8e7325',
            icon: '<img src="https://raw.githubusercontent.com/broxus/ton-assets/master/icons/WETHv3/logo.svg" class="tokenIcon">',
            url: '',
        },
    ]
};

export default TOKEN_LIST;