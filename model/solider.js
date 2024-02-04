"use strict";
// import { RoomRuntime } from "../server/roomRuntime.js";
import { ModelObject } from "./modelobject.js";
import { Bullet } from "./bullet.js";

/**
 * Represents a solider in the game, extending ModelObject.
 * @extends ModelObject
 *
 * @property {number} ssp.direction: direction
 * @property {number} ssp.speed: speed
 * @property {number} ssp.gunDirection: direction of the gunTurret
 * @property {number} ssp.turretSpeed: speed of rotating of the turret.
 * @property {number} ssp.bulletsLoaded: number of bullets loaded.
 * @property {number} ssp.speedBoostCouter: how many ticks a speed boost can work
 * @property {number} ssp.explodingSequence: whidh exploding sequence is object on.
 * @property {number} ssp.coolingDown: indicates if object can't move and is cooling down
 * @property {number} ssp.exploding: indicates if object is exploding
 * @property {number} ssp.playerDead: indicates if player is dead
 *
 * @property {boolean} csp.movingFoward
 * @property {boolean} csp.movingBack
 * @property {boolean} csp.speedBoost
 * @property {boolean} csp.rotatingRight
 * @property {boolean} csp.rotatingLeft
 * @property {boolean} csp.turretMovingRight
 * @property {boolean} csp.turretMovingLeft
 * @property {boolean} csp.focusMode
 * @property {boolean} csp.mineDeploying
 * @property {boolean} csp.firing
 */
class Solider extends ModelObject {
  /**
   * Creates a Solider object at a random position.
   * @param {RoomRuntime} game - The game instance this solider is part of.
   * @returns {Solider} A new Solider instance.
   */
  static CreateOnRandomPosition(game) {
    //TODO: Read the max values for coordinates from a config file.
    let margin = 50;
    const x =
      margin +
      Math.floor(Math.random() * (game.config.gameRoom.sizeX - 2 * margin));
    const y =
      margin +
      Math.floor(Math.random() * (game.config.gameRoom.sizeY - 2 * margin));
    return new Solider(
      game,
      x,
      y,
      50,
      50,
      (0 * Math.PI) / 180,
      1,
      (0 * Math.PI) / 180,
      100
    );
  }

  /**
   * Constructs a new Solider instance.
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
      coumuflageOn: false,
      coolingDown: false,
      exploding: false,
      playerDead: false,

      /* necessary for client to do sounds */
      moving: false,
      turretMoving: false,
      bulletsShot: 0,

      type: "player",
    };

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
      mineDeploying: false,
      firing: false,
    };
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
    this.game.objects.forEach((obj) => {
      if (obj === this) return;

      if (
        obj.ssp.type !== "plant" &&
        obj.ssp.type !== "bush" &&
        this.collides(obj)
      ) {
        collide = true;
      } else if (obj.ssp.type === "plant" && this.collides(obj)) {
        obj.explode();
      }
    });

    if (collide === true) {
      this.ssp.x = oldX;
      this.ssp.y = oldY;
    }

    //TODO: This has nothing to do here, it should be drawn on draw(), based of if tank is moving front.
    //this.drawTracks(oldX, oldY);
  }

  moveBack() {
    this.moveFront(-1);
  }

  deployMine() {
    let myMine = new LandMine(
      this.game,
      this.ssp.x,
      this.ssp.y,
      20,
      20,
      10,
      100,
      this
    );
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
    this.ssp.bulletsShot++;

    if (this.ssp.bulletsLoaded < 1) {
      setTimeout(() => {
        // this.audioReloading.play();
        this.ssp.bulletsLoaded = 5;
      }, 3000);
    }

    this.game.objects.push(myBullet);
  }

  explode() {
    if (this.ssp.exploding) return;
    this.ssp.exploding = true;
    this.ssp.playerDead = true;

    setTimeout(
      (() => {
        this.game.removeObject(this.ssp.id);
      }).bind(this),
      2 * 1000
    );

    console.log(`${this.ssp.id} - Exploded!!!`);
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
      this.ssp.direction += (this.ssp.speed * Math.PI) / 120;
    }
    if (this.csp.rotatingLeft === true) {
      this.ssp.direction -= (this.ssp.speed * Math.PI) / 120;
    }
    let ts = this.ssp.turretSpeed;

    this.ssp.moving = 
      (this.csp.movingFoward || this.csp.movingBack || 
       this.csp.rotatingLeft || this.csp.rotatingRight 
      ) ? true: false;

    if (this.csp.focusMode === true) {
      ts = ts * 0.3;
    }
    if (this.csp.turretMovingLeft) {
      this.ssp.gunDirection -= ts;
    }
    if (this.csp.turretMovingRight) {
      this.ssp.gunDirection += ts;
    }

    this.ssp.turretMoving = 
      (this.csp.turretMovingLeft || this.csp.turretMovingRight) 
      ? true : false; 

    if (this.csp.firing) {
      this.fire();
      this.csp.firing = false;
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

    if (this.csp.coumuflageOn) {
      this.ssp.coumuflageOn = true;
    } else this.ssp.coumuflageOn = false;

    super.update();
  }
}

export { Solider };
