"use strict";

import { UiObject } from "./uiobject.js";
import { Stone } from "./model/stone.js";

class UiStone extends UiObject {
  constructor(game, ssp) {
    super(game, ssp.x, ssp.y, ssp.width, ssp.height, ssp.hp);
    this.model = new Stone(game, ssp.x, ssp.y, ssp.width, ssp.height);
    this.model.ssp = ssp;

    this.img = new Image();
    this.loaded = false;
    
    this.img.onload = (e) => {
      this.model.ssp.width = this.img.width;
      this.model.ssp.height = this.img.height;
      this.loaded = true;
    }
    this.img.src = `stone${ssp.version}.png`;
  }

  draw(camera) {
    if(!this.loaded) return;

    let co = this.localCoords(camera);
    camera.ctx.drawImage(
      this.img,
      co.x,
      co.y,
      this.model.ssp.width,
      this.model.ssp.height
    );

    super.draw(camera);
  }
}

export { UiStone };
