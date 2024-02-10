import { ModelObject } from "./modelobject.js";

class Bush extends ModelObject {
  constructor(game, x, y, width, height, hp) {
    super(game, x, y, width, height, hp);
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
