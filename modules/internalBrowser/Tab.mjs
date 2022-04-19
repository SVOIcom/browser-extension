class Tab extends EventEmitter3 {
    constructor(config = {provider: 'cordova'}) {
        super();
        this.config = config;
        this.browserPage = null;
        this.url = '';
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
                showPageTitle: true
            },
            backButton: {
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
            },
            closeButton: {
                wwwImage: 'mobile_resources/icons/close.png',
                wwwImageDensity: 2,
                wwwImagePressed: 'mobile_resources/icons/close_pressed.png',
                align: 'left',
                event: 'closePressed'
            },
            customButtons: [
                {
                    wwwImage: 'mobile_resources/icons/share.png',
                    wwwImageDensity: 2,
                    wwwImagePressed: 'mobile_resources/icons/share_pressed.png',
                    align: 'right',
                    event: 'sharePressed'
                }
            ],
            menu: {
                wwwImage: 'mobile_resources/icons/menu.png',
                wwwImageDensity: 2,
                wwwImagePressed: 'mobile_resources/icons/menu_pressed.png',
                title: 'Test',
                cancel: 'Cancel',
                align: 'right',
                items: [
                    {
                        event: 'helloPressed',
                        label: 'Hello World!'
                    },
                    {
                        event: 'testPressed',
                        label: 'Test!'
                    }
                ]
            },
            backButtonCanClose: true
        }).addEventListener('backPressed', function (e) {
            that.emit('backPressed', that.url, that);
        }).addEventListener('forwardPressed', function (e) {
            that.emit('forwardPressed', that.url, that);
        }).addEventListener('sharePressed', function (e) {
            that.emit('sharePressed', that.url, that);
        }).addEventListener(cordova.ThemeableBrowser.EVT_ERR, function (e) {
            console.error(e.message);
            that.emit('error', e, that);
        }).addEventListener(cordova.ThemeableBrowser.EVT_WRN, function (e) {
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

}

export default Tab;