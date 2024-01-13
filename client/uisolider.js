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

    // this.gunDirection = gunDirection;
    this.image = new Image();
    this.image.src = "tank1.png";
    this.gunImage = new Image();
    this.gunImage.src = "turret.png";
    this.tracksImg = new Image();
    this.tracksImg.src = "tracks.png";

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
    let ssp = this.model.ssp;

    camera.ctx.save();
    camera.ctx.translate(co.x, co.y);
    camera.ctx.rotate(ssp.direction);
    camera.ctx.drawImage(
      this.image,
      -ssp.width / 2,
      -ssp.height / 2,
      ssp.width,
      ssp.height
    );
    camera.ctx.restore();

    camera.ctx.save();
    camera.ctx.translate(co.x, co.y);
    camera.ctx.rotate(ssp.direction + ssp.gunDirection);
    camera.ctx.drawImage(
      this.gunImage,
      -ssp.width / 2,
      -ssp.height / 2,
      ssp.width,
      ssp.height
    );
    camera.ctx.restore();

    if (this.radarOn) {
      this.radar.draw(camera, co.x, co.y);
    }

    //Draw a debug geometry: collision box, direction and aim direction.
    if (Config.debug) {
      let cbx = this.model.collisionBox();
      camera.ctx.strokeStyle = "green";
      camera.ctx.strokeRect(cbx.x - camera.x, cbx.y - camera.y, cbx.w, cbx.h);

      let px = Math.cos(ssp.direction) * 50;
      let py = Math.sin(ssp.direction) * 50;

      camera.ctx.beginPath();
      camera.ctx.strokeStyle = "blue";
      camera.ctx.moveTo(co.x, co.y);
      camera.ctx.lineTo(co.x + px, co.y + py);
      camera.ctx.stroke();

      let gx = Math.cos(ssp.direction + ssp.gunDirection) * 70;
      let gy = Math.sin(ssp.direction + ssp.gunDirection) * 70;

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
    let ssp = this.model.ssp;
    const center = this.center();
    this.bgCtx.save();
    this.bgCtx.translate(ssp.x, ssp.y);
    this.bgCtx.rotate(ssp.direction);
    this.bgCtx.drawImage(
      this.tracksImg,
      -ssp.width / 2,
      -ssp.height / 2,
      ssp.width - 15,
      ssp.height
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

}

export { UiSolider };