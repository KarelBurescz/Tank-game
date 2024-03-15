"use strict";

import { Game } from "./game.js";
import { Camera } from "./camera.js";
import { UiSolider } from "./uisolider.js";
import { UiObstacle } from "./uiobstacle.js";
import { UiTree } from "./uitree.js";
import { UiPlant } from "./uiplant.js";
import { UiBush } from "./uibush.js";
import { UiBullet } from "./uibullet.js";
import { Config } from "./config.js";
import { RemoteController } from "./remoteController.js";
import { Animation } from "./animation.js";
import { Coumuflage } from "./coumuflage.js";

const socket = io();
socket.emit("join-room", "war-room-1");

const canvas = document.getElementById("canvas");
const fogCanvas = document.getElementById("fog");
const canvasBackground = document.getElementById("canvas-background");
const backgroundCTX = canvasBackground.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

fogCanvas.width = canvas.width;
fogCanvas.height = canvas.height;

canvasBackground.width = 1500;
canvasBackground.height = 1500;

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  myCamera.w = canvas.width;
  myCamera.h = canvas.height;
  canvasBackground.width = window.innerWidth;
  canvasBackground.height = window.innerHeight;
  fogCanvas.width = canvas.width;
  fogCanvas.height = canvas.height;
});

Animation.loadAssets("Explode-sequence", "explode-sequence", 9);
Animation.loadAssets("Bubbles", "bubbles", 4);
Animation.loadAssets("PlantCrash", "plantCrash", 3);


let myGame = new Game(canvasBackground, backgroundCTX)
let myCamera = new Camera(0, 0, canvas, fogCanvas, myGame, null);

myGame.setNewPlayerCallback( (player) => {
  myCamera.setFollowedModel(player.model);
  let rc = new RemoteController(window, player, Config, socket);
  rc.registerController(Config);
});

myGame.start();

//TODO: this is temporary, update whole game, not just the player.
socket.on("state-upate", (msg) => {
  let gameUpdate = JSON.parse(msg);
  removeGameObjects(myGame, gameUpdate);
  updateGame(myGame, gameUpdate);
});

function removeGameObjects(game, gameUpdate) {
  if (gameUpdate.hasOwnProperty("objects")) {
    game.getObjectIds().forEach((id) => {
      if (!gameUpdate.objects.hasOwnProperty(id)) {
        //TODO: Fixme;
        // game.getObject(id).explode();
        game.removeObject(id);
      }
    });
  }
}

/**
 * Updates the local model of the game based on the updates from server.
 * @param { Game } game
 */
function updateGame(game, gameUpdate) {
  
  // game.numOfDataUpdates++;
  // game.checkLargestDelta();
  // game.previousUpdateTime = game.now();

  game.update(gameUpdate);
}

function handleUiObjects() {
  myGame.eachObject(function (o) {
    //TODO: Enable it this later on.
    o.update();
  });

  myCamera.update();

  myGame.eachObject(function (o) {
    o.draw(myCamera);
  });

  myGame.animations.forEach((a) => {
    a.update();
    a.draw(myCamera);
  });
}

function loadImage(imgpath) {
  return new Promise((resolve) => {
    const img = new Image();
    img.addEventListener("load", () => {
      resolve(img);
    });
    img.src = imgpath;
  });
}

// myGame.bgctx.fillStyle = "rgba(200,255,90,1)";
function drawBackgroundImg(img, x, y) {
  // debugger;

  myGame.bgctx.drawImage(img, x, y, 600, 600);

  console.log("Printing background");
}

function drawBackground(img, canvasBackground) {
  for (let i = 0; i < canvasBackground.width / 600; i++) {
    // console.log("starting new line");
    drawBackgroundImg(img, i * 600 - 30, 0);
    // debugger;
    for (let j = 0; j < canvasBackground.height / 600; j++) {
      drawBackgroundImg(img, i * 600 - 30, j * 600);
    }
  }
}

function animate() {
  myCamera.draw(myGame.bgcanvas);

  handleUiObjects();
  myGame.numOfSceneDraws++;
  // Let's redraw the scene only once an update from server arrives.
  // requestAnimationFrame(animate);
}

setInterval( () => requestAnimationFrame(animate), 1000/60);

loadImage("background.png").then((img) => {
  drawBackground(img, canvasBackground);
});

// animate();
