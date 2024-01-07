import { Solider } from "./solider.js";
import { Obstacle } from "../obstacle.js";
import { mouse } from "../mouse.js";
import { UiObjects } from "../arrayuiobjects.js";
import { Game } from "../game.js";
import { Camera } from "../camera.js";
import { Tree } from "../tree.js";
import { Config } from "../config.js";

const socket = io();
socket.emit("join-room", "war-room-1");

const canvas = document.getElementById("canvas");
// const ctx = canvas.getContext('2d');

const canvas1 = document.getElementById("canvas1");
// const ctx1 = canvas1.getContext('2d')

const fogCanvas = document.getElementById("fog");
const fog1Canvas = document.getElementById("fog1");

// const fogContext = fogCanvas.getContext('2d')

const canvasBackground = document.getElementById("canvas-background");
const backgroundCTX = canvasBackground.getContext("2d");

canvas.width = window.innerWidth / 2;
canvas.height = window.innerHeight;

canvas1.width = window.innerWidth / 2;
canvas1.height = window.innerHeight;

fogCanvas.width = canvas.width;
fogCanvas.height = canvas.height;

fog1Canvas.width = canvas1.width;
fog1Canvas.height = canvas1.height;

canvasBackground.width = 5000;
canvasBackground.height = 5000;

canvas.addEventListener("mousemove", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth / 2;
  canvas.height = window.innerHeight;
  canvas1.width = window.innerWidth / 2;
  canvas1.height = window.innerHeight;
  myCamera.w = canvas.width / 2;
  myCamera.h = canvas.height;
  myCamera1.w = canvas1.width / 2;
  myCamera1.h = canvas1.height;
  canvasBackground.width = window.innerWidth;
  canvasBackground.height = window.innerHeight;
  fogCanvas.width = canvas.width;
  fogCanvas.height = canvas.height;
  fog1Canvas.width = canvas.width;
  fog1Canvas.height = canvas.height;
});

let myCamera = new Camera(0, 0, canvas, fogCanvas, null);
let myCamera1 = new Camera(0, 0, canvas1, fog1Canvas, null);

// TODO: This needs to be added to an update function, to construct the objects based on state received from the server.

let myGame = new Game(canvasBackground, backgroundCTX, UiObjects);

let mySolider = new Solider(myGame, 2600, 2400, 51, 50, 180, 1, 180, 100);
let mySolider1 = new Solider(myGame, 2800, 2850, 51, 50, 360, 1, 360, 100);

UiObjects.push(mySolider);
UiObjects.push(mySolider1);

for (let i = 0; i <= 150; i++) {
  const myX = Math.random() * 5000 + 40;
  const myY = Math.random() * 5000 + 40;

  let myWidth = 30;
  let myHeight = Math.random() * 200 + 70;

  if (Math.random() > 0.5) {
    myWidth = myHeight;
    myHeight = 30;
  }

  const maybeWall = new Obstacle(myGame, myX, myY, myWidth, myHeight, 100, "");

  const wallCollides = UiObjects.some((e) => {
    if (e.collides(maybeWall)) {
      return true;
    }
  });

  if (wallCollides === false) {
    UiObjects.push(maybeWall);
  }
}

for (let j = 0; j <= 150; ++j) {
  const myX = Math.random() * 5000 + 40;
  const myY = Math.random() * 5000 + 40;

  let myHeight = (Math.random() + 1) * 30;

  const maybeTree = new Tree(myGame, myX, myY, myHeight, 0, 100);

  const treeCollides = UiObjects.some((e) => {
    if (e.collides(maybeTree)) {
      return true;
    }
  });

  if (!treeCollides) {
    UiObjects.push(maybeTree);
  }
}

myCamera.followedObject = mySolider;
myCamera1.followedObject = mySolider1;

myCamera.update();
myCamera1.update();

window.addEventListener("keydown", function (e) {
  if (e.key === Config.p1.forward) {
    mySolider.movingFoward = true;
  } else if (e.key === Config.p1.right) {
    mySolider.rotatingRight = true;
  } else if (e.key === Config.p1.left) {
    mySolider.rotatingLeft = true;
  } else if (e.key === Config.p1.backward) {
    mySolider.movingBack = true;
  } else if (e.key === Config.p1.turret_left) {
    mySolider.turretMovingLeft = true;
  } else if (e.key === Config.p1.turret_right) {
    mySolider.turretMovingRight = true;
  } else if (e.key === Config.p1.fire) {
    mySolider.fire();
  } else if (e.key === Config.p1.nitro) {
    mySolider.speedBoost = true;
  } else if (e.key === Config.p1.focus) {
    mySolider.focusMode = true;
  } else if (e.key === Config.p1.mineDeploy) {
    mySolider.mineDeployed = true;
  }
});

window.addEventListener("keyup", function (e) {
  if (e.key === Config.p1.forward) {
    mySolider.movingFoward = false;
  } else if (e.key === Config.p1.right) {
    mySolider.rotatingRight = false;
  } else if (e.key === Config.p1.left) {
    mySolider.rotatingLeft = false;
  } else if (e.key === Config.p1.backward) {
    mySolider.movingBack = false;
  } else if (e.key === Config.p1.turret_left) {
    mySolider.turretMovingLeft = false;
  } else if (e.key === Config.p1.turret_right) {
    mySolider.turretMovingRight = false;
  } else if (e.key === Config.p1.nitro) {
    mySolider.speedBoost = false;
  } else if (e.key === Config.p1.focus) {
    mySolider.focusMode = false;
  }
});

window.addEventListener("keydown", function (e) {
  if (e.key === "ArrowUp") {
    mySolider1.movingFoward = true;
  } else if (e.key === "ArrowRight") {
    mySolider1.rotatingRight = true;
  } else if (e.key === "ArrowLeft") {
    mySolider1.rotatingLeft = true;
  } else if (e.key === "ArrowDown") {
    mySolider1.movingBack = true;
  } else if (e.key === "i") {
    mySolider1.turretMovingLeft = true;
  } else if (e.key === "p") {
    mySolider1.turretMovingRight = true;
  } else if (e.key === "j") {
    mySolider1.mineDeployed = true;
  }
});

window.addEventListener("keyup", function (e) {
  if (e.key === "ArrowUp") {
    mySolider1.movingFoward = false;
  } else if (e.key === "ArrowRight") {
    mySolider1.rotatingRight = false;
  } else if (e.key === "ArrowLeft") {
    mySolider1.rotatingLeft = false;
  } else if (e.key === "ArrowDown") {
    mySolider1.movingBack = false;
  } else if (e.key === "i") {
    mySolider1.turretMovingLeft = false;
  } else if (e.key === "p") {
    mySolider1.turretMovingRight = false;
  }
});

window.addEventListener("keydown", function (e) {
  if (e.key === "o") {
    mySolider1.fire();
  }
});

window.addEventListener("keydown", (e) => {
  if (e.key === "l") {
    mySolider1.speedBoost = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key === "l") {
    mySolider1.speedBoost = false;
  }
});

window.addEventListener("keydown", (e) => {
  if (e.key === "k") {
    mySolider1.focusMode = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key === "k") {
    mySolider1.focusMode = false;
  }
});

function handleUiObjects() {
  UiObjects.forEach(function (o) {
    o.update();
  });
  myCamera.update();
  myCamera1.update();

  UiObjects.forEach(function (o) {
    o.draw(myCamera);
    o.draw(myCamera1);
  });
}

myGame.bgctx.fillStyle = "rgba(200,255,90,1)";
myGame.bgctx.fillRect(0, 0, canvasBackground.width, canvasBackground.height);

let counter = 0;
function animate() {
  //Take the background canvas, cut out the area needed for the
  //camera, and draw it to the main canvas at position 0,0.

  myCamera.draw(myGame.bgcanvas);
  myCamera1.draw(myGame.bgcanvas);

  handleUiObjects();

  if (counter > 10) {
    myGame.bgctx.fillStyle = "rgba(200,255,90,0.05)";
    myGame.bgctx.fillRect(0, 0, myGame.bgcanvas.width, myGame.bgcanvas.height);

    counter = 0;
  }

  counter++;

  requestAnimationFrame(animate);
}

animate();
