import { ModelObject } from "./modelobject.js";

class Tree extends ModelObject{
    constructor (game, x, y, width, height, hp) {
        super(game, x, y, width, height, hp)
        this.ssp.type = "tree";

        Object.seal(this);
        Object.seal(this.ssp);
        Object.seal(this.csp);
    }

    collisionBox() {
        let ssp = this.ssp;
        return {
            x: ssp.x - ssp.width,
            y: ssp.y - ssp.width,
            w: ssp.width * 2,
            h: ssp.width * 2
        }
    }
}

export { Tree };