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


/**
 * check seed field not empty
 * @returns {Boolean}
 */
 function checkSeedPhraseExist() {

    let seedPhaseAreaLabel = $("#seedPhaseAreaLabel");
    let seedPhaseAreaLi = $("#seedPhaseAreaLi");
    let seedPhaseArea = $("#seedPhaseArea");
    let seedPhrase = $("#seedPhaseArea");

    if (seedPhrase.val() === ""){
        seedPhaseAreaLi.addClass('item-input-invalid');
        seedPhaseArea.addClass("input-invalid");
        seedPhaseAreaLabel.text("Please enter your seed phrase");
        return 0
    } else {
        seedPhaseAreaLi.removeClass('item-input-invalid');
        seedPhaseArea.removeClass("input-invalid");
        return 1
    }
}


/**
 * check key fields not empty
 * @returns {Boolean}
 */
 function checkKeyPairExist(){
    

    let keysAreaLabel = $("#keysAreaLabel");
    let keysAreaLabel2 = $("#keysAreaLabel2");
    let keysAreaLi = $("#keysAreaLi");
    let keysAreaLi2 = $("#keysAreaLi2");
    let publicKeyField = $("#publicKeyField");
    let privateKeyField = $("#privateKeyField");

    if (publicKeyField.val() === "" || privateKeyField.val() === ""){
        keysAreaLi.addClass('item-input-invalid');
        keysAreaLi2.addClass('item-input-invalid');

        publicKeyField.addClass("input-invalid");
        privateKeyField.addClass("input-invalid");

        keysAreaLabel.text("Please enter your account keys");

        return 0
    } else {
        keysAreaLi.removeClass('item-input-invalid');
        keysAreaLi2.removeClass('item-input-invalid');

        publicKeyField.removeClass("input-invalid");
        privateKeyField.removeClass("input-invalid");
        return 1
    }

 }

 /**
 * validate policy checkbox field
 * @returns {Boolean}
 */
  function keysInvalid(errCode) {

    let keysAreaLabel = $("#keysAreaLabel");
    let keysAreaLabel2 = $("#keysAreaLabel2");
    let keysAreaLi = $("#keysAreaLi");
    let keysAreaLi2 = $("#keysAreaLi2");
    let publicKeyField = $("#publicKeyField");
    let privateKeyField = $("#privateKeyField");

    let validFlag = 1

    if (publicKeyField.val().length != 64 || privateKeyField.val().length != 64){
        keysAreaLi.addClass('item-input-invalid');
        keysAreaLi2.addClass('item-input-invalid');

        publicKeyField.addClass("input-invalid");
        privateKeyField.addClass("input-invalid");

        keysAreaLabel.text("Keys must be 64 characters long ");

        validFlag = 0;

    }  else if (errCode == 10004){
        keysAreaLi.addClass('item-input-invalid');
        keysAreaLi2.addClass('item-input-invalid');

        publicKeyField.addClass("input-invalid");
        privateKeyField.addClass("input-invalid");

        keysAreaLabel.text("This keys is already in your wallet");

        validFlag = 0

        } else {

        keysAreaLi.removeClass('item-input-invalid');
        keysAreaLi2.removeClass('item-input-invalid');

        publicKeyField.removeClass("input-invalid");
        privateKeyField.removeClass("input-invalid");

        return 1;
    }

    return validFlag;

}

/**
 * validate policy checkbox field
 * @returns {Boolean}
 */
 function seedPhraseInvalid(code) {

    let seedPhaseAreaLabel = $("#seedPhaseAreaLabel");
    let seedPhaseAreaLi = $("#seedPhaseAreaLi");
    let seedPhaseArea = $("#seedPhaseArea");

    let validFlag = 1

    if (code == 10004){
        seedPhaseAreaLi.addClass('item-input-invalid');
        seedPhaseArea.addClass("input-invalid");
        seedPhaseAreaLabel.text("This seed phrase is already in your wallet");
        validFlag = 0
        } else {
        seedPhaseAreaLi.addClass('item-input-invalid');
        seedPhaseArea.addClass("input-invalid");
        seedPhaseAreaLabel.text("This seed phrase is invalid");
        validFlag = 0
        }

    return validFlag;

}

/**
 * validate policy checkbox field
 * @returns {Boolean}
 */
 function checkAccountName() {

    let accountNameLabel = $("#accountNameLabel");
    let accountNameAreaLi = $("#accountNameAreaLi");
    let accountName = $("#accountName");

    if (accountName.val() === ""){
        accountNameAreaLi.addClass('item-input-invalid');
        accountName.addClass("input-invalid");
        accountNameLabel.text("Please enter new account name");
        return 0
    } else {
        accountNameAreaLi.removeClass('item-input-invalid');
        accountName.removeClass("input-invalid");
        return 1
    }
}