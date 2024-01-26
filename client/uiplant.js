import { UiObject } from "./uiobject.js";
import { Plant } from "/model/plant.js";
import { Animation } from "./animation.js";

class UiPlant extends UiObject {
  static {
    if (!this.audioExplodeSrc) {
      // this.audioExplodeSrc = new Audio("explosion.mp3");
      // this.audioExplodeSrc.preload = "auto";
      // this.audioExplodeSrc.load();
    }
  }

  constructor(game, x, y, width, height, hp, color) {
    super(game, x, y, width, height, hp);
    this.model = new Plant(game, x, y, width, height, hp, color);

    this.color = color;
    this.img = new Image();
    this.img.src = "plant.png";
    this.explodingSequence = 0;
    this.exploding = false;
    // this.audioExplode = new Audio();
    // this.audioExplode.src = UiObstacle.audioExplodeSrc.src;

    this.animations = [];
    this.explodingAnimationObj = null;

    this.addBubblesAnimation();
  }
  update() {
    this.animations.forEach((a) => a.update());
  }

  addBubblesAnimation() {
    this.explodingAnimationObj = new Animation(
      this.model.game,
      this,
      "Bubbles",
      "bubbles",
      4,
      15,
      15,
      0,
      0,
      200,
      //TODO: Fix this, should be according to ssp properties!
      30,
      30,
      -1,
      null
    );
    this.animations.push(this.explodingAnimationObj);
    let aindex = this.animations.length - 1;
    this.explodingAnimationObj.start();
    // this.explodingAnimationObj.then = () => {
    //   this.animations.splice(aindex, 1);
    // };
  }

  draw(camera) {
    let co = this.localCoords(camera);
    let ssp = this.model.ssp;

    // let pt = this.ctx.createPattern(this.wallImg, 'repeat');
    camera.ctx.fillStyle = "#B26336";

    camera.ctx.drawImage(this.img, co.x, co.y, ssp.width, ssp.height);

    if (this.exploding === true) {
      // this.drawExplosion(camera);
      console.log("Exploding");
    }

    this.animations.forEach((a) => {
      a.draw(camera);
    });
    super.draw(camera);
  }

  // drawExplosion(camera) {
  //   let lc = this.localCoords(camera);
  //   let explodeImg = new Image();
  //   explodeImg.src = `./Explode-sequence/explode-sequence${this.explodingSequence}.png`;
  //   camera.ctx.drawImage(
  //     explodeImg,
  //     lc.x + this.ssp.width / 2 - explodeImg.width / 2,
  //     lc.y + this.ssp.height / 2 - explodeImg.height / 2
  //   );
  // }

  // explode() {
  //   this.audioExplode.play();

  //   if (this.exploding) return;

  //   this.exploding = true;
  //   let intId = setInterval(() => {
  //     this.explodingSequence++;
  //     if (this.explodingSequence > 8) {
  //       clearInterval(intId);
  //       this.exploding = false;
  //       super.explode();
  //     }
  //   }, 80);
  // }
}

export { UiPlant };
