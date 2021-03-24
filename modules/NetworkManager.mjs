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

import LocalStorage from "./LocalStorage.mjs";
import NETWORKS from "./const/Networks.mjs";
import EXCEPTIONS from "./const/Exceptions.mjs";


class NetworkManager extends EventEmitter3 {

    EVENTS = {
        networkChanged: 'networkChanged'
    }

    constructor() {
        super();
        this.storage = new LocalStorage();
        this.networks = NETWORKS;
        this.currentNetwork = 'main';
    }

    async initialize() {
        await this.storage.initialize();

        this.networks = await this.storage.get('networks', NETWORKS);
        this.currentNetwork = await this.storage.get('currentNetwork', this.currentNetwork);

        return this;
    }

    /**
     * Returns current network config
     * @returns {Promise<{name: string, network: *}>}
     */
    async getNetwork() {
        return {name: this.currentNetwork, network: this.networks[this.currentNetwork]};
    }

    /**
     * Get all networks
     * @returns {Promise<{devnet: {site: string, faucet: {address: string, type: string}, explorer: string, description: string, url: string}, main: {site: string, faucet: null, explorer: string, description: string, url: string}}>}
     */
    async getNetworks() {
        return this.networks;
    }

    /**
     * Add new network to manager
     * @param name
     * @param url
     * @param description
     * @param explorerUrl
     * @param faucet
     * @returns {Promise<void>}
     */
    async addNetwork(name, url, description = 'New network', explorerUrl = '', faucet = null) {
        this.networks[name] = {
            url,
            explorer: explorerUrl,
            description,
            site: '',
            faucet
        }

        await this.saveNetworks();
    }

    /**
     * Change current network
     * @param name
     * @param silent
     * @returns {Promise<void>}
     */
    async changeNetwork(name, silent = false) {
        if(!this.networks[name]) {
            throw EXCEPTIONS.invalidNetwork;
        }

        this.currentNetwork = name;
        await this.storage.set('currentNetwork', this.currentNetwork);

        if(!silent) {
            this.emit(this.EVENTS.networkChanged, await this.getNetwork());
        }
    }

    /**
     * Save networks state
     * @returns {Promise<void>}
     */
    async saveNetworks() {
        await this.storage.set('networks', this.networks);
    }
}

export default NetworkManager;