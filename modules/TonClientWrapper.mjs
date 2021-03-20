/**
 *
 *
 **/



class TonClientWrapper extends EventEmitter3 {

    /**
     * Possible events
     * @type {{NETWORK_CHANGED: string}}
     */
    EVENTS = {
        NETWORK_CHANGED: 'networkChanged'
    }

    constructor() {
        super();
        this._rawTon = null;
    }

    /**
     * Create Wrapped TONClient instance
     * @param options
     * @returns {Promise<TonClientWrapper>}
     */
    async create(options = {}) {
        this._rawTon = await TONClient.create(options);

        //Cloning internal methods and objects
        for (let key of Object.keys(this._rawTon)) {
            this[key] = this._rawTon[key];
        }

        return this;
    }

    /**
     * Change network
     * @param servers
     * @returns {Promise<void>}
     */
    async setServers(servers = []) {
        if(!Array.isArray(servers)) {
            servers = [servers];
        }

        //Re-setup TONCLient
        this._rawTon.queries.graphqlClient = null

        this._rawTon.config.data.servers = servers;

        this.emit(this.EVENTS.NETWORK_CHANGED, servers);
    }
}

export default TonClientWrapper;