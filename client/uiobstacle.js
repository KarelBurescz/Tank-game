import { UiObject } from "./uiobject.js";
import { Obstacle } from "/model/obstacle.js";

class UiObstacle extends UiObject {

    static {
        if (!this.audioExplodeSrc) {
            this.audioExplodeSrc = new Audio('explosion.mp3')
            this.audioExplodeSrc.preload = 'auto'
            this.audioExplodeSrc.load()
        }
    }

    constructor(game, x, y, width, height, hp, color) {
        super(game, x, y, width, height, hp)
        this.model = new Obstacle(game, x, y, width, height, hp, color);

        this.color = color;
        this.wallImg = new Image();
        this.wallImg.src = 'walls1.png'
        this.explodingSequence = 0;
        this.exploding = false;
        this.audioExplode = new Audio();
        this.audioExplode.src = UiObstacle.audioExplodeSrc.src;


    }
    draw(camera) {
        
        let co = this.localCoords(camera);
        let ssp = this.model.ssp;

        // let pt = this.ctx.createPattern(this.wallImg, 'repeat');
        camera.ctx.fillStyle = '#B26336';
        
        if(this.height > this.width){
            camera.ctx.save()
            camera.ctx.translate(co.x + ssp.width/2, co.y + ssp.height/2)
            camera.ctx.rotate(90 * Math.PI / 180)
            camera.ctx.fillStyle = '#B26336';
            camera.ctx.fillRect(
              -ssp.height/2, 
              -ssp.width/2,
              ssp.height,
              ssp.width
            )

            camera.ctx.restore();
        } else {
            camera.ctx.fillRect(co.x, co.y, ssp.width, ssp.height);
        }

        if(this.exploding === true){
            this.drawExplosion(camera)
        }

        super.draw(camera)
    }

    drawExplosion(camera){
        let lc = this.localCoords(camera);
        let explodeImg = new Image();
        explodeImg.src = `./Explode-sequence/explode-sequence${this.explodingSequence}.png`
        camera.ctx.drawImage(
            explodeImg, 
            lc.x + this.ssp.width/2 - explodeImg.width/2, 
            lc.y + this.ssp.height/2 - explodeImg.height/2
        )
    }

    explode(){

        this.audioExplode.play();

        if (this.exploding) return;

        this.exploding = true;
        let intId = setInterval(() => {
            this.explodingSequence++;
            if(this.explodingSequence > 8){
                clearInterval(intId);
                this.exploding = false;
                super.explode();
            }
        },80);
    }
}

export { UiObstacle }