import { moduleId } from "../constants";

export default class BdTiles {
  constructor() {}

  public static async _onRenderTileConfig(
    app: TileConfig,
    html: HTMLElement,
    data: TileConfig.RenderContext
  ) {
    console.log("BdTiles | Tile Config Rendered", app, html, data);

    //create new tab
    html.querySelector(`.sheet-tabs`)?.insertAdjacentHTML(
      "beforeend",
      await renderTemplate(
        "modules/bd-tiles/templates/sheets/tiles/tab-selector.hbs",
        {
          active: app.tabGroups.sheet == "bdtiles" ? "active" : "",
        }
      )
    );

    // const size = app.document.getFlag(moduleId, "size") ?? 0;

    const form = await renderTemplate(
      "modules/bd-tiles/templates/sheets/tiles/config-tab.hbs",
      {
        moduleId: moduleId,
        tabClass: app.tabGroups.sheet == "bdtiles" ? "tab active" : "tab",
        size: 0,
      }
    );

    html.querySelector(`.form-footer`)?.insertAdjacentHTML("beforebegin", form);
  }
}
