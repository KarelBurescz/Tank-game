import { UiObject } from "./uiobject.js";
import { Tree } from "/model/tree.js";

class UiTree extends UiObject{
    constructor (game, x, y, width, height, hp) {
        super(game, x, y, width, height, hp)
        this.model = new Tree(game, x, y, width, height);

        this.ssp = this.model.ssp;
        this.csp = this.model.csp;
    }

    draw(camera) {

        let co = this.localCoords(camera);

        camera.ctx.beginPath();
        camera.ctx.arc(co.x, co.y, this.ssp.width, 0, 2 * Math.PI);
        camera.ctx.fillStyle = '#2a7e19';
        camera.ctx.fill()

        super.draw(camera)
    }
}

export { UiTree };