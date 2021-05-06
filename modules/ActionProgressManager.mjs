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


/**
 * Active actions manager
 */
class ActionProgressManager {
    constructor() {
        this.activeActions = {};
    }


    /**
     * Get list of active actions
     * @returns {*[]}
     */
    getActiveActions() {
        let actionsArray = [];

        for (let actionKey of Object.keys(this.activeActions)) {
            actionsArray.push({...this.activeActions[actionKey], key: actionKey});
        }

        return actionsArray;
    }

    /**
     * Start new active action
     * @param name
     * @param description
     * @param options
     */
    startAction(name = '', description = '', options = {}) {
        let actionKey = Math.random();
        this.startActionOnce(actionKey, name = '', description = '', options = {});

        return actionKey;
    }

    /**
     * Start action with user defined key
     * @param actionKey
     * @param name
     * @param description
     * @param options
     */
    startActionOnce(actionKey, name = '', description = '', options = {}) {
        this.activeActions[actionKey] = {name, description, options};
    }

    /**
     * End activated action
     * @param actionKey
     */
    endAction(actionKey) {
        delete this.activeActions[actionKey];
    }

    /**
     * Is any action in work
     * @returns {boolean}
     */
    isAnyActionActive() {
        return this.getActiveActions().length !== 0;
    }
}

export default new ActionProgressManager();

//app.progressbar.show('multi')