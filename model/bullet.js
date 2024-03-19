import { ModelObject } from "./modelobject.js";

class Bullet extends ModelObject {
  constructor(game, x, y, width, height, speed, direction, damage, owner, zIndex = 2) {
    super(game, x, y, width, height, 1000, zIndex);

    this.ssp = {
      ...this.ssp,
      damage: damage,
      direction: direction,
      speed: speed,
      type: "bullet",
      movable: true,
    };

    this.owner = owner;
    Object.seal(this);
    Object.seal(this.ssp);
    Object.seal(this.csp);
  }

  collisionBox() {
    let ssp = this.ssp;
    return {
      x: ssp.x - ssp.width / 2,
      y: ssp.y - ssp.height / 2,
      w: ssp.width,
      h: ssp.height,
    };
  }

  update() {
    this.ssp.x += this.ssp.speed * Math.cos(this.ssp.direction);
    this.ssp.y += this.ssp.speed * Math.sin(this.ssp.direction);

    let collide = false;
    let myIndex = undefined;
    this.game.objects.forEach((uiobject, i) => {
      if (uiobject === this) {
        myIndex = i;
        return;
      }

      if (
        this.collides(uiobject) &&
        this.owner !== uiobject &&
        uiobject.ssp.type !== "plant"
      ) {
        collide = true;
        uiobject.receiveHit(this.ssp.damage);
      }
    });

    if (collide === true) {
      this.game.objects.splice(myIndex, 1);
    }
  }
}

export { Bullet };
