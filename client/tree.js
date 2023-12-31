import { UiObject } from "./uiobject.js";


class Tree extends UiObject{
    constructor (game, x, y, width, height, hp) {
        super(game, x, y, width, height, hp)
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.ctx = game.ctx;
        this.game = game;
        this.hp = hp;
    }

    draw(camera) {

        let co = this.localCoords(camera);

        camera.ctx.beginPath();
        camera.ctx.arc(co.x, co.y, this.width, 0, 2 * Math.PI);
        camera.ctx.fillStyle = '#2a7e19';
        camera.ctx.fill()

        // this.ctx.arc(this.x, this.y, 50, 0, 0)
        // this.ctx.fillStyle = '#2a7e19'
        super.draw(camera)
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