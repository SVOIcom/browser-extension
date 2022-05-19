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
                        contentIframe.onload = async ()=>{

                            //Allow emulation in frame
                            await this.evalPluginContentIframe(plugin.path, `_everscaleWalletConfig = {EVERWalletEmulation: true};`);

                            //Configure iframe
                            await this.evalPluginContentIframe(plugin.path, `document.documentElement.style.setProperty('--darkmode', '${String(app.darkTheme)}');`);
                            await this.evalPluginContentIframe(plugin.path, `window.darkMode = ${String(app.darkTheme)};`);
                        }



                    }
                })
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

    /**
     * Evals code in UI plugin iframe
     * @param modulePath
     * @param code
     * @returns {Promise<void>}
     */
    async evalPluginContentIframe(modulePath, code) {
        await this.sendPluginContentIframeMessage(modulePath, {type: 'eval', code})
    }
}

export default PluginManager;