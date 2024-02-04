import { ModelObject } from "./modelobject.js";

class Stone extends ModelObject {
  constructor(game, x, y, width, height, hp) {
    super(game, x, y, width, height, hp);
    this.ssp.type = "stone";

    Object.seal(this);
    Object.seal(this.ssp);
    Object.seal(this.csp);
  }
}

export { Stone };