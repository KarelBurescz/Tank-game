import { ModelObject } from "./modelobject.js";

class Stone extends ModelObject {
  constructor(game, x, y, width, height, hp, zIndex = 2, version = 0) {
    super(game, x, y, width, height, hp, zIndex);
    this.ssp.zIndex = zIndex;
    this.ssp.version = version % 3;
    this.ssp.type = "stone";
  }

  collisionBox() {
    let ssp = this.ssp;
    return {
      x: ssp.x,
      y: ssp.y,
      w: ssp.width,
      h: ssp.width,
    };
  }
}

export { Stone };