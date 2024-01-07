class Camera {

    constructor(x, y, canvas, fog, followedObject) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;

        // Mass
        this.m = 2;
        
        // Acceleration
        this.ax = 0;
        this.ay = 0;

        // Honey
        this.M = 0.04;
        // Spring strength
        this.k = 0.002;
        this.w = canvas.width;
        this.h = canvas.height;
        this.canvas = canvas;
        this.fog = fog;
        this.ctx = this.canvas.getContext('2d');
        this.fogCtx = this.fog.getContext('2d');
        this.followedObject = followedObject;
        this.visibilityRadius = 300;
        // this.x = this.followedObject.x - this.w / 2;
        // this.y = this.followedObject.y - this.h / 2;

    }

    setFollowedObj(followedObject) {
        this.followedObject = followedObject;
        this.x = this.followedObject.x - this.w / 2;
        this.y = this.followedObject.y - this.h / 2;
    }

    update() {
        let Lx = this.x + this.w/2 - this.followedObject.x;
        let Ly = this.y + this.h/2 - this.followedObject.y;

        
        this.ax = (-1 * this.k * Lx -this.M * this.vx) / this.m
        this.ay = (-1 * this.k * Ly -this.M * this.vy) / this.m

        this.vx += this.ax;
        this.vy += this.ay;
        
        this.x += this.vx;
        this.y += this.vy;
    }

    drawFogOfWar() {
        this.fogCtx.fillStyle = 'black';
        this.fogCtx.fillRect(0, 0, fog.width, fog.height);

        // Create a radial gradient
        let gradient = this.ctx.createRadialGradient(this.w / 2, this.h / 2, 50, this.w / 2, this.h / 2, this.visibilityRadius);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');  // Fully transparent in the center
        gradient.addColorStop(0.9, 'rgba(0, 0, 0, 1)');  // Fully transparent in the center
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');  // Fully opaque at the edges

        // Apply the gradient
        this.fogCtx.globalCompositeOperation = 'destination-out';
        this.fogCtx.fillStyle = gradient;
        this.fogCtx.beginPath();
        this.fogCtx.arc(
            this.w / 2,
            this.h / 2,
            this.visibilityRadius, 0, Math.PI * 2);
        this.fogCtx.fill();
        this.fogCtx.globalCompositeOperation = 'source-over';
    }

    draw(bgCanvas) {

        this.ctx.clearRect(0, 0, this.w, this.h)

        this.ctx.drawImage(
            bgCanvas,
            //source rectangle:
            this.x,
            this.y,
            this.w,
            this.h,
            //destination rectangle:
            0, 0,
            this.w,
            this.h
        );
        this.drawFogOfWar();
        this.drawHud();
    }

    drawHud() {

        const myWidth = 40;
        const myHeight = 30;

        let myX = 5;
        let myY = 5;

        const lives = this.followedObject.hp / 20;

        for (let i = 0; i < 5; i++) {

            this.fogCtx.beginPath();

            if (i < lives) {
                this.fogCtx.fillStyle = 'rgba(1, 255, 50, 1)';
            } else {
                this.fogCtx.fillStyle = 'rgba(255, 0, 0, 1)';
            }

            this.fogCtx.fillRect(myX, myY, myWidth, myHeight);

            this.fogCtx.strokeRect(myX, myY, myWidth, myHeight);
            this.fogCtx.strokeStyle =  'black';


            myX += myWidth + 3;

        }

        const myWidthB = 40;
        const myHeightB = 30;

        let myXB = 5;
        let myYB = myY + myHeight + 4;

        const speedBoost = this.followedObject.speedBoostCouter / 40;        

        for (let j = 0; j < 5; j++) {

            this.fogCtx.beginPath();

            if (j < speedBoost) {
                this.fogCtx.fillStyle = 'rgba(0, 0, 255, 1)';
            } else {
                this.fogCtx.fillStyle = 'rgba(0, 0, 0, 1)';
            }

            this.fogCtx.fillRect(myXB, myYB, myWidthB, myHeightB);

            this.fogCtx.strokeRect(myXB, myYB, myWidthB, myHeightB);
            this.fogCtx.strokeStyle =  'black';

            myXB += myWidthB + 3;

        }

        const myWidthBu = 40;
        const myHeightBu = 30;

        let myXBu = 5;
        let myYBu = myYB + myHeightB + 4;

        const bulletsLoaded = this.followedObject.bulletsLoaded;

        for (let k = 0; k < 5; k++) {

            this.fogCtx.beginPath();

            if (k < bulletsLoaded) {
                this.fogCtx.fillStyle = 'rgba(	255, 215, 0, 1)';
            } else {
                this.fogCtx.fillStyle = 'rgba(0, 0, 0, 1)';
            }

            this.fogCtx.fillRect(myXBu, myYBu, myWidthBu, myHeightBu);

            this.fogCtx.strokeRect(myXBu, myYBu, myWidthBu, myHeightBu);
            this.fogCtx.strokeStyle =  'black';

            myXBu += myWidthBu + 3;

        }
    }
}

export { Camera }