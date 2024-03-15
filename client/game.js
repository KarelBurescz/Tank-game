class Game {
  constructor(bgcanvas, bgctx) {
    this.bgcanvas = bgcanvas;
    this.bgctx = bgctx;
    this.objects = {};
    this.animations = [];
    this.oponents = {};
    this.player = null;
    this.readyToDraw = false;

    this.gameStats = {
      clientUps: 0,
      clientTps: 0,
      largestClientUpsDelta: 0,
    };

    //TODO: In future refactor that into separate class
    this.lastUpsUpdate = this.now();
    this.numOfDataUpdates = 0;

    this.previousUpdateTime = this.now();
    this.largestUpdateDelta = 0;
    
    this.lastTpsUpdate = this.now();
    this.numOfSceneDraws = 0;
    
    this.statsComputeScheduler = null;
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

  start() {
    this.statsComputeScheduler = setInterval( this.updateStats.bind(this) ,1000)
  }

  addObject(object) {
    this.objects[object.model.ssp.id] = object;
  }

  hasObject(id) {
    return this.objects.hasOwnProperty(id);
  }

  getObjectIds() {
    return Object.keys(this.objects);
  }

  getObject(id) {
    return this.objects[id];
  }

  getObjectsArray() {
    return Object.values(this.objects);
  }

  removeObject(id) {
    delete this.objects[id];
  }

  eachObject(func) {
    Object.keys(this.objects).forEach((o) => func(this.objects[o]));
  }

  setPlayer(player) {
    this.player = player;
    this.addObject(player);
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
