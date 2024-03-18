import { ModelObject } from "./modelobject.js";

class Obstacle extends ModelObject {

    constructor(game, x, y, width, height, hp, color, zIndex = 0) {
        super(game, x, y, width, height, hp, zIndex);
        this.ssp.type = "obstacle";

        Object.seal(this);
        Object.seal(this.ssp);
        Object.seal(this.csp);
    }

    explode() {
        if (this.ssp.exploding) return;
        this.ssp.exploding = true;
    
        setTimeout(
          (() => {
            this.game.removeObject(this.ssp.id);
          }).bind(this),
          1 * 1000
        );
    
        console.log(`${this.ssp.id} - Obstacle exploded!!!`);
      }

}

export { Obstacle }