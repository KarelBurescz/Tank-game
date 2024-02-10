import { Geometry } from "./model/geometry.js";

class Camera {

    constructor(x, y, canvas, fog, game, followedModel) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;

        // Mass
        this.m = 2;

        // Acceleration
        this.ax = 0;
        this.ay = 0;

        // Honey
        this.M = 0.04;
        // Spring strength
        this.k = 0.002;
        this.w = canvas.width;
        this.h = canvas.height;
        this.canvas = canvas;
        this.fog = fog;
        this.ctx = this.canvas.getContext('2d');
        this.fogCtx = this.fog.getContext('2d');
        this.game = game;
        this.followedModel = followedModel;
        this.visibilityRadius = 300;
        // this.x = this.followedModel.x - this.w / 2;
        // this.y = this.followedModel.y - this.h / 2;

    }

    setFollowedModel(followedModel) {
        this.followedModel = followedModel;
        this.x = this.followedModel.ssp.x - this.w / 2;
        this.y = this.followedModel.ssp.y - this.h / 2;
    }

    update() {
        if (!this.followedModel) return;

        let Lx = this.x + this.w / 2 - this.followedModel.ssp.x;
        let Ly = this.y + this.h / 2 - this.followedModel.ssp.y;


        this.ax = (-1 * this.k * Lx - this.M * this.vx) / this.m
        this.ay = (-1 * this.k * Ly - this.M * this.vy) / this.m

        this.vx += this.ax;
        this.vy += this.ay;

        this.x += this.vx;
        this.y += this.vy;
    }

    drawFogOfWar() {
        this.fogCtx.fillStyle = 'black';
        this.fogCtx.fillRect(0, 0, fog.width, fog.height);

        // Create a radial gradient
        let gradient = this.ctx.createRadialGradient(this.w / 2, this.h / 2, 50, this.w / 2, this.h / 2, this.visibilityRadius);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');  // Fully transparent in the center
        gradient.addColorStop(0.9, 'rgba(0, 0, 0, 1)');  // Fully transparent in the center
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');  // Fully opaque at the edges

        // Apply the gradient
        this.fogCtx.globalCompositeOperation = 'destination-out';
        this.fogCtx.fillStyle = gradient;
        this.fogCtx.beginPath();
        this.fogCtx.arc(
            this.w / 2,
            this.h / 2,
            this.visibilityRadius, 0, Math.PI * 2);
        this.fogCtx.fill();
        this.fogCtx.globalCompositeOperation = 'source-over';

        this.drawVisibilityHints();
    }

    drawVisibilityHints() {
        if (!this.followedModel) return;
        
        const playerSsp = this.followedModel.ssp;
        const [lx, ly] = this.localCoords(playerSsp.x, playerSsp.y, true);

        let cbx = this.game.getColisionBoxes();
        
        let corners = Geometry.getCornersFromBoundingBoxes(cbx)
        .map(c => this.localCoords(c[0], c[1], true));
        
        corners = [
            ...corners, 
            ...Geometry.getCornersFromBoundingBoxes(
                [this.getCameraBboxes()]
            )
        ];

        corners = Geometry.getAllFuzzyCornersFromCorners(lx, ly, corners);

        let edges = this.linesFromScene();

        edges = edges.map( e => {
            const p1 = this.localCoords(e[0], e[1], true);
            const p2 = this.localCoords(e[2], e[3], true);
            return [p1[0],p1[1], p2[0],p2[1]];
        });

        edges = [...(this.cameraBoundingBoxEdges()),...edges];


        let isects = this.getIntersectionPoints(corners, edges);
        isects.forEach(i => {
            this.fogCtx.beginPath();
            this.fogCtx.strokeStyle = 'white';
            this.fogCtx.arc(i[0], i[1], 4, 0, Math.PI*2);
            this.fogCtx.stroke();
        });
    }

    cameraBoundingBoxEdges(){
        let m = 10;
        return [
            [m, m, this.w - 2*m, m],
            [this.w - 2*m, m, this.w - 2*m, this.h - 2*m],
            [this.w - 2*m, this.h - 2*m, m, this.h - 2*m],
            [m, this.h - 2*m, m, m]
        ];
    }

    getCameraBboxes(){
        return {
            x: 10, y: 10, w: this.w - 20, h: this.h - 20
        }
    }

    getIntersectionPoints(corners, edges) {
        if (!this.followedModel) return;

        const playerSsp = this.followedModel.ssp;
        const [lx, ly] = this.localCoords(playerSsp.x, playerSsp.y, true);
        const R = this.visibilityRadius * 1.7;

        let ipoints = [];

        corners.forEach(c => {
            const [cx, cy] = [c[0], c[1]];
            let semiline = [lx, ly, cx, cy];

            this.fogCtx.beginPath();
            this.fogCtx.strokeStyle = 'white';
            this.fogCtx.moveTo(lx, ly);
            this.fogCtx.lineTo(cx, cy);
            this.fogCtx.stroke();

            let isect = Geometry.getClosestSemilineIntersetionWithEdges(semiline, edges);
            if (!isect) {
                isect = [cx, cy];
            }
            ipoints.push(isect.map(x => Math.floor(x)));
        });

        return ipoints;
    }

    drawEdgesOnScene(edges) {
        edges.forEach(e => {
            this.fogCtx.beginPath();
            this.fogCtx.strokeStyle = 'gray';
            this.fogCtx.moveTo(e[0], e[1]);
            this.fogCtx.lineTo(e[2], e[3]);
            this.fogCtx.stroke();
        })
    }

    linesFromScene() {
        if (!this.followedModel) return;
        if (!this.game) return;

        let bbx = this.game.getColisionBoxes();
        const edges = Geometry.getEdgesFromBoundingBoxes(bbx);
        return edges.map( e => {
            return e.map(p => Math.floor(p))
        });
    }

    localCoords(x, y, round=false) {
        let res = [
            x - this.x,
            y - this.y
        ];
        if (!round){
            return res;
        } else {
            return res.map( x => Math.floor(x));
        }
    }

    draw(bgCanvas) {

        this.ctx.clearRect(0, 0, this.w, this.h)

        this.ctx.drawImage(
            bgCanvas,
            //source rectangle:
            this.x,
            this.y,
            this.w,
            this.h,
            //destination rectangle:
            0, 0,
            this.w,
            this.h
        );
        this.drawFogOfWar();
        this.drawHud();
    }

    drawHud() {
        if (!this.followedModel) return;
        const myWidth = 40;
        const myHeight = 30;

        let myX = 5;
        let myY = 5;

        const lives = this.followedModel.ssp.hp / 20;

        for (let i = 0; i < 5; i++) {

            this.fogCtx.beginPath();

            if (i < lives) {
                this.fogCtx.fillStyle = 'rgba(1, 255, 50, 1)';
            } else {
                this.fogCtx.fillStyle = 'rgba(255, 0, 0, 1)';
            }

            this.fogCtx.fillRect(myX, myY, myWidth, myHeight);

            this.fogCtx.strokeRect(myX, myY, myWidth, myHeight);
            this.fogCtx.strokeStyle = 'black';


            myX += myWidth + 3;

        }

        const myWidthB = 40;
        const myHeightB = 30;

        let myXB = 5;
        let myYB = myY + myHeight + 4;

        const speedBoost = this.followedModel.ssp.speedBoostCouter / 40;

        for (let j = 0; j < 5; j++) {

            this.fogCtx.beginPath();

            if (j < speedBoost) {
                this.fogCtx.fillStyle = 'rgba(0, 0, 255, 1)';
            } else {
                this.fogCtx.fillStyle = 'rgba(0, 0, 0, 1)';
            }

            this.fogCtx.fillRect(myXB, myYB, myWidthB, myHeightB);

            this.fogCtx.strokeRect(myXB, myYB, myWidthB, myHeightB);
            this.fogCtx.strokeStyle = 'black';

            myXB += myWidthB + 3;

        }

        const myWidthBu = 40;
        const myHeightBu = 30;

        let myXBu = 5;
        let myYBu = myYB + myHeightB + 4;

        const bulletsLoaded = this.followedModel.ssp.bulletsLoaded;

        for (let k = 0; k < 5; k++) {

            this.fogCtx.beginPath();

            if (k < bulletsLoaded) {
                this.fogCtx.fillStyle = 'rgba(	255, 215, 0, 1)';
            } else {
                this.fogCtx.fillStyle = 'rgba(0, 0, 0, 1)';
            }

            this.fogCtx.fillRect(myXBu, myYBu, myWidthBu, myHeightBu);

            this.fogCtx.strokeRect(myXBu, myYBu, myWidthBu, myHeightBu);
            this.fogCtx.strokeStyle = 'black';

            myXBu += myWidthBu + 3;

        }
    }
}

export { Camera }