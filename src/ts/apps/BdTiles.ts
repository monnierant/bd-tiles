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

    const borderFlag = app.document.getFlag(
      // @ts-expect-error - moduleId is a valid flag namespace
      moduleId,
      "border"
    );

    const form = await renderTemplate(
      "modules/bd-tiles/templates/sheets/tiles/config-tab.hbs",
      {
        moduleId: moduleId,
        tabClass: app.tabGroups.sheet == "bdtiles" ? "tab active" : "tab",
        borderFlag: borderFlag ?? { size: "0", color: "#ffffff" },
      }
    );
    html
      .querySelector(`.form-footer`)
      ?.querySelector(`.bd-tiles-tab`)
      ?.remove();
    html.querySelector(`.form-footer`)?.insertAdjacentHTML("beforebegin", form);
  }
}
