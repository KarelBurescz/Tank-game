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
    duration,
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
    this.duration = duration;
    this.width = width;
    this.height = height;
    this.repetitions = repetitions;
    this.then = then;
    this.game = game;
    this.UIobject = UIobject;
    this.numberOfImages = numberOfImages;
    this.imgName = imgName;
    this.num = 0;
    this.updatingFunc = null;
    this.repetitionsCount = 0;
  }

  static loadAssets(folderName, imgName, numberOfImages) {
    for (let num = 0; num < numberOfImages; num++) {
      let imgPath = `${folderName}/${imgName}${num}.png`;
      let image = new Image();
      image.src = imgPath;

      Animation.images[imgPath] = image;
    }
  }

  update() {
    this.x += this.speed * Math.cos(this.direction);
    this.y += this.speed * Math.sin(this.direction);
  }

  timedUpdate() {
    this.num += 1;
    if (this.num >= this.numberOfImages) {
      this.num = 0;
      this.repetitionsCount += 1;
    }
    if (this.repetitions !== -1 && this.repetitionsCount >= this.repetitions) {
      this.num = this.numberOfImages - 1;
      clearInterval(this.updatingFunc);

      if (this.then) this.then();
    }
  }

  start() {
    this.updatingFunc = setInterval(this.timedUpdate.bind(this), this.duration);
  }

  draw(camera) {
    let imgPath = `${this.folderName}/${this.imgName}${this.num}.png`;
    let img = Animation.images[imgPath];
    let co = this.UIobject.localCoords(camera);
    camera.ctx.drawImage(
      img,
      co.x - this.width / 2 + this.dx,
      co.y - this.height / 2 + this.dy,
      this.width,
      this.height
    );
    // console.log(`drawing: ${imgPath} on x:${co.x}  y:${co.y}`);
  }
}

export { Animation };
