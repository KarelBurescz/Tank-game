import { UiObject } from "./uiobject.js";
import { Bullet } from "./bullet.js";
import { Config } from "./config.js";
import { mouse } from "./mouse.js";
import { UiObjects } from "./arrayuiobjects.js";


class Solider extends UiObject {
    constructor(ctx, bgCtx, x, y, width, height, direction, speed, gunDirection, hp) {
        super(ctx, x, y, width, height, hp)
        this.direction = direction;
        this.speed = speed;
        this.gunDirection = gunDirection;
        this.image = new Image()
        this.image.src = 'tank1.png';
        this.gunImage = new Image();
        this.gunImage.src = 'turret.png';
        this.movingFoward = false;
        this.rotatingRight = false;
        this.movingBack = false;
        this.rotatingLeft = false;
        this.bgCtx = bgCtx;
        this.tracksImg = new Image();
        this.tracksImg.src = 'tracks.png'
    }

    collisionBox() {
        return {
            x: this.x - this.width / 2,
            y: this.y - this.height / 2,
            w: this.width,
            h: this.height
        }
    }


    center() {
        return {
            x: this.x,
            y: this.y
        }
    }
    draw() {

        const center = this.center()
        this.ctx.save()
        this.ctx.translate(center.x, center.y)
        this.ctx.rotate(this.direction)
        this.ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height)
        this.ctx.restore()


        this.ctx.save()
        this.ctx.translate(center.x, center.y)
        this.ctx.rotate(this.gunDirection)
        this.ctx.drawImage(
            this.gunImage,
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height,

        )
        this.ctx.restore()

        //Draw a debug geometry: collision box, direction and aim direction.
        if (Config.debug) {
            let cbx = this.collisionBox()
            this.ctx.strokeStyle = 'green'
            this.ctx.strokeRect(cbx.x, cbx.y, cbx.w, cbx.h)

            let px = Math.cos(this.direction) * 50;
            let py = Math.sin(this.direction) * 50;

            this.ctx.beginPath()
            this.ctx.strokeStyle = 'blue'
            this.ctx.moveTo(center.x, center.y)
            this.ctx.lineTo(center.x + px, center.y + py)
            this.ctx.stroke()

            let gx = Math.cos(this.gunDirection) * 70;
            let gy = Math.sin(this.gunDirection) * 70;

            this.ctx.beginPath()
            this.ctx.strokeStyle = 'red'
            this.ctx.moveTo(center.x, center.y)
            this.ctx.lineTo(center.x + gx, center.y + gy)
            this.ctx.stroke()
        }
    }

    moveFront(dir = 1) {
        const oldX = this.x
        const oldY = this.y

        this.x += dir * Math.cos(this.direction) * this.speed;
        this.y += dir * Math.sin(this.direction) * this.speed;

        let collide = false;
        UiObjects.forEach(
            (uiobject) => {
                if (uiobject === this) return;
                if (this.collides(uiobject)) {
                    collide = true;
                }
            }
        )
        if (collide === true) {
            this.x = oldX
            this.y = oldY
            console.log('collide')
        }

        // Draw tracks of tank
        const center = this.center()
        this.bgCtx.save()
        this.bgCtx.translate(center.x, center.y)
        this.bgCtx.rotate(this.direction)
        this.bgCtx.drawImage(this.tracksImg,
            -this.width / 2,
            -this.height / 2,
            this.width - 15,
            this.height)
        this.bgCtx.restore()


    }

    moveBack() {
        this.moveFront(-1);
    }

    fire() {
        let myBullet = new Bullet(
            this.ctx,
            this.x,
            this.y,
            8,
            8,
            10,
            this.gunDirection,
            25, 
            this
        );
        UiObjects.push(myBullet)
    }

    update() {
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;
        this.gunDirection = Math.atan2(-dy, -dx);

        if (this.movingFoward === true) {
            this.moveFront();
        }
        if (this.movingBack === true) {
            this.moveBack();
        }
        if (this.rotatingRight === true) {
            this.direction += this.speed * Math.PI / 180;
        }
        if (this.rotatingLeft === true) {
            this.direction -= this.speed * Math.PI / 180;
        }
    }
}

export { Solider }