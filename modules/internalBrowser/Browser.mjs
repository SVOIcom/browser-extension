import Tab from "./Tab.mjs";
import uiUtils from "../ui/uiUtils.mjs";
import Utils from "../utils.mjs";

const DEFAULT_PAGE = 'file:///android_asset/www/mobile_resources/index.html';

class Browser {
    constructor(messenger) {
        this.tabs = [];
        this.activeTab = null;
        this.messenger = messenger;

        this.messenger.on('rawRPC', (data) => {
            //console.log('BROWSER INCOME:', data);
            this.broadcastMessage(data)
        });
    }


    get activeTabIndex() {
        return this.tabs.indexOf(this.activeTab);
    }

    /**
     * Add new tab
     * @param {string} url
     */
    async newTab(url = DEFAULT_PAGE) {
        let tab = new Tab();
        this.tabs.push(tab);

        //if(this.activeTab === null) {
        this.activeTab = tab;
        //}

        await tab.open(url);

        let index = this.tabs.length - 1;

        tab.index = index;

        //Add tabs icon click handler
        tab.on('tabsPressed', () => {
            this._processTabsClick();
        });

        tab.on('message', (message) => {
            this._processIncomeMessage(message);
        });

        return {tab, index};
    }

    _reorganizeTabs() {
        for (let tab of this.tabs) {
            tab.index = this.tabs.indexOf(tab);
        }
    }

    _processIncomeMessage(message){
        //console.log('Browser._processIncomeMessage', message);
        let data = message.data;

        //Send msg to background
        this.messenger.postIframeMessage(data);
    }

    broadcastMessage(message) {
        for (let tab of this.tabs) {
            tab.sendInjectorMessage(message);
        }
    }

    /**
     * Close tab at index
     * @param index
     */
    closeTab(index) {
        this.tabs[index].close();

        if(this.activeTab === this.tabs[index]) {
            if(this.tabs.length === 1) {
                this.activeTab = null;
            } else {
                this.activeTab = this.tabs[index - 1];
            }
        } else {
            if(index === 0) {
                this.activeTab = this.tabs[this.tabs.length - 1];
            } else {
                this.activeTab = this.tabs[index - 1];
            }
        }
        this.tabs.splice(index, 1);

        this._reorganizeTabs();
    }

    /**
     * Switch to tab to index
     * @param index
     */
    switchTab(index) {
        if(this.activeTab) {
            this.activeTab.hide();
        }

        this.activeTab = this.tabs[index];

        this.activeTab.show();
    }

    nextTab() {
        let index = this.activeTabIndex + 1;
        if(index >= this.tabs.length) {
            index = 0;
        }
        this.switchTab(index);
    }

    prevTab() {
        let index = this.activeTabIndex - 1;
        if(index < 0) {
            index = this.tabs.length - 1;
        }
        this.switchTab(index);
    }

    hideBrowser() {
        this.tabs.forEach(tab => {
            tab.hide();
        });
    }

    showBrowser() {
        this.activeTab.show();
    }

    /**
     * Process tabs click and show tabs switcher
     * @private
     */
    _processTabsClick() {
        this.hideBrowser();
        this.showTabSelector();
    }

    async updateTabSelector() {
        let that = this;
        let tabs = ``;

        for (let tab of that.tabs) {
            let icon = await tab.faviconUrl();

            if(!icon) {
                icon = `<i class="icon material-icons if-md">public</i>`;
            } else {
                icon = ` <img src="${icon}" alt="" style="height: 24px;">`
            }

            tabs += `
                <li>
                    <a href="#" class="item-content item-link tabItem" data-index="${tab.index}">
                        <div class="item-media">
                            ${icon}
                        </div>
                        <div class="item-inner">
                                 <div class="item-title">${await tab.getTitle()}</div>
                                <div class="item-after closeTab"  data-index="${tab.index}">
                                    <i class="icon material-icons if-md">close</i>
                                </div>
                        </div>
                    </a>
                </li>
                `;
        }

        tabs += `
                <li>
                    <a href="#" class="item-content item-link tabItem" data-index="newtab">
                        <div class="item-media">
                            <i class="icon material-icons if-md">add_circle</i>
                        </div>
                        <div class="item-inner">
                            <div class="item-title-wrap">
                                <div class="item-title localization">New tab</div>
                            </div>
                        </div>
                    </a>
                </li>
                `;

        $('#browserTabs').html(tabs);

        $('.tabItem').on('click', function () {
            let index = $(this).data('index');
            if(index === 'newtab') {
                that.newTab();
                that.hideTabSelector();
                return;
            }

            that.switchTab(index);
            that.hideTabSelector();
        });

        $('.closeTab').on('click', async function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            let index = $(this).data('index');
            that.closeTab(index);
            await that.updateTabSelector();
        });
    }

    async showTabSelector() {

        let that = this;

        window.app.views.main.router.navigate("/browserTabs");

        app.once('pageInit', async () => {
            await that.updateTabSelector();
        });

        /*    let tabsList = [];
            for (let tab of this.tabs) {
                tabsList.push({
                    text: await tab.getTitle(),
                    index: tab.index,
                    onClick: async function () {
                        that.switchTab(tab.index);
                    }

                });


            }
            let result = await uiUtils.popupSelector(tabsList, LOCALIZATION._(`Select tab`));
            console.log('PP', result);*/
    }

    hideTabSelector() {
        Utils.appBack();
    }


}

export default Browser;