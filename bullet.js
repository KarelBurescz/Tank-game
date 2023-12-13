import { UiObject } from "./uiobject.js";
import { UiObjects } from "./arrayuiobjects.js";

class Bullet extends UiObject {
    constructor(game, x, y, width, height, speed, direction, damage, owner) {
        super(game, x, y, width, height, 1000)
        this.damage = damage;
        this.direction = direction;
        this.speed = speed;
        this.owner = owner;
        this.audioShooting = new Audio('tank-firing.mp3');
        this.audioShooting.play();
    }

    collisionBox() {
        return {
            x: this.x - this.width / 2,
            y: this.y - this.height / 2,
            w: this.width,
            h: this.height
        }
    }

    draw(camera) {
        let lc = this.localCoords(camera);

        camera.ctx.fillStyle = '#E5B80B';
        camera.ctx.beginPath();
        camera.ctx.arc(
            lc.x,
            lc.y,
            this.width / 2,
            0, Math.PI * 2
        );
        camera.ctx.fill();
        super.draw(camera)
    }
d
    update() {
        this.x += this.speed * Math.cos(this.direction)
        this.y += this.speed * Math.sin(this.direction)

        let collide = false;
        let myIndex = undefined;
        UiObjects.forEach(
            (uiobject, i) => {
                if (uiobject === this) {
                    myIndex = i;
                    return;
                }
                if (this.collides(uiobject) && (this.owner !== uiobject)) {
                    collide = true;
                    uiobject.hp -= this.damage;
                }
            }
        )

        if (collide === true) {
            UiObjects.splice(myIndex, 1)
            this.audioHit.play();
        }
    }
}

export { Bullet }