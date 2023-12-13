import { Config } from "./config.js";
import { UiObjects } from "./arrayuiobjects.js";

class UiObject {
    constructor(game, x, y, width, height, hp) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.ctx = game.ctx;
        this.game = game;
        this.hp = hp;
        this.audioHit = new Audio('sword-hit.mp3')
    }
    update() {
        if(this.hp <= 0){
            this.explode()
        }
    }

    explode(){
        const i = UiObjects.indexOf(this);
        if (i !== -1 ) {
            UiObjects.splice(i, 1);
        }
    }

    collisionBox() {
        return {
            x: this.x,
            y: this.y,
            w: this.width,
            h: this.height
        }

    }

    draw() {


        if (Config.debug === true) {
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = 'green'

            const cbx = this.collisionBox()

            this.ctx.strokeRect(
                cbx.x - this.game.camera.x,
                cbx.y - this.game.camera.y,
                cbx.w,
                cbx.h
            )
        }
    }

    collides(uiobject) {

        const cbx = this.collisionBox();
        const element = uiobject.collisionBox();

        if (cbx.x + cbx.w < element.x) {
            return false;
        }

        if (cbx.x > element.x + element.w) {
            return false;
        }

        if (cbx.y + cbx.h < element.y) {
            return false;
        }

        if (cbx.y > element.y + element.h) {
            return false;
        }

        return true;
    }

    localCoords() {
        return {
            y : this.y - this.game.camera.y,
            x : this.x - this.game.camera.x,
            // x : this.x,
            // y : this.y
    
        }
    }
    
}

export { UiObject }