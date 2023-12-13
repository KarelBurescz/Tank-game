class Camera {

    constructor(x, y, canvas, followedObject) {
        this.x = x;
        this.y = y;
        this.w = canvas.width;
        this.h = canvas.height;
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.followedObject = followedObject;

    }

    update() {
        this.x = this.followedObject.x - this.w / 2;
        this.y = this.followedObject.y - this.h / 2;
        console.log(`Camera: ${this.x}, ${this.y}`)
    }
}

export { Camera }