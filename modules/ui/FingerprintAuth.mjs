import Utils from "../utils.mjs";
import LOCALIZATION from "../Localization.mjs";
import PrivateStorage from "../PrivateStorage.mjs";

class FingerprintAuth {
    constructor() {
        this._storage = new PrivateStorage();
    }

    async init() {
        await this._storage.initialize();
    }

    /**
     * Generate new internal secret
     * @returns {string}
     * @private
     */
    _generateNewFingerSecret() {
        return Utils.generateRandomString(64);
    }

    /**
     * Check is bio auth is supported
     * @returns {Promise<unknown>}
     */
    async isAvailable() {
        return new Promise(function (resolve, reject) {
            try {
                Fingerprint.isAvailable(() => {
                    resolve(true)
                }, () => {
                    resolve(false)
                })
            } catch (e) {
                resolve(false);
            }
        });
    }

    /**
     * Create fingerprint secret storage
     * @param description
     * @returns {Promise<unknown>}
     */
    async registerNewFingerprint(description = 'Lock') {
        let that = this;
        return new Promise(function (resolve, reject) {
            let newSecret = that._generateNewFingerSecret();
            try {
                Fingerprint.registerBiometricSecret({
                    description: LOCALIZATION._(description),
                    secret: newSecret,
                    invalidateOnEnrollment: true,
                    disableBackup: true, // always disabled on Android
                }, () => resolve(newSecret), (error) => reject(error));
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Extract fingerprint storage secret
     * @param description
     * @returns {Promise<unknown>}
     * @private
     */
    async _getFingerprintSecret(description = 'Unlock') {
        let that = this;
        return new Promise(function (resolve, reject) {
            try {
                Fingerprint.loadBiometricSecret({
                    description: LOCALIZATION._(description),
                    disableBackup: true, // always disabled on Android
                }, (secret) => resolve(secret), (error) => reject(error));
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Add secret to bio storage
     * @param id
     * @param secret
     * @param description
     * @returns {Promise<boolean>}
     */
    async addBioSecret(id, secret, description = 'Lock') {
        let fingerSecret = await this._getFingerprintSecret(description);
        if(!fingerSecret) {
            throw new Error('Invalid fingerprint secret. Create new fingerprint first.');
        }

        let secrets = {}
        try {
            secrets = await this._storage.get('biometricSecrets', fingerSecret);
        } catch (e) {
        }

        if(!secrets) {
            secrets = {};
        }

        secrets[id] = secret;

        await this._storage.set('biometricSecrets', secrets, fingerSecret);
        return true;
    }

    /**
     * Extract secret from bio storage
     */
    async getBioSecret(id, description = 'Unlock') {
        let fingerSecret = await this._getFingerprintSecret(description);
        if(!fingerSecret) {
            throw new Error('Invalid fingerprint secret. Create new fingerprint first.');
        }

        let secrets = await this._storage.get('biometricSecrets', fingerSecret);

        return secrets[id];
    }

}

export default FingerprintAuth;