import { ModelObject } from "./modelobject.js";

class Bush extends ModelObject {
  constructor(game, x, y, width, height, hp, zIndex = 2) {
    super(game, x, y, width, height, hp, zIndex);
    this.zIndex = 1;
    this.ssp.type = "bush";
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

export { Bush };
