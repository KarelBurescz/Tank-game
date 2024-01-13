import { ModelObject } from "./modelobject.js";

class Bullet extends ModelObject {
    constructor(game, x, y, width, height, speed, direction, damage, owner) {
        super(game, x, y, width, height, 1000)
        
        this.ssp = {
            ...this.ssp,
            damage: damage,
            direction: direction,
            speed: speed,
        }

        this.owner = null;
    }

    collisionBox() {
        return {
            x: this.x - this.width / 2,
            y: this.y - this.height / 2,
            w: this.width,
            h: this.height
        }
    }

    update() {
        this.ssp.x += this.ssp.speed * Math.cos(this.ssp.direction)
        this.ssp.y += this.ssp.speed * Math.sin(this.ssp.direction)

        let collide = false;
        let myIndex = undefined;
        this.game.objects.forEach(
            (uiobject, i) => {
                if (uiobject === this) {
                    myIndex = i;
                    return;
                }
                
                if (this.collides(uiobject) && (this.owner !== uiobject)) {
                    collide = true;
                    uiobject.ssp.hp -= this.ssp.damage;
                }
            }
        )

        if (collide === true) {
            this.game.objects.splice(myIndex, 1)
        }
    }
}

export { Bullet }