import { ModelObject } from "./modelobject.js";

class Plant extends ModelObject {
  constructor(game, x, y, width, height, hp, color, zIndex = 0) {
    super(game, x, y, width, height, hp, zIndex);
    this.ssp.type = "plant";
  }
}

export { Plant };
