import Utils from "../utils.mjs";

const DUCKDUCKGO_SEARCH_URL = 'https://duckduckgo.com/?q=';

class Tab extends EventEmitter3 {
    constructor(config = {provider: 'cordova'}) {
        super();
        this.config = config;
        this.browserPage = null;
        this.url = '';
        this.index = null;
    }

    /**
     * Open page in cordova browser
     * @param url
     * @private
     */
    _openBrowserCordova(url) {

        let that = this;

        this.url = url;

        this.browserPage = cordova.ThemeableBrowser.open(url, '_blank', {
            statusbar: {
                color: '#ffffffff'
            },
            toolbar: {
                height: 44,
                color: '#f0f0f0ff'
            },
            title: {
                color: '#003264ff',
                showPageTitle: true,
                //staticText: '',
            },
            /*backButton: {
                wwwImage: 'mobile_resources/icons/back.png',
                wwwImageDensity: 2,
                wwwImagePressed: 'mobile_resources/icons/back_pressed.png',
                align: 'left',
                event: 'backPressed'
            },
            forwardButton: {
                wwwImage: 'mobile_resources/icons/forward.png',
                wwwImageDensity: 2,
                wwwImagePressed: 'mobile_resources/icons/forward_pressed.png',
                align: 'left',
                event: 'forwardPressed'
            },*/
            /*closeButton: {
                wwwImage: 'mobile_resources/icons/close.png',
                wwwImageDensity: 2,
                wwwImagePressed: 'mobile_resources/icons/close_pressed.png',
                align: 'left',
                event: 'closePressed'
            },*/
            customButtons: [
                /* {
                     wwwImage: 'mobile_resources/icons/share.png',
                     wwwImageDensity: 2,
                     wwwImagePressed: 'mobile_resources/icons/share_pressed.png',
                     align: 'right',
                     event: 'sharePressed'
                 },*/
                {
                    wwwImage: 'mobile_resources/icons/tabs.png',
                    wwwImageDensity: 2,
                    wwwImagePressed: 'mobile_resources/icons/tabs.png',
                    align: 'right',
                    event: 'tabsPressed'
                }
            ],
            menu: {
                wwwImage: 'mobile_resources/icons/menu.png',
                wwwImageDensity: 2,
                wwwImagePressed: 'mobile_resources/icons/menu_pressed.png',
                title: 'Menu',
                cancel: 'Cancel',
                align: 'right',
                items: [
                    {
                        event: 'reloadPressed',
                        label: 'Reload page'
                    },
                    {
                        event: 'gotoPressed',
                        label: 'Goto URL'
                    },
                    {
                        event: 'hidePressed',
                        label: 'Hide browser'
                    }
                ]
            },
            backButtonCanClose: false,
            // disableAnimation: true,
        });

        this.browserPage.addEventListener('backPressed', function (e) {
            that.emit('backPressed', that.url, that);
        });

        this.browserPage.addEventListener('forwardPressed', function (e) {
            that.emit('forwardPressed', that.url, that);
        });

        this.browserPage.addEventListener('sharePressed', function (e) {
            that.emit('sharePressed', that.url, that);
        });

        this.browserPage.addEventListener('reloadPressed', function (e) {
            that.emit('reloadPressed', that.url, that);
            that.reload();
        });

        this.browserPage.addEventListener('tabsPressed', function (e) {
            that.emit('tabsPressed', that.url, that);
        });


        this.browserPage.addEventListener('loadstart', function (e) {
            that.emit('loadstart', e, that.url, that);
            if(e.url !== that.url) {
                that.url = e.url;
                that.emit('urlChanged', that.url, that);
            }
        });

        this.browserPage.addEventListener('gotoPressed', function (e) {
            that.emit('gotoPressed', that.url, that);
            let newUrl = prompt('Enter URL', that.url);

            //Resolve relative URLs
            if(newUrl) {
                try {
                    let url = new URL(newUrl);
                    newUrl = url.toString();
                } catch (e) {
                    try {
                        if(Utils.isValidDomain(newUrl)) {
                            newUrl = 'https://' + newUrl;
                        }
                        let url = new URL(newUrl);
                        newUrl = url.toString();
                    } catch (e) {
                        newUrl = DUCKDUCKGO_SEARCH_URL + encodeURIComponent(newUrl);
                    }

                }
                that.goto(newUrl);

            }
        });

        this.browserPage.addEventListener('message', function (e) {
            that.emit('message', e, that.url, that);
        });

        this.browserPage.addEventListener('hidePressed', function (e) {
            that.emit('hide', that.url, that);
            that.hide();
        });

        this.browserPage.addEventListener(cordova.ThemeableBrowser.EVT_ERR, function (e) {
            console.error(e.message);
            that.emit('error', e, that);
        });

        this.browserPage.addEventListener(cordova.ThemeableBrowser.EVT_WRN, function (e) {
            that.emit('warning', e, that);
            console.log(e.message);
        });

        that.emit('urlChanged', that.url, that);
    }

    /**
     * Open url in tab
     * @param url
     */
    open(url) {
        if(this.browserPage) {
            this.goto(url);
            return;
        }
        if(this.config.provider === 'cordova') {
            this._openBrowserCordova(url);
        }
    }

    /**
     * Change tab url
     * @param url
     */
    goto(url) {
        if(this.config.provider === 'cordova') {
            this.browserPage.executeScript({code: `window.location.href = '${url}'`});
            this.emit('urlChanged', this.url, this);
        }
    }

    close() {
        if(this.config.provider === 'cordova') {
            this.hide();
            this.goto('about:blank');
            //this.browserPage.close(); //TODO fix correct closing of one tab
            this.browserPage = null;
            this.url = '';
            this.index = null;
        }
    }

    hide() {
        if(this.config.provider === 'cordova') {
            this.browserPage.hide();
        }
    }

    show() {
        if(this.config.provider === 'cordova') {
            this.browserPage.show();
        }
    }

    reload() {
        if(this.config.provider === 'cordova') {
            this.browserPage.reload();
        }
    }

    /**
     * Run script
     * @async
     * @param script
     * @returns {Promise<[]>}
     */
    runScript(script) {
        if(this.config.provider === 'cordova') {
            return new Promise((resolve, reject) => {
                this.browserPage.executeScript({code: script}, resolve);
            });
        }
    }

    /**
     * Returns page title
     * @returns {Promise<string>}
     */
    async getTitle() {
        if(this.config.provider === 'cordova') {
            return (await this.runScript('document.title;'))[0];
        }
    }

    /**
     * Returns page favicon url
     * @returns {string}
     */
    faviconUrl() {
        if(this.url.includes('http')) {
            return `https://www.google.com/s2/favicons?domain=${this.url}`;
        }

        return '';
    }

}

export default Tab;