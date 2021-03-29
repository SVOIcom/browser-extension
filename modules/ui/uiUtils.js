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


const uiUtils = {
    /**
     * Open extension popup
     * @returns {Promise<*>}
     */
    openPopup: async () => {
        return browser.windows.create({
            url: 'popup.html',
            type: 'popup',
            width: 350,
            height: 536,
            // left: position.x,
            //  top: position.y,
        });
    }

}
export default uiUtils;