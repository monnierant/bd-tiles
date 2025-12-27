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

declare global {
  interface FlagConfig {
    TileDocument: {
      "bd-tiles": {
        border: BorderFlag;
      };
    };
  }
}

Hooks.once("init", async function () {
  console.log(`Initializing ${moduleId}`);
});

Hooks.on("renderTileConfig", (app, html, data) => {
  BdTiles._onRenderTileConfig(app, html, data);
});

Hooks.on("drawTile", (tile) => {
  BdTiles._onDrawTile(tile);
});

Hooks.on("updateTile", (tile) => {
  if (tile.object != null) {
    BdTiles._onDrawTile(tile.object);
  }
});
