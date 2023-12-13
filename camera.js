class Camera {

    constructor (x, y, w, h, followedObject) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.followedObject = followedObject;

    }

    update() {
        this.x = this.followedObject.x - this.w/2;
        this.y = this.followedObject.y - this.h/2;
        console.log(`Camera: ${this.x}, ${this.y}`)
    }
}

export { Camera }