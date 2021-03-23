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
 * Dark/light theme manager
 */
class Theme {
    constructor() {

        this.updateState();

        this.toggleElement = null;
    }

    /**
     * Update component state
     */
    updateState() {
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
            this.toggleElement.on('change', () => {
                if(this.toggleElement.checked) {
                    this.setLayoutTheme('dark');
                } else {
                    this.setLayoutTheme('light');
                }
            });

            this.toggleElement.checked = this.isDark();
        }
    }

    /**
     * Set theme
     * @param theme
     */
    setLayoutTheme(theme) {
        let $html = $('html');
        window.globalTheme = theme;
        $html.removeClass('theme-dark theme-light').addClass('theme-' + globalTheme);
        this.toggleElement.checked = this.isDark();
        //this.app.$setState({theme: globalTheme});
    }

    /**
     * Toggle theme
     */
    toggle() {
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
        return window.globalTheme === 'dark' && app.darkTheme;
    }
}

export default new Theme();