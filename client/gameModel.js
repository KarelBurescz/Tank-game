'use strict';

import { UiSolider } from "./uisolider.js";
import { UiObstacle } from "./uiobstacle.js";
import { UiTree } from "./uitree.js";
import { UiPlant } from "./uiplant.js";
import { UiBush } from "./uibush.js";
import { UiStone } from "./uistone.js";
import { UiBullet } from "./uibullet.js";

class GameModel {

    constructor(game) {
        this.game = game;
        this.objects = {};
        this.oponents = {};
        this.player = null;

        this.readyToDraw = false;
        this.tickTime = 0;
    }

    update(gameUpdate) {
        this.tickTime = gameUpdate.gameStats.tickTime;
        if (gameUpdate.hasOwnProperty("objects")) {
            Object.keys(gameUpdate.objects).forEach((id) => {
                let o = gameUpdate.objects[id];

                if (this.hasObject(id)) {
                    this.getObject(id).model.ssp = gameUpdate.objects[id];
                } else {
                    let newObject = null;
                    switch (o.type) {
                        case "tree": {
                            newObject = new UiTree(this.game, 0, 0, 0, 0, 0);
                            break;
                        }
                        case "obstacle": {
                            newObject = new UiObstacle(this.game, 0, 0, 0, 0, 0, "brown");
                            break;
                        }
                        case "bullet": {
                            newObject = new UiBullet(this.game, 0, 0, 0, 0, 0, 0, 100, null);
                            break;
                        }
                        case "player": {
                            newObject = new UiSolider(this.game, 0, 0, 0, 0, 0, 0, 0, 100);
                            break;
                        }
                        case "plant": {
                            newObject = new UiPlant(this.game, 0, 0, 0, 0, 0, "");
                            break;
                        }
                        case "bush": {
                            newObject = new UiBush(this.game, 0, 0, 0, 0, 0);
                            break;
                        }
                        case "stone": {
                            newObject = new UiStone(this.game, o);
                            break;
                        }
                    }

                    if (newObject) {
                        if (o.type !== "stone") {
                            newObject.model.ssp = o;
                        };
                        this.addObject(newObject);
                    }
                }
            });
        }

        if (gameUpdate.hasOwnProperty("oponents")) {
            this.oponents = gameUpdate.oponents;
        }

        this.readyToDraw = true;
    }

    interpolateInTime(targetModelSSP, dt) {
        for( let [k,o] of Object.entries(this.objects)){
            if (o.model.ssp.movable) {
                const id = o.model.ssp.id;
                const ssp = targetModelSSP.objects[id];
                if(!ssp) continue;
                
                const xprev = o.model.ssp.x;
                const yprev = o.model.ssp.y;

                o.model.interpolateInTime(ssp, this.tickTime, dt, targetModelSSP.gameStats.tickTime);
                if ( Math.abs(xprev - ssp.x) > 1e-4 || Math.abs(yprev - ssp.y) > 1e-4){
                    // console.log(`Correction by dt: ${dt} interpolation: x: ${xprev} dx: ${o.model.ssp.x - xprev}, y: ${yprev} dy: ${o.model.ssp.y - yprev}`)
                    if ( Math.abs(xprev - o.model.ssp.x) > 50 || Math.abs(yprev - o.model.ssp.y) > 50){
                        console.warn("The position correction is suspiciously large!")
                    }
                    
                }
            }
        }
    }

    hasObject(id) {
        return this.objects.hasOwnProperty(id);
    }

    getObject(id) {
        return this.objects[id];
    }

    addObject(object) {
        this.objects[object.model.ssp.id] = object;
    }

    setPlayer(player) {
        this.player = player;
        this.addObject(player);
    }

    getObjectIds() {
        return Object.keys(this.objects);
    }

    eachObject(func) {
        Object.keys(this.objects).forEach((o) => func(this.objects[o]));
    }

    getObjectsArray() {
        return Object.values(this.objects);
    }

    removeObject(id) {
        delete this.objects[id];
    }
}

export { GameModel };