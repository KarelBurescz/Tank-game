"use strict";

import { UiSolider } from "./uisolider.js";
import { UiObstacle } from "./uiobstacle.js";
import { mouse } from "./mouse.js";
import { Game } from "./game.js";
import { Camera } from "./camera.js";
import { UiTree } from "./uitree.js";
import { Config } from "./config.js";
import { RemoteController } from "./remoteController.js";
import { UiBullet } from "./uibullet.js";
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

canvasBackground.width = 5000;
canvasBackground.height = 5000;

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

let myCamera = new Camera(0, 0, canvas, fogCanvas, null);
let myGame = new Game(canvasBackground, backgroundCTX);

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
  if (gameUpdate.hasOwnProperty("objects")) {
    Object.keys(gameUpdate.objects).forEach((id) => {
      let o = gameUpdate.objects[id];

      if (game.hasObject(id)) {
        game.getObject(id).model.ssp = gameUpdate.objects[id];
      } else {
        let newObject = null;
        switch (o.type) {
          case "tree": {
            newObject = new UiTree(game, 0, 0, 0, 0, 0);
            break;
          }
          case "obstacle": {
            newObject = new UiObstacle(game, 0, 0, 0, 0, 0, "brown");
            break;
          }
          case "bullet": {
            newObject = new UiBullet(game, 0, 0, 0, 0, 0, 0, 100, null);
            break;
          }
          case "player": {
            newObject = new UiSolider(game, 0, 0, 0, 0, 0, 0, 0, 100);
            break;
          }
        }

        if (newObject) {
          newObject.model.ssp = o;
          game.addObject(newObject);
        }
      }
      let outStr = "";
      Object.keys(game.objects).forEach((k) => {
        outStr += ` k: ${k} type: ${game.objects[k].model.ssp.type}, `;
        if (game.objects[k].model.ssp.type === "player") {
          let locssp = game.objects[k].model.ssp;
          outStr += `${JSON.stringify(locssp)}`;
        }
      });

      // console.log(outStr);
    });

    if (!game.player && gameUpdate.hasOwnProperty("player")) {
      const player = game.getObject(gameUpdate.player.id);
      game.setPlayer(player);

      myCamera.setFollowedModel(game.player.model);
      let rc = new RemoteController(window, game.player, Config, socket);
      rc.registerController(Config);
    }
  }

  if (gameUpdate.hasOwnProperty("oponents")) {
    game.oponents = gameUpdate.oponents;
  }
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
}

myGame.bgctx.fillStyle = "rgba(200,255,90,1)";
myGame.bgctx.fillRect(0, 0, canvasBackground.width, canvasBackground.height);

let counter = 0;
function animate() {
  myCamera.draw(myGame.bgcanvas);

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
