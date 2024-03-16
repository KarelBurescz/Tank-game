"use strict";

import { UiObject } from "./uiobject.js";
import { Bush } from "./model/bush.js";

class UiBush extends UiObject {
  constructor(game, x, y, width, height, hp) {
    super(game, x, y, width, height, hp);
    this.model = new Bush(game, x, y, width, height);
    this.img = new Image();
    this.img.src = "bush.png";
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

export { UiBush };
