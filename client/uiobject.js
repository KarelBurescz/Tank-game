import { Config } from "./config.js";
import { UiObjects } from "./arrayuiobjects.js";
import { ModelObject } from "/model/modelobject.js";

class UiObject {
  static loadAudio(audioFilename) {
    const audio = new Audio(audioFilename);
    audio.preload = "auto";
    audio.load();

    return audio;
  }

  static {
    this.audioHitSrc = UiObject.loadAudio("./sword-hit.mp3");
  }

  constructor(game, x, y, width, height, hp) {
    this.model = new ModelObject(game, x, y, width, height, hp);

    this.audioHit = new Audio();
    this.audioHit.src = UiObject.audioHitSrc.src;
    this.type = "none";
  }

  update() {
    if (this.model.ssp.hp <= 0) {
      this.explode();
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
