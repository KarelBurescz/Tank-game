import { UiObject } from "./uiobject.js";
import { UiObjects } from "./arrayuiobjects.js";

class LandMine extends UiObject {
    constructor(game, x, y, width, height, hp, damage, owner) {
        super(game, x, y, width, height, hp)
        this.damage = damage;
        this.owner = owner;
        this.audioExplode = new Audio();
        this.audioExplode.src = LandMine.audioExplodeSrc.src;
        this.type = 'landMine';
    }

    static {
        this.audioExplodeSrc = UiObject.loadAudio('mine-explode.mp3');
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
        if (camera.followedObject !== this.owner) {
            return;
        }

        let lc = this.localCoords(camera);

        camera.ctx.fillStyle = 'red';
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

    update() {
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
            UiObjects.splice(myIndex, 1);
            this.explode();
            this.audioExplode.play();
        }
        super.update();
    }
}

export { LandMine }