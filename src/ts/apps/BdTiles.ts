import { moduleId } from "../constants";
import { BorderFlag, LockRatioFlag } from "../module";

export default class BdTiles {
  public async _onRenderTileConfig(
    app: TileConfig,
    html: HTMLElement,
    data: TileConfig.RenderContext,
  ) {
    if (!data) return;
    //create new tab
    html.querySelector(`.sheet-tabs`)?.insertAdjacentHTML(
      "beforeend",
      await renderTemplate(
        "modules/bd-tiles/templates/sheets/tiles/tab-selector.hbs",
        {
          active: app.tabGroups.sheet == "bdtiles" ? "active" : "",
        },
      ),
    );

    const borderFlag = app.document.getFlag(
      // @ts-expect-error - moduleId is a valid flag namespace
      moduleId,
      "border",
    );

    const ratioFlag = app.document.getFlag(
      // @ts-expect-error - moduleId is a valid flag namespace
      moduleId,
      "ratio",
    ) as LockRatioFlag;

    if (ratioFlag === undefined) {
      app.document.setFlag(
        // @ts-expect-error - moduleId is a valid flag namespace
        moduleId,
        "ratio",
        { lockRatio: false, ratio: app.document.width / app.document.height },
      );
    } else {
      if (!ratioFlag.lockRatio) {
        ratioFlag.ratio = app.document.width / app.document.height;
      }

      app.document.setFlag(
        // @ts-expect-error - moduleId is a valid flag namespace
        moduleId,
        "ratio",
        ratioFlag,
      );
    }

    const form = await renderTemplate(
      "modules/bd-tiles/templates/sheets/tiles/config-tab.hbs",
      {
        moduleId: moduleId,
        tabClass: app.tabGroups.sheet == "bdtiles" ? "tab active" : "tab",
        borderFlag: borderFlag ?? { size: "0", color: "#ffffff", alpha: 1 },
        ratioFlag: ratioFlag ?? {
          lockRatio: false,
          ratio: app.document.width / app.document.height,
        },
        tile: app.document,
      },
    );
    html
      .querySelector(`.form-footer`)
      ?.querySelector(`.bd-tiles-tab`)
      ?.remove();
    html.querySelector(`.form-footer`)?.insertAdjacentHTML("beforebegin", form);

    $(html).on("click", ".bdtiles-reset-ratio", this.resetRatio.bind(this));
  }

  public resetRatio(event: JQuery.ClickEvent) {
    const tile = canvas?.tiles?.get(event.currentTarget.dataset.tileid ?? "");

    if (!tile) return;

    const ratioFlag = tile.document.getFlag(
      // @ts-expect-error - moduleId is a valid flag namespace
      moduleId,
      "ratio",
    ) as LockRatioFlag;

    ratioFlag.ratio =
      (tile.mesh?.texture?.baseTexture?.width ?? 0) /
      (tile.mesh?.texture?.baseTexture?.height ?? 1);

    tile.document.setFlag(
      // @ts-expect-error - moduleId is a valid flag namespace
      moduleId,
      "ratio",
      ratioFlag,
    );

    if (tile.width >= tile.height) {
      tile.height = tile.width / ratioFlag.ratio;
    } else {
      tile.width = tile.height * ratioFlag.ratio;
    }
  }

  public _onDrawTile(tile: Tile) {
    const borderFlag = tile.document.getFlag(
      // @ts-expect-error - moduleId is a valid flag namespace
      moduleId,
      "border",
    ) as BorderFlag | undefined;

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

  public _onUpdateTile(tile: TileDocument) {
    const ratioFlag = tile.getFlag(
      // @ts-expect-error - moduleId is a valid flag namespace
      moduleId,
      "ratio",
    ) as LockRatioFlag;

    if (!ratioFlag?.lockRatio) return;

    console.log("BdTiles | Adjusting tile ratio", tile, ratioFlag);

    if (tile.width >= tile.height) {
      tile.height = tile.width / ratioFlag.ratio;
    } else {
      tile.width = tile.height * ratioFlag.ratio;
    }
  }
}
