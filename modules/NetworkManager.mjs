/**
 * @name ScaleWallet - Everscale browser wallet and injector
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */

import LocalStorage from "./LocalStorage.mjs";
import NETWORKS from "./const/Networks.mjs";
import EXCEPTIONS from "./const/Exceptions.mjs";
import Utils from "./utils.mjs";


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

        //Update networks from local list
        for (let networkName in NETWORKS) {
            this.networks[networkName] = NETWORKS[networkName];
        }

        for (let networkName in this.networks) {

            if(!this.networks[networkName].urls) {
                this.networks[networkName].urls = this.networks[networkName].url;
            }

            if(typeof this.networks[networkName].urls === 'string') {
                this.networks[networkName].urls = Utils.unpackNetworks(this.networks[networkName].urls);
            }

            //Deprecated
            if(!this.networks[networkName].url) {
                this.networks[networkName].url = this.networks[networkName].urls[0];
            }
        }


        this.currentNetwork = await this.storage.get('currentNetwork', this.currentNetwork);

        return this;
    }

    /**
     * Returns current network config
     * @returns {Promise<{name: string, network: *}>}
     */
    async getNetwork(name = undefined) {
        if(!name) {
            return {name: this.currentNetwork, network: this.networks[this.currentNetwork]};
        } else if(typeof this.networks[name] === 'undefined') {
            throw EXCEPTIONS.invalidNetwork;
        } else {
            return {name, network: this.networks[name]};
        }
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
            url: Utils.packNetworks(url),
            explorer: explorerUrl,
            description,
            site: '',
            faucet,
            tokenIcon: '💸️',
            type: 'custom'
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