"use strict";

import { UiObject } from "./uiobject.js";
import { Stone } from "./model/stone.js";

class UiStone extends UiObject {
  constructor(game, ssp) {
    super(game, ssp.x, ssp.y, ssp.width, ssp.height, ssp.hp);
    this.model = new Stone(game, ssp.x, ssp.y, ssp.width, ssp.height);
    this.model.ssp = {
      ...ssp,
      fakeh: 11};
    this.img = new Image();
    this.loaded = false;
    this.fakeh = 0;
    
    this.img.onload = (e) => {
      this.model.ssp.width = this.img.width;
      this.model.ssp.height = 19;//this.img.height;
      console.log(`Loading Stone V ${this.model.ssp.version}: ${this.model.ssp.width} x ${this.model.ssp.height}`);
      this.fakeh = 19;
      this.loaded = true;
    }
    this.img.src = `stone${ssp.version}.png`;
  }

  draw(camera) {
    if(!this.loaded) return;
    let co = this.localCoords(camera);
    if (this.model.ssp.version == 2) {
      // debugger;
    }
    camera.ctx.drawImage(
      this.img,
      co.x,
      co.y,
      this.model.ssp.width,
      this.model.ssp.height
    );

    super.draw(camera);
  }
  static fromSSP(game, ssp) {
    const stone = new UiStone(game, ssp);
    return stone;
  }
}

export { UiStone };
