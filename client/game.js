/**
 * The Game represents the data model on the client side. 
 * <pre>
 * [ Game ] 1:1 -- 1:1 [ GameModel ]
 * </pre>
 * The GameModel holds the UI Objects that are capable of drawing the objects it represents.
 * 
 * @module Game
 */
'use strict';

import { GameModel } from './gameModel.js';

class Game {
  constructor(bgcanvas, bgctx){
    this.bgcanvas = bgcanvas;
    this.bgctx = bgctx;
    this.newPlayerCallback = null;;
    
    this.animations = [];

    this.stateUpdates = {};
    this.actualModel = new GameModel(this);

    this.gameStats = {
      clientUps: 0,
      clientTps: 0,
      largestClientUpsDelta: 0,
      largestHandleObjectsCall: 0,
    };

    this.timeCorrection = 0;

    //TODO: In future refactor that into separate class
    this.lastUpsUpdate = this.now();
    this.numOfDataUpdates = 0;

    this.previousUpdateTime = this.now();
    this.largestUpdateDelta = 0;
    this.largestHandleObjectsCall = 0;
    
    this.lastTpsUpdate = this.now();
    this.numOfSceneDraws = 0;
    
    this.statsComputeScheduler = null;
  }

  setNewPlayerCallback(fn) {
    this.newPlayerCallback = fn;
  }

  checkLargestDelta(){
    const dt = this.now() - this.previousUpdateTime;
    if (dt > this.largestUpdateDelta) {
      this.largestUpdateDelta = dt;
    }
  }

  now() {
    return Date.now();
  }

  recomputeStats() {
    this.checkLargestDelta();
    this.gameStats.largestClientUpsDelta = this.largestUpdateDelta;
    this.gameStats.largestHandleObjectsCall = Math.floor(this.largestHandleObjectsCall * 100) / 100;

    this.largestUpdateDelta = 0;
    this.largestHandleObjectsCall = 0;

    this.updateUps();
    this.updateTps();
  }

  /* Number of frames drawn per second. */
  updateTps() {
    const dt = this.now() - this.lastTpsUpdate;

    // Avoid division by zero.
    if (Math.abs(dt) < 1e-3) return;

    this.gameStats.clientTps = Math.floor(100 * this.numOfSceneDraws * 1000 / dt) / 100;
    this.numOfSceneDraws = 0;
    this.lastTpsUpdate = this.now();
  }

  /* Number of data updates from the server per second. */
  updateUps() {
    const dt = this.now() - this.lastUpsUpdate;
    // Let's avoid division by zero.
    if (Math.abs(dt) < 1e-3) return;

    this.gameStats.clientUps = Math.floor(100 * this.numOfDataUpdates * 1000 / dt) / 100;
    this.numOfDataUpdates = 0;
    this.lastUpsUpdate = this.now();
  }
  /**
   * 
   * @param {Number} timeCorrection is a number of milisecond we need to add to the client time to get the correct timestamp on the server.
   */
  start(timeCorrection) {
    this.timeCorrection = timeCorrection;
    this.statsComputeScheduler = setInterval( this.recomputeStats.bind(this) ,1000)
  }

  getCorrectedDrawTimeMs(){
    return Date.now() + this.timeCorrection - 100;
  }


  getActualModel() {
    // Here we need to interpolate all the object ssp properties that change in time, 
    // and update the actual model with it.
    
    const correctedTimestamp = this.getCorrectedDrawTimeMs();
    const [closestPastSSP, closestFutureSSP] = this.getStateUpdatesForTimestamp(correctedTimestamp);
    
    // console.log(`CT: ${correctedTimestamp}, Past: ${closestPastSSP?.gameStats.tickTime} Target: ${closestFutureSSP?.gameStats.tickTime}, tss: ${Object.keys(this.stateUpdates)}`)
    
    if (closestPastSSP) {
      this.actualModel.update(closestPastSSP);
    } else {
      return this.actualModel;
    }

    if (closestFutureSSP) {
      const dt = correctedTimestamp - closestPastSSP.gameStats.tickTime;
      this.actualModel.interpolateInTime(closestFutureSSP, dt);
    }
    return this.actualModel;
  }

  storeUpdate(gameUpdate) {

    /* Upate the statistics */
    this.numOfDataUpdates++;
    this.checkLargestDelta();
    this.previousUpdateTime = this.now();

    if (gameUpdate.hasOwnProperty("gameStats")) {
      this.gameStats = {
        ...this.gameStats,
        ...gameUpdate.gameStats
      }
    }
    
    const serverTs = gameUpdate.gameStats.tickTime;
    const correctedDrawTime = this.getCorrectedDrawTimeMs();

    /* Store the server update and do a clean of unnecessary ones */
    this.cleanupModels(correctedDrawTime);
    this.stateUpdates[serverTs] = gameUpdate;

    /* Just in case a new Player object arrived, we need to set it up in the game */
    if (!this.player && this.getObject(gameUpdate?.player?.id)) {
      const player = this.getObject(gameUpdate.player.id);
      this.setPlayer(player);
      this.newPlayerCallback(this.player);
    }
  }

  cleanupModels(timestamp) {
    const keys = Object.keys(this.stateUpdates).sort();

    for (let i = 0; i < keys.length - 1; i++) {
      if (keys[i] < timestamp && keys[i+1] < timestamp) {
        delete this.stateUpdates[keys[i]];
      }
    }
  }

  /**
   * 
   * @param {Number} timestamp A unix timestamp in miliseconds
   * @returns {Array<SSP>} An array with two state updates (SSP opbjects) closest to timestamp, one before and one after the timestamp time.
   */
  getStateUpdatesForTimestamp(timestamp) {
    const updateTs = Object.keys(this.stateUpdates).sort();
    /* Search for one update before the timestamp and one after the timestamp */
    for (let i = 0; i < updateTs.length - 1; i++) {
      if (updateTs[i] <= timestamp && updateTs[i+1] >= timestamp) {
        return [this.stateUpdates[updateTs[i]], this.stateUpdates[updateTs[i+1]]]
      }
    }

    /* Failback, search for the closest one in the past, which should be the last one */
    const ts = updateTs.filter(u => u <= timestamp).pop();
    return [this.stateUpdates[ts], null];
  }

  addObject(object) {
    this.actualModel.addObject(object);
  }

  hasObject(id) {
    return this.actualModel.hasObject(id);
  }

  getObjectIds() {
    return this.actualModel.getObjectIds();
  }

  getObject(id) {
    return this.actualModel.getObject(id);
  }

  getObjectsArray() {
    return this.actualModel.getObjectsArray();
  }

  removeObject(id) {
    this.actualModel.removeObject(id);
  }

  eachObject(func) {
    this.getActualModel()?.eachObject(func);
  }

  setPlayer(player) {
    this.actualModel.setPlayer(player);
    this.actualModel.addObject(player);
    
    this.player = player;
  }

  addOponent(oponents) {
    this.oponents.push(oponents);
  }
  /*
   * @returns array of colision boxes
   * [ {
   *  x: ,
   *  y: ,
   *  w: ,
   *  h: }]
   */
  getColisionBoxes() {
    return this.getObjectsArray().filter(
      (o) => (o.model.ssp.type !== 'player' 
          && o.model.ssp.type !== 'plant'
          && o.model.ssp.type !== 'tree'
          && o.model.ssp.type !== 'bullet'
        )
      )
      .map((obj) => obj.model.collisionBox())
  }
}

export { Game };
