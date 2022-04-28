/**
 * @name ScaleWallet - Everscale browser wallet and injector
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */
import Utils from "../utils.mjs";

const NETWORKS = {
    main: {
        urls: Utils.packNetworks(['main3.ton.dev', "eri01.main.everos.dev", "gra01.main.everos.dev", "gra02.main.everos.dev", "lim01.main.everos.dev", "rbx01.main.everos.dev", 'alwaysonlineevermainnode.svoi.dev']),
        url: 'main3.ton.dev', //Deprecated. Placed here for backward compatibility
        explorer: 'ever.live',
        description: 'Everscale main network',
        site: 'https://everscale.network/',
        type: 'main',
        faucet: {
            type: 'url',
            address: 'https://everscale.network/ecosystem',
        },
        tokenIcon: '<img src="pictures/ever.png" class="walletIconImage" style="width: 15px; height: 15px; display: inline">'
        //tokenIcon: '💎'
        //tokenIcon: '<tgs-player autoplay loop renderer="canvas"  mode="normal" src="pictures/tgs/crystal.tgs" style="width: 15px; height: 15px; display: inline"></tgs-player>'
    },
    mainOld: {
        url: 'main3.ton.dev',
        explorer: 'ever.live',
        description: 'DEPRECATED. For old sites only',
        site: 'https://everscale.network/',
        type: 'main',
        faucet: {
            type: 'url',
            address: 'https://everscale.network/ecosystem',
        },
        tokenIcon: '<img src="pictures/ever.png" class="walletIconImage" style="width: 15px; height: 15px; display: inline">'
    },
    svoidev: {
        url: 'alwaysonlineevermainnode.svoi.dev',
        explorer: 'ever.live',
        description: 'SVOI.dev Everscale mainnet node',
        site: 'https://everscale.network/',
        type: 'main',
        faucet: {
            type: 'url',
            address: 'https://everscale.network/ecosystem',
        },
        tokenIcon: '<img src="pictures/ever.png" class="walletIconImage" style="width: 15px; height: 15px; display: inline">'
        //tokenIcon: '💎'
        //tokenIcon: '<tgs-player autoplay loop renderer="canvas"  mode="normal" src="pictures/tgs/crystal.tgs" style="width: 15px; height: 15px; display: inline"></tgs-player>'
    },
    devnet: {
        urls: Utils.packNetworks(['net1.ton.dev', 'net2.ton.dev', 'eri01.net.everos.dev','rbx01.net.everos.dev','gra01.net.everos.dev']),
        explorer: 'net.ever.live',
        description: 'Everscale devnet',
        site: 'https://everscale.network/',
        type: 'dev',
        tokenIcon: '<span style="color: red">♦️</span>',
        faucet: {
            type: 'url',
            address: 'https://faucet.extraton.io/',
        },
    }
}

export default NETWORKS;