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
    // console.log(`Update containsz`)
    Object.keys(gameUpdate.oponents).forEach(
      (id) =>{
        if(game.oponents.hasOwnProperty(id)){
          game.oponents[id].model.ssp = gameUpdate.oponents[id];
        } else {
          let s = new UiSolider(game,0,0,0,0,0,0,0,0);
          game.oponents[id] = s;
          game.oponents[id].model.ssp = gameUpdate.oponents[id];
          game.objects.push(s);
        }
    })
  }
}

/* TODO:  This should be removed and ran on server only */
// for (let i = 0; i <= 10; i++) {
//   const myX = Math.random() * 5000 + 40;
//   const myY = Math.random() * 5000 + 40;

//   let myWidth = 30;
//   let myHeight = Math.random() * 200 + 70;

//   if (Math.random() > 0.5) {
//     myWidth = myHeight;
//     myHeight = 30;
//   }

//   const maybeWall = new UiObstacle(myGame, myX, myY, myWidth, myHeight, 100, "");

//   const wallCollides = myGame.objects.some((e) => {
//     if (e.model.collides(maybeWall.model)) {
//       return true;
//     }
//   });

//   if (wallCollides === false) {
//     myGame.addObject(maybeWall);
//   }
// }

// for (let j = 0; j <= 10; ++j) {
//   const myX = Math.random() * 5000 + 40;
//   const myY = Math.random() * 5000 + 40;

//   let myHeight = (Math.random() + 1) * 30;

//   const maybeTree = new UiTree(myGame, myX, myY, myHeight, 0, 100);

//   const treeCollides = myGame.objects.some((e) => {
//     if (e.model.collides(maybeTree.model)) {
//       return true;
//     }
//   });

//   if (!treeCollides) {
//     myGame.addObject(maybeTree);
//   }
// }

myCamera.setFollowedModel(mySolider.model);
// myCamera1.setFollowedModel(mySolider1.model);

myCamera.update();
// myCamera1.update();

let rc = new RemoteController(window, mySolider, Config, socket);
rc.registerController(Config);

function handleUiObjects() {
  myGame.objects.forEach(function (o) {
    //TODO: Enable it this later on.
    // o.model.update();
  });

  myCamera.update();
  // myCamera1.update();

  myGame.objects.forEach(function (o) {
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
