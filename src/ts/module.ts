// Do not remove this import. If you do Vite will think your styles are dead
// code and not include them in the build output.
import "../styles/style.scss";
import BdTiles from "./apps/BdTiles";

import { moduleId } from "./constants";

Hooks.once("init", async function () {
  console.log(`Initializing ${moduleId}`);
});

Hooks.on("renderTileConfig", (app, html, data) => {
  BdTiles._onRenderTileConfig(app, html, data);
});
