import { UiObject } from "./uiobject.js";
import { Bullet } from "/model/bullet.js";

class UiBullet extends UiObject {
    constructor(game, x, y, width, height, speed, direction, damage, owner) {
        super(game, x, y, width, height, 1000)
        this.model = new Bullet(game, x, y, width, height, speed, direction, damage, owner);

        this.owner = owner;
        // this.audioShooting = new Audio('tank-firing.mp3');
        // this.audioShooting.play();        
    }

    draw(camera) {
        let lc = this.localCoords(camera);

        camera.ctx.fillStyle = '#E5B80B';
        camera.ctx.beginPath();
        camera.ctx.arc(
            lc.x,
            lc.y,
            this.model.ssp.width / 2,
            0, Math.PI * 2
        );
        camera.ctx.fill();
        super.draw(camera)
    }

}

export { UiBullet }