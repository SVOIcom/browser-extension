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

import Utils from "./utils.mjs";


const DEFAULT_LANG = 'en_US';
const DETECTED_LANG = (localStorage.getItem('language') || (window.navigator.language || 'en_US')).replace(/-/g, "_");
const LOCALES = {
    "ru_RU": await Utils.fetchJSON('/lang/ru_RU.json')
}

let currentLang = DETECTED_LANG;

const LOCALIZATION = {
    _: (string, locale = currentLang) => {
        if(locale === DEFAULT_LANG) {
            return string;
        }

        if(typeof LOCALES[currentLang] === 'undefined') {
            return string;
        }

        if(typeof LOCALES[currentLang][string] === 'undefined') {
            return string;
        }

        if(LOCALES[currentLang][string] === '') {
            return string;
        }

        return LOCALES[currentLang][string];
    },
    updateLocalization: () => {

        //Localize plain class elements
        let localizeElements = ($('.localization:not(.localization-complete)'));

        localizeElements.forEach((locElement) => {
            locElement = $(locElement);
            locElement.text(LOCALIZATION._(locElement.text()));

            locElement.addClass('localization-complete');
        });


    },
    resetPlainLocalization: () => {
        $('.localization-complete').removeClass('localization-complete');
    },
    startTimer(){
        setInterval(() => {
            LOCALIZATION.updateLocalization();
        }, 1000);
    }
}



export default LOCALIZATION;