/*
  _____ ___  _   ___        __    _ _      _
 |_   _/ _ \| \ | \ \      / /_ _| | | ___| |_
   | || | | |  \| |\ \ /\ / / _` | | |/ _ \ __|
   | || |_| | |\  | \ V  V / (_| | | |  __/ |_
   |_| \___/|_| \_|  \_/\_/ \__,_|_|_|\___|\__|

 */
import LocalStorage from "../LocalStorage.mjs";

/**
 * @name FreeTON browser wallet and injector
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */

const $ = Dom7;

/**
 * Dark/light theme manager
 */
class Theme {
    constructor() {

        this.updateState();

        this.toggleElement = null;
        this.storage = new LocalStorage();
    }

    /**
     * Update component state
     */
    async updateState() {
        if(typeof app.darkTheme !== "undefined") {
            console.log('Update state', window.app);
            window.globalTheme = window.app.darkTheme ? 'dark' : 'light';
            this.toggleElement = app.toggle.get('#toggleDarkmode');
            if(!this.toggleElement) {
                this.toggleElement = app.toggle.create({
                    el: '#toggleDarkmode'
                });
            }

            this.toggleElement.off('change');

            this.toggleElement.checked = this.isDark();

            this.toggleElement.on('change', async () => {
                if(this.toggleElement.checked) {
                    await this.setLayoutTheme('dark');
                } else {
                    await this.setLayoutTheme('light');
                }

                await this.saveState();
            });


        }
    }

    /**
     * Save theme state
     * @returns {Promise<void>}
     */
    async saveState() {
        await this.storage.set('theme', this.isDark() ? 'dark' : 'light');
    }

    /**
     * Load theme state
     * @returns {Promise<void>}
     */
    async loadState() {
        let theme = await this.storage.get('theme');
        console.log(theme)
        if(theme) {
            await this.setLayoutTheme(theme);
        }
    }

    /**
     * Set theme
     * @param theme
     */
    async setLayoutTheme(theme) {
        let $html = $('html');
        window.globalTheme = theme;
        $html.removeClass('theme-dark theme-light').addClass('theme-' + globalTheme);
        $('.panel').removeClass('theme-dark theme-light').addClass('theme-' + globalTheme);
        this.toggleElement.checked = this.isDark();
        await this.saveState();
        //this.app.$setState({theme: globalTheme});
    }

    /**
     * Toggle theme
     */
    async toggle() {
        if(window.globalTheme === 'light') {
            this.setLayoutTheme('dark');
        } else {
            this.setLayoutTheme('light');
        }
    }

    /**
     * Is dark theme now?
     * @returns {boolean}
     */
    isDark() {
        return window.globalTheme === 'dark' /*&& app.darkTheme*/;
    }
}

export default new Theme();