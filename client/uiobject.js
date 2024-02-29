import { Config } from "./config.js";
import { UiObjects } from "./arrayuiobjects.js";
import { ModelObject } from "./model/modelobject.js";

class UiObject {
  static loadAudio(audioFilename) {

    if (!this.audioCache) {
      this.audioCache = {};
    }

    let audio = this.audioCache[audioFilename];

    if (audio === undefined) {
      audio = new Audio(audioFilename);
      audio.preload = "auto";
      audio.load();

      this.audioCache[audioFilename] = audio;
    } else {
      console.log('Cache hit!');
    }

    return audio;
  }

  static {
    console.log('Loading sword-hit');
    this.audioHitSrc = UiObject.loadAudio("sword-hit.mp3");
  }

  constructor(game, x, y, width, height, hp) {
    this.model = new ModelObject(game, x, y, width, height, hp);

    this.audioHit = new Audio();
    this.audioHit.src = UiObject.audioHitSrc.src;
    this.type = "none";
    this.lastPlayedHit = 0;
  }

  update() {
    if (this.model.ssp.hp <= 0) {
      this.explode();
    }
    if (this.model.ssp.numHits > this.lastPlayedHit) {
      for(let i=0; i < this.model.ssp.numHits - this.lastPlayedHit; i++){
        let audioHit = new Audio();
        audioHit.src = UiObject.audioHitSrc.src;
        audioHit.play();
      }
      this.lastPlayedHit = this.model.ssp.numHits;
    }
  }

  explode() {
    const i = UiObjects.indexOf(this);
    if (i !== -1) {
      UiObjects.splice(i, 1);
    }
  }

  draw(camera) {
    if (Config.debug === true) {
      camera.ctx.lineWidth = 1;
      camera.ctx.strokeStyle = "green";

      const cbx = this.model.collisionBox();

      camera.ctx.strokeRect(cbx.x - camera.x, cbx.y - camera.y, cbx.w, cbx.h);
    }
  }

  localCoords(camera) {
    return {
      y: this.model.ssp.y - camera.y,
      x: this.model.ssp.x - camera.x,
    };
  }
}

export { UiObject };
