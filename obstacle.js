import { UiObject } from "./uiobject.js";

class Obstacle extends UiObject {
    constructor(game, x, y, width, height, hp, color) {
        super(game, x, y, width, height, hp)
        this.color = color;
        this.wallImg = new Image();
        this.wallImg.src = 'walls1.png'
        this.explodingSequence = 0;
        this.exploding = false;
        this.audioExplode = new Audio('explosion.mp3')
    }
    draw() {

        let co = this.localCoords();

        let pt = this.ctx.createPattern(this.wallImg, 'repeat');
        this.ctx.fillStyle = pt;
        
        if(this.height > this.width){
            this.ctx.save()
            this.ctx.translate(co.x + this.width/2, co.y + this.height/2)
            this.ctx.rotate(90 * Math.PI / 180)
            this.ctx.fillStyle = pt;
            this.ctx.fillRect(
              -this.height/2, 
              -this.width/2,
              this.height,
              this.width
            )

            this.ctx.restore();
        } else {
            this.ctx.fillRect(co.x, co.y, this.width, this.height);
        }

        if(this.exploding === true){
            this.drawExplosion()
        }

        super.draw()
    }

    drawExplosion(){
        let lc = this.localCoords();
        let explodeImg = new Image();
        explodeImg.src = `./Explode-sequence/explode-sequence${this.explodingSequence}.png`
        this.ctx.drawImage(
            explodeImg, 
            lc.x + this.width/2 - explodeImg.width/2, 
            lc.y + this.height/2 - explodeImg.height/2
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

export { Obstacle }