import { ModelObject } from "./modelobject.js";

class Plant extends ModelObject {
  constructor(game, x, y, width, height, hp, color) {
    super(game, x, y, width, height, hp);
    this.ssp.type = "plant";
  }
}

export { Plant };
