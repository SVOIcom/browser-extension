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
        url: 'main2.ton.dev',
        explorer: 'ton.live',
        description: 'FreeTON main net',
        site: 'https://freeton.org/',
        faucet: {
            type: 'url',
            address: 'https://freeton.com/en/buy/',
        },
        tokenIcon: '<img src="pictures/gif/crystal.gif" class="walletIconImage" style="width: 15px; height: 15px; display: inline">'
        //tokenIcon: '💎'
        //tokenIcon: '<tgs-player autoplay loop renderer="canvas"  mode="normal" src="pictures/tgs/crystal.tgs" style="width: 15px; height: 15px; display: inline"></tgs-player>'
    },
    devnet: {
        url: 'net1.ton.dev',
        explorer: 'net.ton.live',
        description: 'FreeTON test network',
        site: 'https://freeton.org/',
        tokenIcon: '<span style="color: red">♦️</span>',
        faucet: {
            type: 'url',
            address: 'https://faucet.extraton.io/',
        },
    }
}

export default NETWORKS;