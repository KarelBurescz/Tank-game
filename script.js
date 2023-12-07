import { Solider } from "./solider.js";
import { Obstacle } from "./obstacle.js";
import { mouse } from "./mouse.js";
import { UiObjects } from "./arrayuiobjects.js";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const canvasBackground = document.getElementById('canvas-background');
const backgroundCTX = canvasBackground.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvasBackground.width = window.innerWidth;
canvasBackground.height = window.innerHeight;

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

let myWall3 = new Obstacle(ctx, 100, 400, 150, 30, 100, '')
let myWall2 = new Obstacle(ctx, 300, 100, 30, 100, 100, '')
let myWall = new Obstacle(ctx, 100, 200, 100, 30, 100, '');
let mySolider = new Solider(ctx, backgroundCTX, 50, 250, 51, 50, 180, 0.7, 180, 100);
let mySolider1 = new Solider(ctx, backgroundCTX, 300, 250, 51, 50, 360, 0.7, 360, 100);
UiObjects.push(mySolider);
UiObjects.push(myWall);
UiObjects.push(myWall2);
UiObjects.push(myWall3);
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
        o.draw();
    })
}

let counter = 0;
function animate() {

    if (counter > 10) {
        backgroundCTX.fillStyle = 'rgba(200,255,90,0.05)'
        backgroundCTX.fillRect(0, 0, canvasBackground.width, canvasBackground.height)
        counter = 0
    }
    counter++
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    handleUiObjects();
    requestAnimationFrame(animate)
}
animate()
