import { Solider } from "./solider.js";
import { Obstacle } from "./obstacle.js";
import { mouse } from "./mouse.js";
import { UiObjects } from "./arrayuiobjects.js";
import { Game } from "./game.js";
import { Camera } from "./camera.js";
import { Tree } from "./tree.js";

const canvas = document.getElementById('canvas');
// const ctx = canvas.getContext('2d');

const canvas1 = document.getElementById('canvas1');
// const ctx1 = canvas1.getContext('2d')

const canvasBackground = document.getElementById('canvas-background');
const backgroundCTX = canvasBackground.getContext('2d');

canvas.width = window.innerWidth/2;
canvas.height = window.innerHeight;

canvas1.width = window.innerWidth/2;
canvas1.height = window.innerHeight;

canvasBackground.width = 5000;
canvasBackground.height = 5000;

canvas.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('resize', function () {
    canvas.width = window.innerWidth/2;
    canvas.height = window.innerHeight;
    canvas1.width = window.innerWidth/2;
    canvas1.height = window.innerHeight;
    myCamera.w = canvas.width/2;
    myCamera.h = canvas.height;
    myCamera1.w = canvas1.width/2;
    myCamera1.h = canvas1.height;
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

let myCamera = new Camera(0, 0, canvas, null);
let myCamera1 = new Camera(0, 0, canvas1, null);

let myGame = new Game(canvasBackground, backgroundCTX, UiObjects);

let myTree2 = new Tree(myGame, 2250, 2280, 20, 40, 100);
let myTree1 = new Tree(myGame, 2700, 2500, 30, 40, 100);
let myTree = new Tree(myGame, 2400, 2900, 50, 50, 100);
let myWall3 = new Obstacle(myGame, 2600, 2800, 150, 30, 100, '');
let myWall2 = new Obstacle(myGame, 2300, 2600, 150, 30, 100, '');
let myWall1 = new Obstacle(myGame, 2500, 2300, 30, 100, 100, '');
let myWall = new Obstacle(myGame, 2300, 2400, 100, 30, 100, '');
let mySolider = new Solider(myGame, 2600, 2400, 51, 50, 180, 0.7, 180, 100);
let mySolider1 = new Solider(myGame, 2800, 2850, 51, 50, 360, 0.7, 360, 100);

myCamera.followedObject = mySolider;
myCamera1.followedObject = mySolider1;

myCamera.update();
myCamera1.update();

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
    myCamera.update();
    myCamera1.update();
    
    UiObjects.forEach(function (o) {
        o.draw(myCamera);
        o.draw(myCamera1);
    })
}

myGame.bgctx.fillStyle = 'rgba(200,255,90,1)';
myGame.bgctx.fillRect(0,0, canvasBackground.width, canvasBackground.height);


let counter = 0;
function animate() {
    
    myCamera.ctx.clearRect(0, 0, canvas.width, canvas.height)
    myCamera1.ctx.clearRect(0, 0, canvas.width, canvas.height)

    //Take the background canvas, cut out the area needed for the
    //camera, and draw it to the main canvas at position 0,0.
    myCamera.ctx.drawImage(
        myGame.bgcanvas, 
        //source rectangle:
        myCamera.x, 
        myCamera.y, 
        myCamera.w,
        myCamera.h,
        //destination rectangle:
        0,0, 
        myCamera.w,
        myCamera.h
    );

    myCamera1.ctx.drawImage(
        myGame.bgcanvas, 
        //source rectangle:
        myCamera1.x, 
        myCamera1.y, 
        myCamera1.w,
        myCamera1.h,
        //destination rectangle:
        0,0, 
        myCamera1.w,
        myCamera1.h
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

animate();
