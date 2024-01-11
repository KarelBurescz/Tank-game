import { ModelObject } from "./modelobject.js";

class Tree extends ModelObject{
    constructor (game, x, y, width, height, hp) {
        super(game, x, y, width, height, hp)
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.ctx = game.ctx;
        this.game = game;
        this.hp = hp;

        this.type = "tree";
    }

    collisionBox() {
        return {
            x: this.x - this.width,
            y: this.y - this.width,
            w: this.width * 2,
            h: this.width * 2
        }

    }
}

export { Tree };