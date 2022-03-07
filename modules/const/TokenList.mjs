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
            name: 'Wrapped TON (OLD)',
            symbol: 'WTON',
            rootAddress: '0:0ee39330eddb680ce731cd6a443c71d9069db06d149a9bec9569d1eb8d04eb37',
            icon: '<img src="https://raw.githubusercontent.com/broxus/ton-assets/master/icons/WTONv3/logo.svg" class="tokenIcon">',
            url: '',
        },
        {
            classType: 'BroxusTIP3',
            name: 'Tether (OLD)',
            symbol: 'USDT',
            rootAddress: '0:751b6e22687891bdc1706c8d91bf77281237f7453d27dc3106c640ec165a2abf',
            icon: '<img src="https://raw.githubusercontent.com/broxus/ton-assets/master/icons/USDTv3/logo.svg" class="tokenIcon">',
            url: '',
        },
        {
            classType: 'BroxusTIP3',
            name: 'USD Coin (OLD)',
            symbol: 'USDC',
            rootAddress: '0:1ad0575f0f98f87a07ec505c39839cb9766c70a11dadbfc171f59b2818759819',
            icon: '<img src="https://raw.githubusercontent.com/broxus/ton-assets/master/icons/USDCv3/logo.svg" class="tokenIcon">',
            url: '',
        },
        {
            classType: 'BroxusTIP3',
            name: 'Dai Stablecoin (OLD)',
            symbol: 'DAI',
            rootAddress: '0:95934aa6a66cb3eb211a80e99234dfbba6329cfa31600ce3c2b070d8d9677cef',
            icon: '<img src="https://raw.githubusercontent.com/broxus/ton-assets/master/icons/DAIv3/logo.svg" class="tokenIcon">',
            url: '',
        },
        {
            classType: 'BroxusTIP3',
            name: 'Wrapped BTC (OLD)',
            symbol: 'WBTC',
            rootAddress: '0:6e76bccb41be2210dc9d7a4d0f3cbf0d5da592d0cb6b87662d5510f5b5efe497',
            icon: '<img src="https://raw.githubusercontent.com/broxus/ton-assets/master/icons/WBTCv3/logo.svg" class="tokenIcon">',
            url: '',
        },
        {
            classType: 'BroxusTIP3',
            name: 'Wrapped Ether (OLD)',
            symbol: 'WETH',
            rootAddress: '0:45f682b7e783283caef3f268e10073cf08842bce20041d5224c38d87df9f2e90',
            icon: '<img src="https://raw.githubusercontent.com/broxus/ton-assets/master/icons/WETHv3/logo.svg" class="tokenIcon">',
            url: '',
        },
        {
            classType: 'BroxusTIP3',
            name: 'TON Bridge (OLD)',
            symbol: 'BRIDGE',
            rootAddress: '0:a453e9973010fadd4895e0d37c1ad15cba97f4fd31ef17663343f79768f678d9',
            icon: '<img src="https://raw.githubusercontent.com/broxus/ton-assets/master/icons/BRIDGE/logo.svg" class="tokenIcon">',
            url: '',
        },
        {
            classType: 'BroxusTIP3',
            name: 'Cola Coin',
            symbol: 'COLA',
            rootAddress: '0:967c87a81c2ad6a489fe006f831a11ffd8ac5bc6f7dd4e107a27e0e6a7728144',
            icon: '🥤',
            url: 'https://scalepunks.com/',
        },
        {
            classType: 'BroxusTIP3_1',
            name: 'Whiskey',
            symbol: 'Whiskey',
            rootAddress: '0:d893fe68910b9d65446a7a4e8adb245e8c9bc5d981ced60a9dd1546dca9d6500',
            icon: '🥃',
            url: 'https://scalepunks.com/',
        },
    ]
};

export default TOKEN_LIST;