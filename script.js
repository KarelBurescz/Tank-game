import { Solider } from "./solider.js";
import { Obstacle } from "./obstacle.js";
import { mouse } from "./mouse.js";
import { UiObjects } from "./arrayuiobjects.js";
import { Game } from "./game.js";
import { Camera } from "./camera.js";
import { Tree } from "./tree.js";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const canvasBackground = document.getElementById('canvas-background');
const backgroundCTX = canvasBackground.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvasBackground.width = 5000;
canvasBackground.height = 5000;

canvas.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasBackground.width = window.innerWidth;
    canvasBackground.height = window.innerHeight;
});

function drawFogOfWar() {
    fogContext.fillStyle = 'black';
    fogContext.fillRect(0, 0, canvas1.width, canvas1.height);
    
    // Create a radial gradient
    var gradient = fogContext.createRadialGradient(player.x, player.y, 0, player.x, player.y, visibilityRadius);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');  // Fully transparent in the center
    gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');  // Fully opaque at the edges
    
    // Apply the gradient
    fogContext.globalCompositeOperation = 'destination-out';
    fogContext.fillStyle = gradient;
    fogContext.beginPath();
    fogContext.arc(x, y, visibilityRadius, 0, Math.PI * 2);
    fogContext.fill();
    fogContext.globalCompositeOperation = 'source-over';
}

let myCamera = new Camera(0, 0, canvas.width, canvas.height, null);
let myGame = new Game(myCamera, canvasBackground, ctx, backgroundCTX, UiObjects);

let myTree2 = new Tree(myGame, 50, 80, 20, 40, 100);
let myTree1 = new Tree(myGame, 500, 300, 30, 40, 100);
let myTree = new Tree(myGame, 200, 700, 50, 50, 100);
let myWall3 = new Obstacle(myGame, 400, 600, 150, 30, 100, '');
let myWall2 = new Obstacle(myGame, 100, 400, 150, 30, 100, '');
let myWall1 = new Obstacle(myGame, 300, 100, 30, 100, 100, '');
let myWall = new Obstacle(myGame, 100, 200, 100, 30, 100, '');
let mySolider = new Solider(myGame, 400, 500, 51, 50, 180, 0.7, 180, 100);
let mySolider1 = new Solider(myGame, 300, 250, 51, 50, 360, 0.7, 360, 100);

myCamera.followedObject = mySolider;
myCamera.update();

UiObjects.push(myTree2);
UiObjects.push(myWall3);
UiObjects.push(myTree1);
UiObjects.push(myTree);
UiObjects.push(mySolider);
UiObjects.push(myWall);
UiObjects.push(myWall1);
UiObjects.push(myWall2);
UiObjects.push(mySolider1);


window.addEventListener('keydown', function (e) {
    if (e.key === 'w') {
        mySolider.movingFoward = true;
    } else if (e.key === 'd') {
        mySolider.rotatingRight = true;
    } else if (e.key === 'a') {
        mySolider.rotatingLeft = true;
    } else if (e.key === 's') {
        mySolider.movingBack = true;
    } else if (e.key === 'q') {
        mySolider.turretMovingLeft = true;
    } else if (e.key === 'e') {
        mySolider.turretMovingRight = true;
    }
});

window.addEventListener('keyup', function (e) {
    if (e.key === 'w') {
        mySolider.movingFoward = false;
    } else if (e.key === 'd') {
        mySolider.rotatingRight = false;
    } else if (e.key === 'a') {
        mySolider.rotatingLeft = false;
    } else if (e.key === 's') {
        mySolider.movingBack = false;
    } else if (e.key === 'q') {
        mySolider.turretMovingLeft = false;
    } else if (e.key === 'e') {
        mySolider.turretMovingRight = false;
    }
});


window.addEventListener('keydown', function (e) {
    console.log(e)
    if (e.key === 'ArrowUp') {
        mySolider1.movingFoward = true;
    } else if (e.key === 'ArrowRight') {
        mySolider1.rotatingRight = true;
    } else if (e.key === 'ArrowLeft') {
        mySolider1.rotatingLeft = true;
    } else if (e.key === 'ArrowDown') {
        mySolider1.movingBack = true;
    } else if (e.key === 'i') {
        mySolider1.turretMovingLeft = true;
    } else if (e.key === 'p') {
        mySolider1.turretMovingRight = true;
    }
});

window.addEventListener('keyup', function (e) {
    if (e.key === 'ArrowUp') {
        mySolider1.movingFoward = false;
    } else if (e.key === 'ArrowRight') {
        mySolider1.rotatingRight = false;
    } else if (e.key === 'ArrowLeft') {
        mySolider1.rotatingLeft = false;
    } else if (e.key === 'ArrowDown') {
        mySolider1.movingBack = false;
    } else if (e.key === 'i') {
        mySolider1.turretMovingLeft = false;
    } else if (e.key === 'p') {
        mySolider1.turretMovingRight = false;
    }
});


window.addEventListener('keydown', function (e) {
    if (e.key === 'f') {
        mySolider.fire()
    }
})


window.addEventListener('keydown', function (e) {
    if (e.key === 'o') {
        mySolider1.fire()
    }
})

window.addEventListener('keydown', (e) => {
    if(e.key === 'r'){
        mySolider.speedBoost = true;
    }
})


window.addEventListener('keyup', (e) => {
    if(e.key === 'r'){
        mySolider.speedBoost = false;
    }
})

function handleUiObjects() {
    UiObjects.forEach(function (o) {
        o.update();
    })
    myGame.camera.update();
    
    UiObjects.forEach(function (o) {
        o.draw();
    })
}

myGame.bgctx.fillStyle = 'rgba(200,255,90,1)';
myGame.bgctx.fillRect(0,0, canvasBackground.width, canvasBackground.height);


let counter = 0;
function animate() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    //Take the background canvas, cut out the area needed for the
    //camera, and draw it to the main canvas at position 0,0.
    let res = ctx.drawImage(
        myGame.bgcanvas, 
        //source rectangle:
        myGame.camera.x, 
        myGame.camera.y, 
        canvas.width,
        canvas.height,
        //destination rectangle:
        0,0, 
        canvas.width,
        canvas.height
    );

    handleUiObjects();

    if (counter > 10) {
        myGame.bgctx.fillStyle = 'rgba(200,255,90,0.05)'
        myGame.bgctx.fillRect(
            0, 
            0, 
            myGame.bgcanvas.width, 
            myGame.bgcanvas.height)

        counter = 0
    }

    counter++

    requestAnimationFrame(animate)
}

animate()
