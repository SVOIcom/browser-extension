import Tab from "./Tab.mjs";

class Browser {
    constructor() {
        this.tabs = [];
        this.activeTab = null;
    }


    get activeTabIndex() {
        return this.tabs.indexOf(this.activeTab);
    }

    async newTab(url) {
        let tab = new Tab();
        this.tabs.push(tab);

        if(this.activeTab === null) {
            this.activeTab = tab;
        }

        await tab.open(url);

        return {tab, index: this.tabs.length - 1};
    }

    closeTab(index) {
        this.tabs[index].close();
        if(this.activeTab === this.tabs[index]) {
            if(index === 0) {
                this.activeTab = null;
            } else {
                this.activeTab = this.tabs[index - 1];
            }
        }
        this.tabs.splice(index, 1);
    }

    switchTab(index) {
        this.activeTab.hide();

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


}

export default Browser;