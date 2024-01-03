import { Solider } from "./solider.js";
import { UiObject } from "./uiobject.js";

class Radar {
    constructor(diameter) {
        this.diameter = diameter;
        this.phase = Math.PI / 3;
    };
    draw(camera, locX, locY) {
        // camera.ctx.beginPath();
        // camera.ctx.fillStyle = 'red'
        // camera.ctx.arc(locX, locY, 50, 0, Math.PI / 180, true);
        // camera.ctx.fill();
        // console.log('HAHA 😎')
        let r = this.diameter / 2;
        camera.ctx.save();
        camera.ctx.translate(locX, locY);

        camera.ctx.beginPath();
        camera.ctx.moveTo(0, 0);
        camera.ctx.fillStyle = 'black'
        camera.ctx.arc(0, 0, 0.8 * r, 0, 2 * Math.PI, true);
        camera.ctx.fill();
        // camera.ctx.rotate(direction)

        camera.ctx.lineWidth = 2;
        camera.ctx.strokeStyle = 'rgba(0, 255, 0, 0.7)'; // Semi-transparent green
        camera.ctx.moveTo(- r, 0);
        camera.ctx.lineTo(r, 0);
        camera.ctx.stroke();

        camera.ctx.moveTo(0, 0 - r);
        camera.ctx.lineTo(0, r);
        camera.ctx.stroke();

        camera.ctx.restore();

        this.drawLine(camera, locX, locY);
    }

    drawLine(camera, locX, locY) {
        let r = this.diameter / 2;

        // camera.ctx.strokeStyle = 'red';
        camera.ctx.lineWidth = 1;

        for (let i = 0; i < 90; i++) {
            camera.ctx.save();
            camera.ctx.translate(locX, locY);
            camera.ctx.beginPath();
            camera.ctx.moveTo(0, 0);
            camera.ctx.rotate(this.phase - i * Math.PI / 180);
            camera.ctx.strokeStyle = `rgba(0, 255, 0, ${1 - i / 90})`;
            camera.ctx.lineTo(0, r * 0.8);
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
};

export { Radar };