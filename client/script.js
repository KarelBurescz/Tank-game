import { UiSolider } from "./uisolider.js";
import { UiObstacle } from "./uiobstacle.js";
import { mouse } from "./mouse.js";
import { Game } from "./game.js";
import { Camera } from "./camera.js";
import { UiTree } from "./uitree.js";
import { Config } from "./config.js";
import { RemoteController } from "./remoteController.js";

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

let myGame = new Game(canvasBackground, backgroundCTX);

let mySolider = new UiSolider(myGame, 2500, 2500, 51, 50, 180, 1, 180, 100);
let mySolider1 = new UiSolider(myGame, 3500, 2440, 51, 50, 360, 1, 360, 100);

//TODO: will fix this later.
Game.addPlayer(mySolider);
Game.addPlayer(mySolider1);

myGame.addObject(mySolider);
myGame.addObject(mySolider1);

/* TODO:  This should be removed and ran on server only */
for (let i = 0; i <= 150; i++) {
  const myX = Math.random() * 5000 + 40;
  const myY = Math.random() * 5000 + 40;

  let myWidth = 30;
  let myHeight = Math.random() * 200 + 70;

  if (Math.random() > 0.5) {
    myWidth = myHeight;
    myHeight = 30;
  }

  const maybeWall = new UiObstacle(myGame, myX, myY, myWidth, myHeight, 100, "");

  const wallCollides = myGame.objects.some((e) => {
    if (e.model.collides(maybeWall.model)) {
      return true;
    }
  });

  if (wallCollides === false) {
    myGame.addObject(maybeWall);
  }
}

for (let j = 0; j <= 150; ++j) {
  const myX = Math.random() * 5000 + 40;
  const myY = Math.random() * 5000 + 40;

  let myHeight = (Math.random() + 1) * 30;

  const maybeTree = new UiTree(myGame, myX, myY, myHeight, 0, 100);

  const treeCollides = myGame.objects.some((e) => {
    if (e.model.collides(maybeTree.model)) {
      return true;
    }
  });

  if (!treeCollides) {
    myGame.addObject(maybeTree);
  }
}

myCamera.setFollowedModel(mySolider.model);
myCamera1.setFollowedModel(mySolider1.model);

myCamera.update();
myCamera1.update();

let rc = new RemoteController(window, mySolider, Config, socket);
rc.registerController(Config);

function handleUiObjects() {
  myGame.objects.forEach(function (o) {
    //TODO: Enable it this later on.
    // o.model.update();
  });

  myCamera.update();
  myCamera1.update();

  myGame.objects.forEach(function (o) {
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
