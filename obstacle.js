import { UiObject } from "./uiobject.js";

class Obstacle extends UiObject {
    constructor(ctx, x, y, width, height, color) {
        super(ctx, x, y, width, height)
        this.color = color;
    }
    draw() {
        this.ctx.fillStyle = this.color
        this.ctx.beginPath();
        this.ctx.fillRect(this.x, this.y, this.width, this.height)
        super.draw()
    }
}

export { Obstacle }