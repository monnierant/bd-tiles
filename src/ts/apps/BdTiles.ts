import { moduleId } from "../constants";
import { BorderFlag } from "../module";

export default class BdTiles {
  public static async _onRenderTileConfig(
    app: TileConfig,
    html: HTMLElement,
    data: TileConfig.RenderContext
  ) {
    if (!data) return;
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
        borderFlag: borderFlag ?? { size: "0", color: "#ffffff", alpha: 1 },
      }
    );
    html
      .querySelector(`.form-footer`)
      ?.querySelector(`.bd-tiles-tab`)
      ?.remove();
    html.querySelector(`.form-footer`)?.insertAdjacentHTML("beforebegin", form);
  }

  public static async _onDrawTile(tile: Tile) {
    const borderFlag = tile.document.getFlag(
      // @ts-expect-error - moduleId is a valid flag namespace
      moduleId,
      "border"
    ) as BorderFlag | undefined;

    console.log("BdTiles | Draw Tile", tile, borderFlag);

    if (borderFlag?.size && borderFlag.size > 0) {
      const rectangle = ((tile as any).bdTiles_rectangle ??=
        new PIXI.Graphics());

      const width = tile.mesh?.texture?.baseTexture.width ?? 0;
      const height = tile.mesh?.texture?.baseTexture.height ?? 0;
      const size = borderFlag.size / (tile.document.width / width);

      rectangle
        .clear()
        .lineStyle(size, borderFlag.color ?? "#ffffff", 1)
        .drawRect((-1 * width) / 2, (-1 * height) / 2, width, height);

      if (!tile.mesh?.children.includes(rectangle)) {
        tile.mesh?.addChild(rectangle);
      }
    }
  }
}
