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

 const $ = Dom7;


/**
 * validate password fields
 * @returns {Boolean}
 */
function validatePassword() {

    let password = $("#password");
    let passwordValidation = $("#passwordValidation");
    let passwordLi = $("#passwordLi");
    let passwordValidationLi = $("#passwordValidationLi");
    let passwordLable = $("#Plabel");
    let passwordValidationLable = $("#PVlabel");

    let mismatchError = 0;
    let passwordError = 0;
    let validationError = 0;
    let lenghsError = 0;

    if (password.val() != passwordValidation.val()){

        passwordLi.addClass('item-input-invalid');
        passwordValidationLi.addClass('item-input-invalid');

        password.addClass("input-invalid");
        passwordValidation.addClass("input-invalid");

        passwordLable.text("Passwords mismatch");
        passwordValidationLable.text("Passwords mismatch");

        mismatchError = 1;

    } else mismatchError = 0;

    if (passwordValidation.val().length < 5){
        console.log("len", passwordValidation.val().length)

        passwordLi.addClass('item-input-invalid');
        password.addClass("input-invalid");
        passwordLable.text("Password must be at least 5 characters");

        lenghsError = 1;

    } else lenghsError = 0;

    if (password.val() == ""){

        passwordLi.addClass('item-input-invalid');
        password.addClass("input-invalid");
        passwordLable.text("Password is required");

        passwordError = 1;

    } else passwordError = 0;

    if (passwordValidation.val() == ""){

        passwordValidationLi.addClass('item-input-invalid');
        passwordValidation.addClass("input-invalid");
        passwordValidationLable.text("Password verify is required");

        validationError = 1;

    } else validationError = 0;

    if (mismatchError == 0 && 
        passwordError == 0 && 
        validationError ==0 &&
        lenghsError == 0) {

        passwordLi.removeClass('item-input-invalid');
        passwordValidationLi.removeClass('item-input-invalid');

        password.removeClass("input-invalid");
        passwordValidation.removeClass("input-invalid");

        passwordLable.text("Password");
        passwordValidationLable.text("Repeat password");

        return 1;

    } else return 0;
}


/**
 * validate policy checkbox field
 * @returns {Boolean}
 */
 function checkPolicyCheckbox() {

    let policyCheckbox = $("#policyCheckbox");
    let submit = $('#submit');

    if (policyCheckbox.is(':checked') == true){

        submit.removeClass('disabled')

        return 1;

    } else {
        submit.addClass('disabled');

        return 0;
    }

}