import { ModelObject } from "./modelobject.js";

class Stone extends ModelObject {
  constructor(game, x, y, width, height, hp, zIndex = 2, version = 0) {
    super(game, x, y, width, height, hp, zIndex);
    this.ssp.zIndex = zIndex;
    this.ssp.version = version % 3;
    this.ssp.type = "stone";
    // this.img = new Image();
    // img.src = `../../client/stone${version}.png`;
  }

  collisionBox() {
    let ssp = this.ssp;
    return {
      x: ssp.x,
      y: ssp.y,
      w: ssp.width,
      h: ssp.height,
      // w: this.img.width,
      // h: this.img.height
    };
  }
}

export { Stone };