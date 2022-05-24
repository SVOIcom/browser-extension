import utils from "./utils.mjs";
import uiUtils from "./ui/uiUtils.mjs";


const PLUGINS_BASE = 'https://plugins.scalewallet.com';

class PluginManager {
    async init(pluginsBase = PLUGINS_BASE) {
        this.pluginsBase = pluginsBase;
        this.plugins = (await utils.fetchJSON(pluginsBase + '/plugins.json?v=' + Math.random())).plugins;

        this._pluginsRuntime = {};


        return this;
    }

    /**
     * Runs UI part if plugins
     * @returns {Promise<void>}
     */
    async runUIPlugins() {
        for (let plugin of this.plugins) {

            if(plugin.disabled) {
                continue;
            }

            let pluginRuntime = {};

            if(plugin.menuAction) {
                $('.pluginMenuListHolder').show();
                let appendStr = `<li>
                                        <a href="#" id="${plugin.path}_menuButton" class="item-content colour-change panel-close">
                                            <div class="item-media">${plugin.menuAction.icon ? `<img style="height: 20px" src="${this.pluginsBase}/plugins/${plugin.path}/${plugin.menuAction.icon}">` : ''}</div>
                                            <div class="item-inner">
                                                <div class="item-title-wrap">
                                                    <div class="item-title ">${plugin.menuAction.title}</div>
                                                </div>
                                            </div>
                                        </a>
                                    </li>`;
                $('#pluginMenuList').append(appendStr);
                pluginRuntime.pluginMenuButton = $(`#${plugin.path}_menuButton`);
                pluginRuntime.menuButtonAction = plugin.menuAction;

                $(`#${plugin.path}_menuButton`).on('click', async () => {
                    if(pluginRuntime.menuButtonAction.page) {

                        await uiUtils.navigateUrlAsync("/pluginPage");

                        let contentIframe = document.getElementById('moduleContentIframe');
                        pluginRuntime.contentIframe = contentIframe;

                        //Resolve page path
                        let contentSrc = pluginRuntime.menuButtonAction.page.content;
                        if(!contentSrc.includes('https://')) {
                            contentSrc = `${this.pluginsBase}/plugins/${plugin.path}/${contentSrc}`;
                        }

                        //Set plugin page title
                        $('#pluginTitle').text(pluginRuntime.menuButtonAction.page.title);

                        //Set iframe path
                        contentIframe.src = contentSrc;

                        //Configure iframe
                        if(window.theme.isDark()) {
                            await this.evalPluginContentIframe(plugin.path, `document.body.classList.add('darkmode');`, 'contentIframe');
                        }
                        await this.evalPluginContentIframe(plugin.path, `window.darkMode = ${String(window.theme.isDark())};`, 'contentIframe');
                        await this.evalPluginContentIframe(plugin.path, `window.currentLang = '${LOCALIZATION.currentLang}';`, 'contentIframe');

                        contentIframe.onload = async () => {

                            //Allow emulation in frame
                            await this.evalPluginContentIframe(plugin.path, `_everscaleWalletConfig = {EVERWalletEmulation: true};`, 'contentIframe');

                            //Configure iframe2
                            if(window.theme.isDark()) {
                                await this.evalPluginContentIframe(plugin.path, `document.body.classList.add('darkmode');`, 'contentIframe');
                            }
                            await this.evalPluginContentIframe(plugin.path, `window.darkMode = ${String(window.theme.isDark())};`, 'contentIframe');
                            await this.evalPluginContentIframe(plugin.path, `window.currentLang = '${LOCALIZATION.currentLang}';`, 'contentIframe');
                            await this.evalPluginContentIframe(plugin.path, `window.pluginContentType = 'page';`, 'contentIframe');
                            await this.evalPluginContentIframe(plugin.path, `window.pluginMessageOriginPath = '${plugin.path}';`, 'contentIframe');
                        }


                    }
                })
            }

            if(plugin.mainTab) {
                $('.tabsToolbar').append(`<a href="#tab${plugin.path}" class="tab-link   localization">${plugin.mainTab.title}</a>`);
                $('.walletTabs').append(`             <div class="tab " id="tab${plugin.path}">
                                        <iframe  src="#" allow="clipboard-write" style="width: 100%;  padding: 0; margin: 0; border: 0" frameborder="0"></iframe>
                        </div>`);
                pluginRuntime.mainTabContent = $(`#tab${plugin.path}`);
                pluginRuntime.mainTab = plugin.mainTab;
                if(pluginRuntime.mainTab.page) {


                    let contentIframe = pluginRuntime.mainTabContent.find('iframe')[0];
                    pluginRuntime.tabContentIframe = contentIframe;

                    //Resolve page path
                    let contentSrc = pluginRuntime.menuButtonAction.page.content;
                    if(!contentSrc.includes('https://')) {
                        contentSrc = `${this.pluginsBase}/plugins/${plugin.path}/${contentSrc}`;
                    }

                    //Set plugin page title
                    $('#pluginTitle').text(pluginRuntime.menuButtonAction.page.title);

                    //Set iframe path
                    contentIframe.src = contentSrc;


                    contentIframe.onload = async () => {

                        window.addEventListener('message', async (event) => {
                            if(event.data.type === 'pluginMessage') {
                                let message = event.data.message;
                                let plugin = this._pluginsRuntime[event.data.pluginPath];

                                //If frame size  changed
                                //console.log(message);
                                if(message.method === 'updateIframeHeight' && plugin.tabContentIframe) {
                                    plugin.tabContentIframe.style.height = message.height + 'px';
                                }

                            }

                        });

                        //Allow emulation in frame
                        await this.evalPluginContentIframe(plugin.path, `_everscaleWalletConfig = {EVERWalletEmulation: true};`, 'tabContentIframe');

                        //Configure iframe2
                        if(window.theme.isDark()) {
                            await this.evalPluginContentIframe(plugin.path, `document.body.classList.add('darkmode');`, 'tabContentIframe');
                        }
                        await this.evalPluginContentIframe(plugin.path, `window.darkMode = ${String(window.theme.isDark())};`, 'tabContentIframe');
                        await this.evalPluginContentIframe(plugin.path, `window.currentLang = '${LOCALIZATION.currentLang}';`, 'tabContentIframe');
                        await this.evalPluginContentIframe(plugin.path, `window.pluginContentType = 'tab';`, 'tabContentIframe');
                        await this.evalPluginContentIframe(plugin.path, `window.pluginMessageOriginPath = '${plugin.path}';`, 'tabContentIframe');
                    }


                }
            }

            this._pluginsRuntime[plugin.path] = pluginRuntime;
        }
    }


    /**
     * Sends message to UI plugin iframe
     * @param modulePath
     * @param message
     * @returns {Promise<void>}
     */
    async sendPluginContentIframeMessage(modulePath, message, target = 'tabContentIframe') {
        if(this._pluginsRuntime[modulePath]) {
            if(this._pluginsRuntime[modulePath][target]) {
                this._pluginsRuntime[modulePath][target].contentWindow.postMessage(message, '*')
            } else {
                throw new Error('Content iframe not initialized');
            }
        } else {
            throw new Error('Plugin not found');
        }
    }

    /**
     * Evals code in UI plugin iframe
     * @param modulePath
     * @param code
     * @returns {Promise<void>}
     */
    async evalPluginContentIframe(modulePath, code, target = 'tabContentIframe') {
        await this.sendPluginContentIframeMessage(modulePath, {type: 'eval', code}, target);
    }
}

export default PluginManager;