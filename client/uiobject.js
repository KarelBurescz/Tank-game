import { Config } from "./config.js";
import { UiObjects } from "./arrayuiobjects.js";

class UiObject {

    static loadAudio(audioFilename) {
        const audio = new Audio(audioFilename);
        audio.preload = 'auto';
        audio.load();

        return audio;
    }

    static {
        this.audioHitSrc = UiObject.loadAudio('./sword-hit.mp3');
    }

    constructor(game, x, y, width, height, hp) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.ctx = game.ctx;
        this.game = game;
        this.hp = hp;
        this.audioHit = new Audio();
        this.audioHit.src = UiObject.audioHitSrc.src;
        this.type = 'none';
    }

    update() {
        if (this.hp <= 0) {
            this.explode()
        }
    }

    explode() {
        const i = UiObjects.indexOf(this);
        if (i !== -1) {
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

    draw(camera) {


        if (Config.debug === true) {
            camera.ctx.lineWidth = 1;
            camera.ctx.strokeStyle = 'green'

            const cbx = this.collisionBox()

            camera.ctx.strokeRect(
                cbx.x - camera.x,
                cbx.y - camera.y,
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

    localCoords(camera) {
        return {
            y: this.y -
                camera.y,
            x: this.x -
                camera.x,
            // x : this.x,
            // y : this.y

        }
    }

}

export { UiObject }