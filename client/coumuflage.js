import { Game } from "./game.js";

class Coumuflage {
  constructor(tank, diameter) {
    this.tank = tank;
    this.diameter = diameter;
    this.img = new Image();
    this.img.src = "tree.png";
  }
  draw(camera, locX, locY) {
    const tankX = this.tank.model.ssp.x;
    const tankY = this.tank.model.ssp.y;

    //   let r = this.diameter / 2;
    //   camera.ctx.save();
    //   camera.ctx.translate(locX, locY);

    //   camera.ctx.beginPath();
    //   camera.ctx.moveTo(0, 0);
    //   camera.ctx.fillStyle = "green";
    //   camera.ctx.arc(0, 0, 0.8 * r, 0, 2 * Math.PI, true);
    //   camera.ctx.fill();
    //   camera.ctx.restore();
    // TODO:  repatre it, it's not drawingccc
    camera.ctx.drawImage(this.img, 0, 0, this.diameter, this.diameter);
  }
}

export { Coumuflage };
