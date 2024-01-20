import { Game } from "./game.js";

class Coumuflage {
  constructor(tank, diameter) {
    this.tank = tank;
    this.diameter = diameter;
  }
  draw(camera, locX, locY) {

    const tankX = this.tank.x;
    const tankY = this.tank.y;
    let r = this.diameter / 2;
    camera.ctx.save();
    camera.ctx.translate(locX, locY);

    camera.ctx.beginPath();
    camera.ctx.moveTo(0, 0);
    camera.ctx.fillStyle = "green";
    camera.ctx.arc(0, 0, 0.8 * r, 0, 2 * Math.PI, true);
    camera.ctx.fill();
  }
  }

  export {Coumuflage};