import { ModelObject } from "./modelobject.js";

class Tree extends ModelObject {
  constructor(game, x, y, width, height, hp, zIndex = 3) {
    super(game, x, y, width, height, hp, zIndex);
    this.ssp.type = "tree";

    Object.seal(this);
    Object.seal(this.ssp);
    Object.seal(this.csp);
  }

  collisionBox() {
    let ssp = this.ssp;
    return {
      x: ssp.x + ssp.width / 2 - ssp.width / 16,
      y: ssp.y + ssp.width / 2 - ssp.width / 16,
      w: ssp.width / 8,
      h: ssp.width / 8,
    };
  }
}

export { Tree };
