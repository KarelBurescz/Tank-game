"use strict";

const getRandomSpeed = () => Math.random() * 2 + 2;
const getRandomPositionX = () => Math.random() * canvas.width;
const getRandomPositionY = () => Math.random() * canvas.height;
function getRandomSize() {
  const sizesW = [200, 150];
  const sizesH = [150, 100];

  let randomPos = Math.trunc(Math.random() * 3);

  let randomW = sizesW[randomPos];
  let randomH = sizesH[randomPos];

  return { width: randomW, height: randomH };
}

class Clouds {
  constructor(x, y, speed, width, height) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.width = width;
    this.height = height;
    this.image = new Image();
    this.image.src = "cloud.png";
  }

  draw() {
    ctx.beginPath();
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  update() {
    this.x += this.speed;

    if (this.x > canvas.width) {
      this.y = getRandomPositionY();
      this.x = -this.width;
    }
  }
}

function makeClouds(numOfClouds) {
  const myClouds = [];
  for (let i = 0; i < numOfClouds; i++) {
    const { width, height } = getRandomSize();
    myClouds.push(
      new Clouds(
        getRandomPositionX(),
        getRandomPositionY(),
        getRandomSpeed(),
        width,
        height
      )
    );
  }
  return myClouds;
}

const clouds = makeClouds(10);

function animate() {
  ctx.fillStyle = "rgba(60, 142, 214, 0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const cloud of clouds) {
    cloud.draw();
    cloud.update();
  }

  requestAnimationFrame(animate);
}

animate();
