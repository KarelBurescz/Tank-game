"use strict";

import { UiObject } from "./uiobject.js";
import { Stone } from "./model/stone.js";

class UiStone extends UiObject {
  constructor(game, x, y, width, height, hp) {
    super(game, x, y, width, height, hp);
    this.model = new Stone(game, x, y, width, height);
    this.img = new Image();
    // this.img.src = `stone${this.ssp.version}.png`;
    this.img.src = `stone.png`;
  }

  draw(camera) {
    let co = this.localCoords(camera);
    camera.ctx.drawImage(
      this.img,
      co.x,
      co.y,
      this.model.ssp.width,
      this.model.ssp.width
    );

    super.draw(camera);
  }
}

export { UiStone };
