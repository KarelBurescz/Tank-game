import { UiObject } from "./uiobject.js";
import { Obstacle } from "/model/obstacle.js";
import { Animation } from "./animation.js";

class UiObstacle extends UiObject {
  static {
    if (!this.audioExplodeSrc) {
      this.audioExplodeSrc = new Audio("explosion.mp3");
      this.audioExplodeSrc.preload = "auto";
      this.audioExplodeSrc.load();
    }
  }

  constructor(game, x, y, width, height, hp, color) {
    super(game, x, y, width, height, hp);
    this.model = new Obstacle(game, x, y, width, height, hp, color);

    this.color = color;
    this.wallImg = new Image();
    this.wallImg.src = "walls1.png";

    this.animations = [];

    this.explodingSequence = 0;

    this.exploding = false;
    this.audioExplode = new Audio();
    this.audioExplode.src = UiObstacle.audioExplodeSrc.src;
    this.explodingAnimationObj = undefined;
  }

  draw(camera) {
    let co = this.localCoords(camera);
    let ssp = this.model.ssp;

    // let pt = this.ctx.createPattern(this.wallImg, 'repeat');
    camera.ctx.fillStyle = "#B26336";

    if (this.height > this.width) {
      camera.ctx.save();
      camera.ctx.translate(co.x + ssp.width / 2, co.y + ssp.height / 2);
      camera.ctx.rotate((90 * Math.PI) / 180);
      camera.ctx.fillStyle = "#B26336";
      camera.ctx.fillRect(
        -ssp.height / 2,
        -ssp.width / 2,
        ssp.height,
        ssp.width
      );

      camera.ctx.restore();
    } else {
      camera.ctx.fillRect(co.x, co.y, ssp.width, ssp.height);
    }

    this.animations.forEach((a) => {
      a.draw(camera);
    });

    super.draw(camera);
  }
  
  update() {
    super.update();

    if (this.model.ssp.exploding) {
      //TODO: Create the animation only once!
      if (!this.explodingAnimationObj) {
        this.audioExplode.play();
        this.explodingAnimationObj = new Animation(
          this.model.game,
          this,
          "Explode-sequence",
          "explode-sequence",
          9,
          0,
          0,
          0,
          0,
          250,
          200,
          200,
          1,
          null
        );

        const a2 = new Animation(
          this.model.game,
          this,
          "Explode-sequence",
          "explode-sequence",
          9,
          0,
          0,
          0,
          0,
          250,
          400,
          400,
          1,
          null
        );

        this.animations.push(a2);
        let a2index = this.animations.length - 1;
        this.animations.push(this.explodingAnimationObj);
        let aindex = this.animations.length - 1;

        a2.then = () => {
          this.animations.splice(a2index, 1);
        };
        
        this.explodingAnimationObj.then = () => {
          this.animations.splice(aindex, 1);
        };

        this.explodingAnimationObj.start();
        a2.start();
      }
    }

    this.animations.forEach((a) => a.update());
  }
}

export { UiObstacle };
