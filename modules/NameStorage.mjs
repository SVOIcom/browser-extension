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


 class NameStorage {
 
    /**
     * Delete key from storage
     * @param key
     * @returns {Promise<*>}
     */
     async get(key) {
         let accountName =  (await browser.storage.sync.get(`${key}_name`))[`${key}_name`];
 
         if(!accountName){
             return "";
         }
         return accountName;
     }
 
    /**
     * Delete key from storage
     * @param key
     * @param name
     * @returns {Promise<*>}
     */
     async set(key, name="") {
         let field = {};
         field[`${key}_name`] = name;
         await browser.storage.sync.set(field);
         return true
     }
 
 
     /**
      * Delete key from storage
      * @param key
      * @returns {Promise<*>}
      */
     async del(key) {
         await browser.storage.sync.remove(`${key}_name`);
         return true;
     }
 
 
 }
 
 export default new NameStorage();