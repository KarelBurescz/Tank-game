import { GameModel } from './gameModel.js';

class Game {
  constructor(bgcanvas, bgctx){
    this.bgcanvas = bgcanvas;
    this.bgctx = bgctx;
    this.newPlayerCallback = null;;
    
    this.animations = [];
    this.models = [new GameModel(this), new GameModel(this)];

    this.previousModel = this.models[0];
    this.actualModel = this.models[1];

    this.gameStats = {
      clientUps: 0,
      clientTps: 0,
      largestClientUpsDelta: 0,
    };

    this.timeCorrection = 0;

    //TODO: In future refactor that into separate class
    this.lastUpsUpdate = this.now();
    this.numOfDataUpdates = 0;

    this.previousUpdateTime = this.now();
    this.largestUpdateDelta = 0;
    
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
    const now = new Date();
    return now.getTime();
  }

  updateStats() {
    this.checkLargestDelta();
    this.gameStats.largestClientUpsDelta = this.largestUpdateDelta;
    this.largestUpdateDelta = 0;

    this.updateUps();
    this.updateTps();
  }

  // Number of frames drawn per second.
  updateTps() {
    const dt = this.now() - this.lastTpsUpdate;

    // Avoid division by zero.
    if (Math.abs(dt) < 1e-3) return;

    this.gameStats.clientTps = Math.floor(100 * this.numOfSceneDraws * 1000 / dt) / 100;
    this.numOfSceneDraws = 0;
    this.lastTpsUpdate = this.now();
  }

  // Number of data updates from the server per second.
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
    this.statsComputeScheduler = setInterval( this.updateStats.bind(this) ,1000)
  }

  update(gameUpdate) {
    
    this.numOfDataUpdates++;
    this.checkLargestDelta();
    this.previousUpdateTime = this.now();

    this.actualModel.update(gameUpdate);

    if (!this.player && this.getObject(gameUpdate?.player?.id)) {
      const player = this.getObject(gameUpdate.player.id);
      this.setPlayer(player);
      this.newPlayerCallback(this.player);
    }
  
    if (gameUpdate.hasOwnProperty("gameStats")) {
      this.gameStats = {
        ...this.gameStats,
        ...gameUpdate.gameStats
      }
    }
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
    this.actualModel.eachObject(func);
  }

  setPlayer(player) {
    this.models.forEach( (m) => {
      m.setPlayer(player);
      m.addObject(player);
    });
    
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
        )
      )
      .map((obj) => obj.model.collisionBox())
  }
}

export { Game };
