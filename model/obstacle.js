import { ModelObject } from "./modelobject.js";

class Obstacle extends ModelObject {

    constructor(game, x, y, width, height, hp, color) {
        super(game, x, y, width, height, hp);
        this.type = "obstacle";
    }
}

export { Obstacle }