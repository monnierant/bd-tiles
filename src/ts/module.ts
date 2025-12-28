// Do not remove this import. If you do Vite will think your styles are dead
// code and not include them in the build output.
import "../styles/style.scss";
import BdTiles from "./apps/BdTiles";

import { moduleId } from "./constants";

export interface BorderFlag {
  size: number;
  color: string;
  alpha: number;
}

export interface LockRatioFlag {
  lockRatio: boolean;
  ratio: number;
}

declare global {
  interface FlagConfig {
    TileDocument: {
      "bd-tiles": {
        border: BorderFlag;
        ratio: LockRatioFlag;
      };
    };
  }
}

const bdTiles = new BdTiles();

Hooks.once("init", async function () {
  console.log(`Initializing ${moduleId}`);
});

Hooks.on("renderTileConfig", (app, html, data) => {
  bdTiles._onRenderTileConfig(app, html, data);
});

Hooks.on("drawTile", (tile) => {
  bdTiles._onDrawTile(tile);
});

Hooks.on("updateTile", (tile) => {
  bdTiles._onUpdateTile(tile);
  if (tile.object != null) {
    bdTiles._onDrawTile(tile.object);
  }
});
