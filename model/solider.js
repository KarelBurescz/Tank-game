import { ModelObject } from "./modelobject.js";
import { Config } from "../server/config.js";

/**
 * @define { ModelObject } Solider
 * @property { String } playerId - An identifier of a player connected. It should be his socket ID on a server side.
 *
 */

class Solider extends ModelObject {
  /**
   * Represents a solider in the game, extending ModelObject.
   * @extends ModelObject
   */

  /**
   * Creates a Solider object at a random position.
   * @param {Object} game - The game instance this solider is part of.
   * @returns {Solider} A new Solider instance.
   */
  static CreateOnRandomPosition(game) {
    //TODO: Read the max values for coordinates from a config file.
    const x = Math.random() * 5000;
    const y = Math.random() * 5000;
    return new Solider(game, x, y, 51, 50, 180, 1, 180, 100);
  }

  /**
   * Constructs a new Solider instance.
   * @param {Object} game - The game instance this solider is part of.
   * @param {number} x - The x-coordinate of the solider.
   * @param {number} y - The y-coordinate of the solider.
   * @param {number} width - The width of the solider.
   * @param {number} height - The height of the solider.
   * @param {number} direction - The initial direction of the solider.
   * @param {number} speed - The speed of the solider.
   * @param {number} gunDirection - The initial gun direction of the solider.
   * @param {number} hp - The health points of the solider.
   */
  constructor(game, x, y, width, height, direction, speed, gunDirection, hp) {
    super(game, x, y, width, height, hp);
    this.playerSocketId = null;
    this.direction = direction;
    this.speed = speed;
    this.movingFoward = false;
    this.rotatingRight = false;
    this.movingBack = false;
    this.rotatingLeft = false;
    this.gunDirection = 0;
    this.turretMovingRight = false;
    this.turretMovingLeft = false;
    this.turretSpeed = 0.03;
    this.bulletsLoaded = 5;
    this.speedBoost = false;
    this.speedBoostCouter = 200;
    this.coolingDown = false;
    this.explodingSequence = 0;
    this.exploding = false;
    this.focusMode = false;
    this.playerDead = false;
    this.mineDeployed = false;
  }

  /**
   * Provides a representation of the object data for sending over network.
   * @returns {String} A string representing the serialized object.
   */
  serialize() {}

  collisionBox() {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2,
      w: this.width,
      h: this.height,
    };
  }

  center() {
    return {
      x: this.x,
      y: this.y,
    };
  }

  moveFront(dir = 1) {
    const oldX = this.x;
    const oldY = this.y;

    let speed = this.speed;

    if (this.speedBoost) {
      speed += 1;
      this.speedBoostCouter--;
    }

    if (this.speedBoostCouter <= 0) {
      speed = 0;
      this.audioCoolingDown.play();

      if (this.coolingDown === false) {
        setTimeout(() => {
          this.speedBoostCouter = 200;
          this.coolingDown = false;
          this.audioMoving.pause();
          this.audioCoolingDown.pause();
        }, 2000);
      }

      this.coolingDown = true;
    }

    this.x += dir * Math.cos(this.direction) * speed;
    this.y += dir * Math.sin(this.direction) * speed;

    let collide = false;
    //TODO: Fix this, this is not available on the server for now.
    UiObjects.forEach((uiobject) => {
      if (uiobject === this) return;
      if (this.collides(uiobject)) {
        collide = true;
      }
    });
    if (collide === true) {
      this.x = oldX;
      this.y = oldY;
      console.log("collide");
    }

    //TODO: This has nothing to do here, it should be drawn on draw(), based of if tank is moving front.
    //this.drawTracks(oldX, oldY);
  }

  moveBack() {
    this.moveFront(-1);
  }

  deployMine() {
    let myMine = new LandMine(this.game, this.x, this.y, 20, 20, 10, 100, this);
    this.mineDeployed = false;
    //TODO: Fix this, UiOBjects is not available.
    UiObjects.unshift(myMine);
  }

  fire() {
    if (this.playerDead) {
      return;
    }
    if (this.bulletsLoaded < 1) {
      this.audioEmptyGunShot.play();
      return;
    }

    let myBullet = new Bullet(
      this.game,
      this.x,
      this.y,
      8,
      8,
      5,
      this.direction + this.gunDirection,
      20,
      this
    );

    this.bulletsLoaded--;

    if (this.bulletsLoaded < 1) {
      setTimeout(() => {
        this.audioReloading.play();
        this.bulletsLoaded = 5;
      }, 3000);
    }

    UiObjects.push(myBullet);
  }

  explode() {
    if (this.exploding) return;
    this.exploding = true;
    this.playerDead = true;
  }

  collides(uiobject) {
    if (uiobject.type === "landMine") {
      return false;
    }
    return super.collides(uiobject);
  }

  update() {
    // let dx = this.x - mouse.x;
    // let dy = this.y - mouse.y;
    // this.gunDirection = Math.atan2(-dy, -dx);
    if (this.mineDeployed === true) {
      this.deployMine();
    }

    if (this.movingFoward === true) {
      this.moveFront();
    }
    if (this.movingBack === true) {
      this.moveBack();
    }
    if (this.rotatingRight === true) {
      this.direction += (this.speed * Math.PI) / 120;
    }
    if (this.rotatingLeft === true) {
      this.direction -= (this.speed * Math.PI) / 120;
    }
    let ts = this.turretSpeed;

    if (this.focusMode === true) {
      ts = ts * 0.3;
    }
    if (this.turretMovingLeft) {
      this.gunDirection -= ts;
    }
    if (this.turretMovingRight) {
      this.gunDirection += ts;
    }

    if (this.turretMovingLeft || this.turretMovingRight) {
      this.audioTurretRotating.play();
    } else {
      this.audioTurretRotating.pause();
    }

    if (
      this.movingFoward ||
      this.movingBack ||
      this.rotatingLeft ||
      this.rotatingRight
    ) {
      this.audioMoving.play();
    } else {
      this.audioMoving.pause();
    }

    super.update();
  }
}

export { Solider };
