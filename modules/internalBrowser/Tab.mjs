class Tab extends EventEmitter3 {
    constructor(config = {provider: 'cordova'}) {
        super();
        this.config = config;
        this.browserPage = null;
        this.url = '';
        this.index = null;
    }

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
                        event: 'hidePressed',
                        label: 'Hide browser'
                    }
                ]
            },
            backButtonCanClose: false,
            disableAnimation: true,
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

    open(url) {
        if(this.browserPage) {
            this.goto(url);
            return;
        }
        if(this.config.provider === 'cordova') {
            this._openBrowserCordova(url);
        }
    }

    goto(url) {
        if(this.config.provider === 'cordova') {
            this.browserPage.executeScript({code: `window.location.href = '${url}'`});
            this.emit('urlChanged', this.url, this);
        }
    }

    close() {
        if(this.config.provider === 'cordova') {
            this.browserPage.close();
            this.browserPage = null;
            this.url = '';
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

}

export default Tab;