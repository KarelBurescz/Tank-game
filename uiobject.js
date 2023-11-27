import { Config } from "./config.js";

class UiObject {
    constructor(ctx, x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.ctx = ctx;
    }
    update() {

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

        // this.ctx.fillStyle = 'rgba(0, 255, 0)'
        // ctx.fillRect(0, 0, canvas.width, canvas.height)

        if (Config.debug === true) {
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = 'green'

            const cbx = this.collisionBox()

            this.ctx.strokeRect(
                cbx.x,
                cbx.y,
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
}

export { UiObject }