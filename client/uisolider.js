import { UiObject } from "./uiobject.js";
import { Bullet } from "./bullet.js";
import { Config } from "./config.js";
import { UiObjects } from "./arrayuiobjects.js";
import { LandMine } from "./landMine.js";
import { Radar } from "./radar.js";
import { Solider } from "/model/solider.js";

class UiSolider extends UiObject {
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

    this.model = new Solider(game, x, y, width, height, direction, speed, gunDirection, hp);
    
    this.csp = this.model.csp;
    this.ssp = this.model.ssp;

    // this.gunDirection = gunDirection;
    this.image = new Image();
    this.image.src = "tank1.png";
    this.gunImage = new Image();
    this.gunImage.src = "turret.png";
    this.tracksImg = new Image();
    this.tracksImg.src = "tracks.png";

    // this.direction = direction;
    // this.speed = speed;
    // this.movingFoward = false;
    // this.rotatingRight = false;
    // this.movingBack = false;
    // this.rotatingLeft = false;
    // this.bgCtx = game.bgctx;
    // this.gunDirection = 0;
    // this.turretMovingRight = false;
    // this.turretMovingLeft = false;
    // this.turretSpeed = 0.03;
    // this.bulletsLoaded = 5;
    // this.speedBoost = false;
    // this.speedBoostCouter = 200;
    // this.coolingDown = false;
    // this.explodingSequence = 0;
    // this.exploding = false;
    // this.focusMode = false;
    // this.playerDead = false;

    // Mine indicator
    // this.mineDeployed = false;
    // Radar indicator
    // this.radarOn = false;
    // Radar instance

    // Audios :
    this.audioMoving = new Audio();
    this.audioMoving.src = UiSolider.audioMovingSrc.src;
    this.audioTurretRotating = new Audio();
    this.audioTurretRotating.src = UiSolider.audioTurretRotatingSrc.src;
    this.audioReloading = new Audio();
    this.audioReloading.src = UiSolider.audioReloadingSrc.src;
    this.audioEmptyGunShot = new Audio();
    this.audioEmptyGunShot.src = UiSolider.audioEmptyGunShotSrc.src;
    this.audioTankExplode = new Audio();
    this.audioTankExplode.src = UiSolider.audioTankExplodeSrc.src;
    this.audioCoolingDown = new Audio();
    this.audioCoolingDown.src = UiSolider.audioCoolingDownSrc.src;
    this.radar = new Radar(this, 120);
  }

  center() { return this.model.center() }

  draw(camera) {
    let co = this.localCoords(camera);

    camera.ctx.save();
    camera.ctx.translate(co.x, co.y);
    camera.ctx.rotate(this.direction);
    camera.ctx.drawImage(
      this.image,
      -this.ssp.width / 2,
      -this.ssp.height / 2,
      this.ssp.width,
      this.ssp.height
    );
    camera.ctx.restore();

    camera.ctx.save();
    camera.ctx.translate(co.x, co.y);
    camera.ctx.rotate(this.direction + this.gunDirection);
    camera.ctx.drawImage(
      this.gunImage,
      -this.ssp.width / 2,
      -this.ssp.height / 2,
      this.ssp.width,
      this.ssp.height
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

      let px = Math.cos(this.ssp.direction) * 50;
      let py = Math.sin(this.ssp.direction) * 50;

      camera.ctx.beginPath();
      camera.ctx.strokeStyle = "blue";
      camera.ctx.moveTo(co.x, co.y);
      camera.ctx.lineTo(co.x + px, co.y + py);
      camera.ctx.stroke();

      let gx = Math.cos(this.ssp.direction + this.ssp.gunDirection) * 70;
      let gy = Math.sin(this.ssp.direction + this.ssp.gunDirection) * 70;

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
    this.bgCtx.translate(this.ssp.x, this.ssp.y);
    this.bgCtx.rotate(this.ssp.direction);
    this.bgCtx.drawImage(
      this.tracksImg,
      -this.ssp.width / 2,
      -this.ssp.height / 2,
      this.ssp.width - 15,
      this.ssp.height
    );
    this.bgCtx.restore();
  }

  deployMine() {
    let myMine = new LandMine(this.game, this.x, this.y, 20, 20, 10, 100, this);
    this.mineDeployed = false;
    let nevim = UiObjects.unshift(myMine);
    console.log(nevim);
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

export { UiSolider };
