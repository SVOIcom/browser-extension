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
    "ru_RU": await Utils.fetchJSON('/lang/ru_RU.json', true),
    "ru": await Utils.fetchJSON('/lang/ru_RU.json', true),
    "es_ES": await Utils.fetchJSON('/lang/es_ES.json', true),
    "es": await Utils.fetchJSON('/lang/es_ES.json', true),
}

const SUPPORT_LOCALES = {'en_US': 'English (US)', "ru_RU": 'Russian'}

let freezeLang = false;

let currentLang = DETECTED_LANG;

const LOCALIZATION = {
    SUPPORT_LOCALES,
    DETECTED_LANG,
    currentLang,
    DEFAULT_LANG,
    LOCALES,
    /**
     * Get localized string
     * @param {string} string
     * @param {string} locale
     * @returns {string}
     */
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

    /**
     * Update plain class localization
     */
    updateLocalization: () => {

        //Localize plain class elements
        let localizeElements = ($('.localization:not(.localization-complete)'));

        localizeElements.forEach((locElement) => {
            locElement = $(locElement);

            if(!freezeLang) {
                locElement.data("original", `${locElement.text()}`);
                
            }

            // locElement.attr("origin-en-text", `${locElement.text()}`);

            // locElement.text(LOCALIZATION._(locElement.text()));


            if (locElement.data("original")){
                locElement.text(LOCALIZATION._( locElement.data("original") ));
            }
            else {
                locElement.text(LOCALIZATION._(locElement.text()));
            }

            locElement.addClass('localization-complete');
        });

        freezeLang = true;

    },
    /**
     * Reset plain class localized strings
     */
    resetPlainLocalization: () => {
        $('.localization-complete').removeClass('localization-complete');
    },

    /**
     * Autolocalize timer
     */
    startTimer() {
        setInterval(() => {
            LOCALIZATION.updateLocalization();
        }, 1000);
    },

    /**
     * Change localization language
     * @param lang
     */
    changeLang(lang = DEFAULT_LANG) {
        localStorage.setItem('language', lang)
        currentLang = lang;
        LOCALIZATION.resetPlainLocalization();
        LOCALIZATION.updateLocalization();

        // In russian it means kostyl
        // location.reload();
    }
}

window.LOCALIZATION = LOCALIZATION;


export default LOCALIZATION;