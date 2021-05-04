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

const NETWORKS = {
    main: {
        url: 'main.ton.dev',
        explorer: 'ton.live',
        description: 'FreeTON main net',
        site: 'https://freeton.org/',
        faucet: {
            type: 'url',
            address: 'https://t.me/Chatex_bot?start=r_509',
        },
        tokenIcon: '💎'
    },
    devnet: {
        url: 'net.ton.dev',
        explorer: 'net.ton.live',
        description: 'FreeTON test network',
        site: 'https://freeton.org/',
        tokenIcon: '<span style="color: red">♦️</span>',
        faucet: null
    }
}

export default NETWORKS;