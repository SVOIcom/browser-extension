import utils from "./utils.mjs";
import uiUtils from "./ui/uiUtils.mjs";

const PLUGINS_JSON = 'https://svoicom.github.io/scalewallet-plugins/plugins.json';

class PluginManager {
    async init(pluginsJson = PLUGINS_JSON) {
        this.plugins = (await utils.fetchJSON(pluginsJson)).plugins;

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
                pluginRuntime.pluginMenuButton = $('#pluginMenuList').append(appendStr);
                pluginRuntime.menuButtonAction = plugin.menuAction;

                $(pluginRuntime.pluginMenuButton).on('click',async ()=>{
                    if(pluginRuntime.menuButtonAction.page){

                        await uiUtils.navigateUrlAsync("/pluginPage");
                        $('#pluginTitle').text(pluginRuntime.menuButtonAction.page.title);
                    }
                })
            }

            this._pluginsRuntime[plugin.path] = pluginRuntime;
        }
    }
}

export default PluginManager;