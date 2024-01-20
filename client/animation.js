class Animation {
  static images = {};

  constructor(
    game,
    UIobject,
    folderName,
    imgName,
    numberOfImages,
    dx,
    dy,
    speed,
    direction,
    width,
    height,
    repetitions,
    then
  ) {
    this.folderName = folderName;
    this.dx = dx;
    this.dy = dy;
    this.speed = speed;
    this.direction = direction;
    this.width = width;
    this.height = height;
    this.then = then;
    this.game = game;
    this.UIobject = UIobject;
    this.numberOfImages = numberOfImages;
    this.imgName = imgName;
  }

  update() {
    //TODO: update animation in time (change image, update position, or end it)
  }

  init() {
    let num = 0;
    this.image = new Image();
    let imgPath = `${this.folderName}/${this.imgName}${num}.png`;
    this.image.src = imgPath;
    console.log(`animuju!`);
    let co = this.UIobject.localCoords(camera);
    let ssp = this.model.ssp;

    camera.ctx.save();
    camera.ctx.translate(co.x, co.y);
    camera.ctx.rotate(ssp.direction);
    camera.ctx.drawImage(
      this.image,
      -ssp.width / 2,
      -ssp.height / 2,
      ssp.width,
      ssp.height
    );
    camera.ctx.restore();
  }

  draw(camera) {
    //TODO: Draw actual image on the camera's canvas.
  }
}

export { Animation };
