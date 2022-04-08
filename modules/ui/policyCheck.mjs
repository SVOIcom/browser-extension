/**
 * @name ScaleWallet - Everscale browser wallet and injector
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */

 const $ = Dom7;


/**
 * validate password fields
 * @returns {Boolean}
 */
function checkPolicyCheckbox() {

    let policyCheckbox = $("#policyCheckbox");
    let submit = $("#submit");


    if (policyCheckbox.val == true){

        console.log(true);

    } else console.log(false);

}


