/**
 * @name ScaleWallet - Everscale browser wallet and injector
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */

const EMPTY_ADDRESS = "0:0000000000000000000000000000000000000000000000000000000000000000";

/**
 * DeNs domain resolver for freeton.domains
 */
class DeNsResolver {
    constructor(testnet = false) {
        this.testnet = testnet;
    }

    /**
     * Internal domain request
     * @param {string} domain
     * @returns {Promise<*>}
     * @private
     */
    async _requestDomain(domain) {
        if(window._isApp){
            return await _utils.jsonp(`https://scale.domains/queryPretty?domain=${encodeURIComponent(domain)}&testnet=${this.testnet ? 'true' : 'false'}`);
        }
        return await _utils.fetchJSON(`https://scale.domains/queryPretty?domain=${encodeURIComponent(domain)}&testnet=${this.testnet ? 'true' : 'false'}`);
        
    }

    /**
     * Resolve domain endpoint address
     * @param {string} domain
     * @returns {Promise<string>}
     */
    async resolveAddress(domain) {
        let data = await this._requestDomain(domain);

        if(!data.whois.endpointAddress) {
            throw new Error('Domain not found');
        }

        if(data.whois.endpointAddress === '-') {
            throw new Error('Domain endpoint not specified');
        }

        return data.whois.endpointAddress;
    }

}

export default DeNsResolver;