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

let myWall3 = new Obstacle(ctx, 100, 400, 50, 50, '#793B31')
let myWall2 = new Obstacle(ctx, 300, 100, 30, 100, '#793B31')
let myWall = new Obstacle(ctx, 100, 200, 100, 30, '#793B31');
let mySolider = new Solider(ctx, backgroundCTX, 50, 50, 51, 50, 0, 0.7, 0, 'solider.png');
UiObjects.push(mySolider);
UiObjects.push(myWall);
UiObjects.push(myWall2);
UiObjects.push(myWall3);


window.addEventListener('keydown', function (e) {
    if (e.key === 'w') {
        mySolider.movingFoward = true;
    } else if (e.key === 'd') {
        mySolider.rotatingRight = true;
    } else if (e.key === 'a') {
        mySolider.rotatingLeft = true;
    } else if (e.key === 's') {
        mySolider.movingBack = true;
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
    }
});

window.addEventListener('click', function (e) {
    mySolider.fire()
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
    backgroundCTX.fillRect(0,0, canvasBackground.width, canvasBackground.height)
    counter = 0
    }
    counter++
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    handleUiObjects();
    requestAnimationFrame(animate)
}
animate()
