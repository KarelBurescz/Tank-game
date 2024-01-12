import { ModelObject } from "./modelobject.js";

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
    const x = Math.floor(Math.random() * 5000);
    const y = Math.floor(Math.random() * 5000);
    return new Solider(game, x, y, 51, 50, 180, 1, 180, 100);
  }

  /**
   * Constructs a new Solider instance.
   * @param {Object} game - The roomRuntime instance this solider is part of.
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

    this.ssp = {
      ...this.ssp,
      direction: direction,
      speed: speed,
      gunDirection: 0,
      turretSpeed: 0.03,
      bulletsLoaded: 5,
      speedBoostCouter: 200,
      explodingSequence: 0,
      coolingDown: false,
      exploding: false,
      playerDead: false,
      type: "player",
    }

    /* Properties that will be updated from the client's controller */
    this.csp = {
      movingFoward: false,
      movingBack: false,
      speedBoost: false,
      rotatingRight: false,
      rotatingLeft: false,
      turretMovingRight: false,
      turretMovingLeft: false,
      focusMode: false,
      mineDeploying:false,
    }

  }

  collisionBox() {
    return {
      x: this.ssp.x - this.ssp.width / 2,
      y: this.ssp.y - this.ssp.height / 2,
      w: this.ssp.width,
      h: this.ssp.height,
    };
  }

  center() {
    return {
      x: this.ssp.x,
      y: this.ssp.y,
    };
  }

  moveFront(dir = 1) {
    console.log("Moving front!!")
    const oldX = this.ssp.x;
    const oldY = this.ssp.y;

    let speed = this.ssp.speed;

    if (this.ssp.speedBoost) {
      speed += 1;
      this.ssp.speedBoostCouter--;
    }

    if (this.ssp.speedBoostCouter <= 0) {
      speed = 0;

      if (this.ssp.coolingDown === false) {
        setTimeout(() => {
          this.ssp.speedBoostCouter = 200;
          this.ssp.coolingDown = false;
        }, 2000);
      }

      this.ssp.coolingDown = true;
    }

    this.ssp.x += dir * Math.cos(this.ssp.direction) * speed;
    this.ssp.y += dir * Math.sin(this.ssp.direction) * speed;

    let collide = false;
    //TODO: Fix this, this is not available on the server for now.
    this.game.objects.forEach((obj) => {
      if (obj === this) return;
      if (this.collides(obj)) {
        collide = true;
      }
    });
    if (collide === true) {
      this.ssp.x = oldX;
      this.ssp.y = oldY;
      console.log("collide");
    }

    //TODO: This has nothing to do here, it should be drawn on draw(), based of if tank is moving front.
    //this.drawTracks(oldX, oldY);
  }

  moveBack() {
    this.moveFront(-1);
  }

  deployMine() {
    let myMine = new LandMine(this.game, this.ssp.x, this.ssp.y, 20, 20, 10, 100, this);
    this.csp.mineDeploying = false;
    //TODO: Fix this, UiOBjects is not available.
    UiObjects.unshift(myMine);
  }

  fire() {
    if (this.ssp.playerDead) {
      return;
    }
    if (this.ssp.bulletsLoaded < 1) {
      // this.audioEmptyGunShot.play();
      return;
    }

    let myBullet = new Bullet(
      this.game,
      this.ssp.x,
      this.ssp.y,
      8,
      8,
      5,
      this.ssp.direction + this.ssp.gunDirection,
      20,
      this
    );

    this.ssp.bulletsLoaded--;

    if (this.ssp.bulletsLoaded < 1) {
      setTimeout(() => {
        // this.audioReloading.play();
        this.ssp.bulletsLoaded = 5;
      }, 3000);
    }

    UiObjects.push(myBullet);
  }

  explode() {
    if (this.ssp.exploding) return;
    this.ssp.exploding = true;
    this.ssp.playerDead = true;
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
    if (this.csp.mineDeploying === true) {
      this.deployMine();
    }

    if (this.csp.movingFoward === true) {
      this.moveFront();
    }
    if (this.csp.movingBack === true) {
      this.moveBack();
    }
    if (this.csp.rotatingRight === true) {
      this.direction += (this.speed * Math.PI) / 120;
    }
    if (this.csp.rotatingLeft === true) {
      this.direction -= (this.speed * Math.PI) / 120;
    }
    let ts = this.ssp.turretSpeed;

    if (this.csp.focusMode === true) {
      ts = ts * 0.3;
    }
    if (this.csp.turretMovingLeft) {
      this.gunDirection -= ts;
    }
    if (this.csp.turretMovingRight) {
      this.gunDirection += ts;
    }

    if (this.csp.turretMovingLeft || this.csp.turretMovingRight) {
      //TODO: remove or fix
      // this.audioTurretRotating.play();
    } else {
      //TODO: remove or fix
      // this.audioTurretRotating.pause();
    }
    
    if (
      this.csp.movingFoward ||
      this.csp.movingBack ||
      this.csp.rotatingLeft ||
      this.csp.rotatingRight
      ) {
      //TODO: remove or fix
      // this.audioMoving.play();
    } else {
      //TODO: remove or fix
      // this.audioMoving.pause();
    }

    super.update();
  }
}

export { Solider };
