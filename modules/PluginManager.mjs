import utils from "./utils.mjs";
import uiUtils from "./ui/uiUtils.mjs";


const PLUGINS_BASE = 'https://plugins.scalewallet.com';

class PluginManager {
    async init(pluginsBase = PLUGINS_BASE) {
        this.pluginsBase = pluginsBase;
        this.plugins = (await utils.fetchJSON(pluginsBase + '/plugins.json')).plugins;

        this._pluginsRuntime = {};

        return this;
    }

    async runUIPlugins() {
        for (let plugin of this.plugins) {
            let pluginRuntime = {};

            if(plugin.menuAction) {
                $('.pluginMenuListHolder').show();
                let appendStr = `<li>
                                        <a href="#" id="${plugin.path}_menuButton" class="item-content colour-change panel-close">
                                            <div class="item-media">${plugin.menuAction.icon ? `<img src="${plugin.menuAction.icon}">` : ''}</div>
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

                        console.log('LOAD', contentSrc, plugin);

                        //Set iframe path
                        contentIframe.src = contentSrc;

                        //Set plugin page title
                        $('#pluginTitle').text(pluginRuntime.menuButtonAction.page.title);

                        //iframe.contentWindow.postMessage({a:123}, '*')


                        //Allow emulation in frame
                        await this.evalPluginContentIframe(plugin.path, `_everscaleWalletConfig = {EVERWalletEmulation: true};`)
                    }
                })
            }

            this._pluginsRuntime[plugin.path] = pluginRuntime;
        }
    }


    async sendPluginContentIframeMessage(modulePath, message) {
        if(this._pluginsRuntime[modulePath]) {
            if(this._pluginsRuntime[modulePath].contentIframe) {
                this._pluginsRuntime[modulePath].contentIframe.contentWindow.postMessage(message, '*')
            } else {
                throw new Error('Content iframe not initialized');
            }
        } else {
            throw new Error('Plugin not found');
        }
    }

    async evalPluginContentIframe(modulePath, code) {
        await this.sendPluginContentIframeMessage(modulePath, {type: 'eval', code})
    }
}

export default PluginManager;