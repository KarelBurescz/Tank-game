import { UiObject } from "./uiobject.js";
import { Bullet } from "./bullet.js";
import { Config } from "./config.js";
import { mouse } from "./mouse.js";
import { UiObjects } from "./arrayuiobjects.js";
import { LandMine } from "./landMine.js";
import { Radar } from "./radar.js";

class Solider extends UiObject {
  static {
    this.audioMovingSrc = UiObject.loadAudio("tank-moving1.mp3");

    this.audioTurretRotatingSrc = UiObject.loadAudio("tank-turret-rotate.mp3");

    this.audioReloadingSrc = UiObject.loadAudio("tank-reload.mp3");

    this.audioEmptyGunShotSrc = UiObject.loadAudio("empty-gun-shot.mp3");

    this.audioTankExplodeSrc = UiObject.loadAudio("tank-explode.mp3");

    this.audioCoolingDownSrc = UiObject.loadAudio("tank-cooling-down.mp3");
  }

  constructor(game, x, y, width, height, direction, speed, gunDirection, hp) {
    super(game, x, y, width, height, hp);
    this.direction = direction;
    this.speed = speed;
    // this.gunDirection = gunDirection;
    this.image = new Image();
    this.image.src = "tank1.png";
    this.gunImage = new Image();
    this.gunImage.src = "turret.png";
    this.movingFoward = false;
    this.rotatingRight = false;
    this.movingBack = false;
    this.rotatingLeft = false;
    this.bgCtx = game.bgctx;
    this.tracksImg = new Image();
    this.tracksImg.src = "tracks.png";
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
    // Audios :
    this.audioMoving = new Audio();
    this.audioMoving.src = Solider.audioMovingSrc.src;
    this.audioTurretRotating = new Audio();
    this.audioTurretRotating.src = Solider.audioTurretRotatingSrc.src;
    this.audioReloading = new Audio();
    this.audioReloading.src = Solider.audioReloadingSrc.src;
    this.audioEmptyGunShot = new Audio();
    this.audioEmptyGunShot.src = Solider.audioEmptyGunShotSrc.src;
    this.audioTankExplode = new Audio();
    this.audioTankExplode.src = Solider.audioTankExplodeSrc.src;
    this.audioCoolingDown = new Audio();
    this.audioCoolingDown.src = Solider.audioCoolingDownSrc.src;
    // Mine indicator
    this.mineDeployed = false;
    // Radar indicator
    this.radarOn = false;
    // Radar instance
    this.radar = new Radar(this, 120);
  }

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

  draw(camera) {
    let co = this.localCoords(camera);

    const center = this.center();
    camera.ctx.save();
    camera.ctx.translate(co.x, co.y);
    camera.ctx.rotate(this.direction);
    camera.ctx.drawImage(
      this.image,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    camera.ctx.restore();

    camera.ctx.save();
    camera.ctx.translate(co.x, co.y);
    camera.ctx.rotate(this.direction + this.gunDirection);
    camera.ctx.drawImage(
      this.gunImage,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    camera.ctx.restore();

    if (this.radarOn) {
      this.radar.draw(camera, co.x, co.y);
    }

    //Draw a debug geometry: collision box, direction and aim direction.
    if (Config.debug) {
      let cbx = this.collisionBox();
      camera.ctx.strokeStyle = "green";
      camera.ctx.strokeRect(cbx.x - camera.x, cbx.y - camera.y, cbx.w, cbx.h);

      let px = Math.cos(this.direction) * 50;
      let py = Math.sin(this.direction) * 50;

      camera.ctx.beginPath();
      camera.ctx.strokeStyle = "blue";
      camera.ctx.moveTo(co.x, co.y);
      camera.ctx.lineTo(co.x + px, co.y + py);
      camera.ctx.stroke();

      let gx = Math.cos(this.direction + this.gunDirection) * 70;
      let gy = Math.sin(this.direction + this.gunDirection) * 70;

      camera.ctx.beginPath();
      camera.ctx.strokeStyle = "red";
      camera.ctx.moveTo(co.x, co.y);
      camera.ctx.lineTo(co.x + gx, co.y + gy);
      camera.ctx.stroke();
    }

    if (this.exploding === true) {
      this.drawExplosion(camera);
    }
  }

  drawTracks(x, y) {
    const center = this.center();
    this.bgCtx.save();
    this.bgCtx.translate(this.x, this.y);
    this.bgCtx.rotate(this.direction);
    this.bgCtx.drawImage(
      this.tracksImg,
      -this.width / 2,
      -this.height / 2,
      this.width - 15,
      this.height
    );
    this.bgCtx.restore();
  }

  moveFront(dir = 1) {
    if (this.radarOn) {
      return;
    }

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

    // Draw tracks of tank
    this.drawTracks(oldX, oldY);
  }

  moveBack() {
    this.moveFront(-1);
  }

  deployMine() {
    let myMine = new LandMine(this.game, this.x, this.y, 20, 20, 10, 100, this);
    this.mineDeployed = false;
    let nevim = UiObjects.unshift(myMine);
    console.log(nevim);
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

  drawExplosion(camera) {
    let lc = this.localCoords(camera);
    let explodeImg = new Image();
    explodeImg.src = `./Explode-sequence/explode-sequence${this.explodingSequence}.png`;
    camera.ctx.drawImage(
      explodeImg,
      lc.x - explodeImg.width / 2,
      lc.y - explodeImg.height / 2
    );
  }

  explode() {
    if (this.exploding) return;

    this.exploding = true;
    this.playerDead = true;
    this.audioTankExplode.play();
    let intId = setInterval(() => {
      this.explodingSequence++;
      if (this.explodingSequence > 8) {
        clearInterval(intId);
        this.exploding = false;
        super.explode();
      }
    }, 80);
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

    this.radar.update();
  }
}

export { Solider };
