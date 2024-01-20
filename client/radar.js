import { Game } from "./game.js";
class Radar {
  constructor(tank, diameter) {
    this.tank = tank;
    this.diameter = diameter;
    this.phase = Math.PI / 3;
  }
  draw(camera, locX, locY) {
    // camera.ctx.beginPath();
    // camera.ctx.fillStyle = 'red'
    // camera.ctx.arc(locX, locY, 50, 0, Math.PI / 180, true);
    // camera.ctx.fill();
    // console.log('HAHA 😎')
    const tankX = this.tank.x;
    const tankY = this.tank.y;
    let r = this.diameter / 2;
    camera.ctx.save();
    camera.ctx.translate(locX, locY);

    camera.ctx.beginPath();
    camera.ctx.moveTo(0, 0);
    camera.ctx.fillStyle = "black";
    camera.ctx.arc(0, 0, 0.8 * r, 0, 2 * Math.PI, true);
    camera.ctx.fill();
    // camera.ctx.rotate(direction)

    camera.ctx.lineWidth = 2;
    camera.ctx.strokeStyle = "rgba(0, 255, 0, 0.7)"; // Semi-transparent green
    camera.ctx.moveTo(-r, 0);
    camera.ctx.lineTo(r, 0);
    camera.ctx.stroke();

    camera.ctx.moveTo(0, 0 - r);
    camera.ctx.lineTo(0, r);
    camera.ctx.stroke();

    camera.ctx.restore();

    this.drawLine(camera, locX, locY);

    const ol = this.getOponentsLocation();

    const orl = this.getOponentsRadarLocation(ol, tankX, tankY);
    orl.forEach((el) => {
      if (el.angle > ((360 - 45) * Math.PI) / 180) {
        el.angle -= 2 * Math.PI;
      }
      let tr = 1 - (this.phase - el.angle) / ((45 * Math.PI) / 180);
      tr = tr < 0 ? 0 : tr;
      // console.log(
      //   `phase: ${(this.phase * 180) / Math.PI}, angle: ${
      //     (el.angle * 180) / Math.PI
      //   }, tr: ${tr}`
      // );
      if (el.angle < this.phase && tr > 0) {
        camera.ctx.fillStyle = `rgba(100, 100, 255, ${tr})`;
        camera.ctx.beginPath();
        camera.ctx.arc(locX + el.dx, locY + el.dy, 3, 0, Math.PI * 2);
        camera.ctx.fill();
      }
    });
  }

  drawLine(camera, locX, locY) {
    let r = this.diameter / 2;

    // camera.ctx.strokeStyle = 'red';
    camera.ctx.lineWidth = 1;

    for (let i = 0; i < 45; i++) {
      camera.ctx.save();
      camera.ctx.translate(locX, locY);
      camera.ctx.beginPath();
      camera.ctx.moveTo(0, 0);
      camera.ctx.rotate(this.phase - (i * Math.PI) / 180);
      camera.ctx.strokeStyle = `rgba(0, 255, 0, ${1 - i / 90})`;
      camera.ctx.lineTo(r * 0.8, 0);
      camera.ctx.stroke();
      camera.ctx.restore();
    }
  }

  update() {
    this.phase = this.phase + 0.03;

    if (this.phase > 2 * Math.PI) {
      this.phase = this.phase - 2 * Math.PI;
    }
  }

  getOponentsLocation() {
    return Game.oponents
      .filter((e) => {
        return e !== this.tank;
      })
      .map((p) => {
        return {
          x: p.x,
          y: p.y,
        };
      });
  }

  getOponentsRadarLocation(locations, tankX, tankY) {
    return locations.map((l) => {
      let dx = l.x - tankX;
      let dy = l.y - tankY;
      let angle = Math.atan2(dy, dx);

      dx = (dx * 60) / 5000;
      dy = (dy * 60) / 5000;

      if (angle < 0) {
        angle += Math.PI * 2;
      }

      return {
        dx: dx,
        dy: dy,
        angle: angle,
      };
    });
  }
}

export { Radar };
