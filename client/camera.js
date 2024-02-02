import { Geometry } from "/model/geometry.js";

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
        this.x = this.followedModel.ssp.x - this.w / 2 - 500;
        this.y = this.followedModel.ssp.y - this.h / 2 - 500;
    }

    update() {
        if (!this.followedModel) return;

        let Lx = this.x + this.w/2 - this.followedModel.ssp.x;
        let Ly = this.y + this.h/2 - this.followedModel.ssp.y;

        
        this.ax = (-1 * this.k * Lx -this.M * this.vx) / this.m
        this.ay = (-1 * this.k * Ly -this.M * this.vy) / this.m

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
    }

    drawRays() {
        if (!this.followedModel) return;

        const playerSsp = this.followedModel.ssp;

        const [lx, ly] = this.localCoords(playerSsp.x, playerSsp.y);

        const R = this.visibilityRadius * 1.8;

        let edges = this.edgesFromScene();
        console.log(`Num of edges: ${edges.length}`)

        this.fogCtx.strokeStyle = 'rgb(100,140,100)';
        this.fogCtx.lineWidth = 1;

        edges.forEach(e => {
            this.fogCtx.beginPath();
            this.fogCtx.arc(e[0],e[1],3,0,Math.PI*2);
            this.fogCtx.arc(e[3],e[4],3,0,Math.PI*2);
            this.fogCtx.stroke();
            this.fogCtx.beginPath();
            this.fogCtx.moveTo(e[0], e[1]);
            this.fogCtx.lineTo(e[2], e[3]);
            this.fogCtx.stroke();
        })

        for (let i = 0; i <= 360; i+= 360/32) {
            const x = lx + Math.floor(R * Math.cos(i * Math.PI / 180));
            const y = ly + Math.floor(R * Math.sin(i * Math.PI / 180));

            this.fogCtx.beginPath();
            this.fogCtx.strokeStyle = 'rgb(255,0,0)';
            this.fogCtx.moveTo(lx, ly);
            this.fogCtx.lineTo(x, y);
            this.fogCtx.stroke();

            let isections = this.intersectionsWithEdges(lx, ly, x, y, edges);
            isections = isections.sort(
                (i,j) => {
                    let di = (i[0]-lx)*(i[0]-lx) + (i[1]-ly)*(i[1]-ly);
                    let dj = (j[0]-lx)*(j[0]-lx) + (j[1]-ly)*(j[1]-ly);
                    return di - dj;
                }
            )

            console.log(`Num if isections ${isections.length}`)

            let first = true;
            isections.forEach((i) => {
                
                let [x,y] = i;
                this.fogCtx.beginPath();
                this.fogCtx.strokeStyle = first?'rgb(0,0,255)':'rgb(255,0,0)';
                this.fogCtx.fillStyle = 'rgb(255,0,255)';
                this.fogCtx.moveTo(x,y);
                this.fogCtx.arc(x,y,6,0,Math.PI*2);
                
                first?this.fogCtx.fill():this.fogCtx.stroke();
                first = false;
            })

        }
    }

    intersectionsWithEdges(x1,y1,x2,y2, edges) {
        let isections = edges.reduce((res, e) => {
            let i = Geometry.linesIntersection(
                x1,y1, x2, y2, 
                ...e,
                true, false, true, true        
            )
            if (!i) return res;

            res.push(i);
            // res.push(i.map(i=>Math.floor(i)));
            // console.log(`Intersection: ${i}`)
            return res;
        }, []);
        return isections;
    }

    edgesFromScene(){
        if (!this.followedModel) return;
        if (!this.game) return;

        const edges = this.game.getObjectsArray().reduce((edges, o)=>{
            
            if (o.model === this.followedModel) return edges;
            
            let bb = o.model.collisionBox();
            let [x1, y1] = this.localCoords(bb.x       , bb.y       );
            let [x2, y2] = this.localCoords(bb.x + bb.w, bb.y       );
            let [x3, y3] = this.localCoords(bb.x + bb.w, bb.y + bb.h);
            let [x4, y4] = this.localCoords(bb.x       , bb.y + bb.h);

            edges.push([x1,y1,x2,y2]);
            edges.push([x2,y2,x3,y3]);
            edges.push([x3,y3,x4,y4]);
            edges.push([x4,y4,x1,y1]);

            return edges;
        }, []);

        edges.push([
            10, 10, 
            this.w - 10, 10
        ]);
        edges.push([
            this.w - 10, 10, 
            this.w - 10, this.h - 10
        ]);
        edges.push([
            this.w - 10, this.h - 10,
            10, this.h - 10
        ]);
        edges.push([
            10, this.h - 10,
            10, 10
        ]);

        return edges;
    }

    localCoords(x, y) {
        return [
            Math.round(x - this.x),
            Math.round(y - this.y)
        ];
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
            this.fogCtx.strokeStyle =  'black';


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
            this.fogCtx.strokeStyle =  'black';

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
            this.fogCtx.strokeStyle =  'black';

            myXBu += myWidthBu + 3;

        }

        this.drawRays();
    }
}

export { Camera }