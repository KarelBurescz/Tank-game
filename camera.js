class Camera {

    constructor(x, y, canvas, fog, followedObject) {
        this.x = x;
        this.y = y;
        this.w = canvas.width;
        this.h = canvas.height;
        this.canvas = canvas;
        this.fog = fog;
        this.ctx = this.canvas.getContext('2d');
        this.fogCtx = this.fog.getContext('2d');
        this.followedObject = followedObject;
        this.visibilityRadius = 300;

    }

    update() {
        this.x = this.followedObject.x - this.w / 2;
        this.y = this.followedObject.y - this.h / 2;
    }

    drawFogOfWar() {
        this.fogCtx.fillStyle = 'black';
        this.fogCtx.fillRect(0, 0, fog.width, fog.height);

        // Create a radial gradient
        let gradient = this.ctx.createRadialGradient(this.w/2, this.h/2, 50, this.w/2, this.h/2, this.visibilityRadius);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');  // Fully transparent in the center
        gradient.addColorStop(0.9, 'rgba(0, 0, 0, 1)');  // Fully transparent in the center
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');  // Fully opaque at the edges

        // Apply the gradient
        this.fogCtx.globalCompositeOperation = 'destination-out';
        this.fogCtx.fillStyle = gradient;
        this.fogCtx.beginPath();
        this.fogCtx.arc(
            this.w/2, 
            this.h/2, 
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
        this.drawFogOfWar()
        this.drawHood();
    }

    drawHood() {
        this.fogCtx.beginPath()
        this.fogCtx.fillStyle = 'rgba(1, 255, 50, 1)';
        this.fogCtx.fillRect(5, 5, innerWidth/4, 40)

        this.fogCtx.beginPath();
        this.fogCtx.strokeStyle = 'black';
        this.fogCtx.strokeRect(5, 5, innerWidth/4,40)
    }
}

export { Camera }