'use strict';

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
const fogCanvas = document.getElementById("fog");
const canvasBackground = document.getElementById("canvas-background");
const backgroundCTX = canvasBackground.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

fogCanvas.width = canvas.width;
fogCanvas.height = canvas.height;

canvasBackground.width = 5000;
canvasBackground.height = 5000;

canvas.addEventListener("mousemove", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

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

let myCamera = new Camera(0, 0, canvas, fogCanvas, null);
let myGame = new Game(canvasBackground, backgroundCTX);

let mySolider = new UiSolider(myGame, 2500, 2500, 51, 50, 0, 1, 0, 100);
myGame.setPlayer(mySolider);

//TODO: this is temporary, update whole game, not just the player.
socket.on("state-upate", (msg) => {
  let gameUpdate = JSON.parse(msg);
  updateGame(myGame, gameUpdate);
})

/**
 * Updates the local model of the game based on the updates from server.
 * @param { Game } game 
 */
function updateGame(game, gameUpdate) {
  if (gameUpdate.hasOwnProperty('player')){
    game.player.model.ssp = gameUpdate.player;
  }

  if (gameUpdate.hasOwnProperty('oponents')){
    Object.keys(gameUpdate.oponents).forEach(
      (id) =>{
        if(game.oponents.hasOwnProperty(id)){
          game.oponents[id].model.ssp = gameUpdate.oponents[id];
        } else {
          let s = new UiSolider(game,0,0,0,0,0,0,0,0);
          game.oponents[id] = s;
          game.oponents[id].model.ssp = gameUpdate.oponents[id];
          game.objects[id] = s;
        }
    })
  }

  if (gameUpdate.hasOwnProperty('objects')){
    Object.keys(gameUpdate.objects).forEach(
      (id) => {
        let o = gameUpdate.objects[id];
        if (game.hasObject(id)){
          game.getObject(id).model.ssp = gameUpdate.objects[id];
        } else {
          let newObject = null;
          switch(o.type){
            case "tree": {
              newObject = new UiTree(game,0,0,0,0,0);
              break;
            }
            case "obstacle": {
              newObject = new UiObstacle(game,0,0,0,0,0,'brown');
              break;
            }
          }

          if (newObject) {
            newObject.model.ssp = o;
            game.addObject(id, newObject);
          }
        }
      }
    )
  }
}

myCamera.setFollowedModel(mySolider.model);
// myCamera1.setFollowedModel(mySolider1.model);

myCamera.update();
// myCamera1.update();

let rc = new RemoteController(window, mySolider, Config, socket);
rc.registerController(Config);

function handleUiObjects() {
  myGame.eachObject(function (o) {
    //TODO: Enable it this later on.
    // o.model.update();
  });

  myCamera.update();
  // myCamera1.update();

  myGame.eachObject(function (o) {
    o.draw(myCamera);
    // o.draw(myCamera1);
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
