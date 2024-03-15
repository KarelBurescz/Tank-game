import { Config } from "./config.js";

import { Obstacle } from "../model/obstacle.js";
import { Tree } from "../model/tree.js";
import { Solider } from "../model/solider.js";
import { Plant } from "../model/plant.js";
import { Bush } from "../model/bush.js";

/**
 * Keeps the game mechanics and the game objects for a single room.
 *
 * @property { Map<Number, Solider> } playerSoliders - A key-value store for the game objects representing the players.
 * The key is the {@link Solider#playerId} property.
 * @property { Array<ModelObject> } objects - A list of all objects in the room runtime.
 * @property { Number } currentTps - Computed ticks per second if the runtime is running.
 * @property { boolean } running - indicates if the runtime running.
 */
class RoomRuntime {
  /**
   * Constructs a new instance of RoomRuntime.
   */
  constructor() {
    this.playerSoliders = new Map();
    this.objects = [];

    this.lastTime = this.now();
    this.clocktime = 0;
    this.ticks = 0;
    this.currentTps = 0;

    this.running = false;
    this.config = Config;
  }

  /**
   * Creates a solider for a player if it does not already exist.
   *
   * @param {Object} player - The player for whom a solider is to be created.
   * @returns {Number} The ID of the created or existing solider.
   */
  createSoliderIfNotExists(player) {
    let solider = null;

    for (const [k, v] of this.playerSoliders) {
      if (v.PlayerId === player.socket.id) {
        solider = v;
        break;
      }
    }

    if (solider === null) {
      for (let i = 0; i < 1000; i++) {
        solider = Solider.CreateOnRandomPosition(this);
        if (!this.objects.some((e) => e.collides(solider))) {
          solider.playerSocketId = player.socket.id;
          this.playerSoliders.set(solider.ssp.id, solider);
          this.objects.push(solider);

          return solider;
        }
      }

      console.log("Can't place a new player!");
    }

    return null;
  }

  /**
   * Creates a scene at the startup, randomly placed walls and trees.
   * Populates the this.objects property.
   */
  initScene() {
    // Loop for obstacles
    for (let i = 0; i < Config.gameRoom.numOfObstacles; i++) {
      const myX = Math.random() * (Config.gameRoom.sizeX - 80) + 40;
      const myY = Math.random() * (Config.gameRoom.sizeY - 80) + 40;

      let myWidth = 30;
      let myHeight = Math.random() * 200 + 70;

      if (Math.random() > 0.5) {
        myWidth = myHeight;
        myHeight = 30;
      }

      const maybeWall = new Obstacle(
        this,
        myX,
        myY,
        myWidth,
        myHeight,
        100,
        ""
      );

      const wallCollides = this.objects.some((e) => {
        if (e.collides(maybeWall)) {
          return true;
        }
      });

      if (wallCollides === false) {
        this.objects.push(maybeWall);
      }
    }
    // Loop for plants
    for (let i = 0; i < Config.gameRoom.numOfPlants; i++) {
      const myX = Math.random() * (Config.gameRoom.sizeX - 80) + 40;
      const myY = Math.random() * (Config.gameRoom.sizeY - 80) + 40;

      let myWidth = 30;
      let myHeight = 30;

      const maybePlant = new Plant(this, myX, myY, myWidth, myHeight, 100, "");

      const wallCollides = this.objects.some((e) => {
        if (e.collides(maybePlant)) {
          return true;
        }
      });

      if (wallCollides === false) {
        this.objects.push(maybePlant);
      }
    }
    // Loop for bushes
    // Not for loop, to be exactly 10 bushes in the game
    // for (let j = 0; j < Config.gameRoom.numOfBushes; ++j) {
    //   const myX = Math.random() * (Config.gameRoom.sizeX - 80) + 40;
    //   const myY = Math.random() * (Config.gameRoom.sizeY - 80) + 40;

    //   let myWidth = (Math.random() + 2) * 30;

    //   const maybeBush = new Bush(this, myX, myY, myWidth, 0, 100);

    //   const treeCollides = this.objects.some((e) => {
    //     if (e.collides(maybeBush)) {
    //       return true;
    //     }
    //   });

    //   if (!treeCollides) {
    //     this.objects.push(maybeBush);
    //   }
    // }
    let x = 0;
    while (x < Config.gameRoom.numOfBushes) {
      const myX = Math.random() * (Config.gameRoom.sizeX - 80) + 40;
      const myY = Math.random() * (Config.gameRoom.sizeY - 80) + 40;

      let myWidth = (Math.random() + 2) * 30;

      const maybeBush = new Bush(this, myX, myY, myWidth, 0, 100);

      const treeCollides = this.objects.some((e) => {
        if (e.collides(maybeBush)) {
          return true;
        }
      });

      if (!treeCollides) {
        this.objects.push(maybeBush);
        x += 1;
      }
    }
    // Loop for trees
    for (let j = 0; j < Config.gameRoom.numOfTrees; ++j) {
      const myX = Math.random() * (Config.gameRoom.sizeX - 80) + 40;
      const myY = Math.random() * (Config.gameRoom.sizeY - 80) + 40;

      let myWidth = (Math.random() + 2) * 30;

      const maybeTree = new Tree(this, myX, myY, myWidth, 0, 100);

      const treeCollides = this.objects.some((e) => {
        if (e.collides(maybeTree)) {
          return true;
        }
      });

      if (!treeCollides) {
        this.objects.push(maybeTree);
      }
    }
  }

  /**
   * Removes a player's solider from the room.
   *
   * @param {Object} socket - The socket object, based on which the removed solider is found.
   */
  removePlayer(socket) {
    for (const [id, sol] of this.playerSoliders) {
      if (sol.playerSocketId === socket.id) {
        this.playerSoliders.delete(id);
      }
    }
  }

  /**
   * Updates the game state in time, one tick ahead.
   */
  update() {
    this.playerSoliders.forEach((p, k, m) => p.update());
    this.objects.forEach((o) => o.update());

    this.ticks++;
  }

  /**
   * Start the runtime, schedule the updates, computation of tps.
   */
  start() {
    if (this.running) return;
    console.log("    Starting the roomRuntime.");
    this.updatingScheduler = setInterval(this.update.bind(this), 1000 / 60);
    this.tpsComputeScheduler = setInterval(() => this.updateTps(), 1000);
    //TODO: Remove later
    // this.debugOutputScheduler = setInterval(()=> {
    //   console.log(this.getInfo(), 10000);
    // })

    this.initScene();
    this.running = true;
  }

  /**
   * Stops the update and tps computers.
   */
  stop() {
    if (!this.running) return;
    console.log("    Stopping the runtime");
    clearInterval(this.tpsComputeScheduler);
    clearInterval(this.updatingScheduler);
    clearInterval(this.debugOutputScheduler);

    this.objects = [];
    this.running = false;
  }

  /**
   * Computes the ticks per second, and sets it to the currentTps.
   */
  updateTps() {
    const dt = this.now() - this.lastTime;
    this.currentTps = this.ticks * Number(1000000 / dt);
    this.ticks = 0;

    // console.log(`   TPS: ${this.currentTps}`)
    this.lastTime = this.now();
  }

  now() {
    return Number(process.hrtime.bigint() / 1000n);
  }

  getPlayerState(soliderId) {
    let playerSolider = this.playerSoliders.get(soliderId);
    let st = this.getSerializable(soliderId);
    return st;
  }

  getSerializable(soliderId) {
    let serializable = {
      player: {},
      gameStats: {
        serverTps: Math.floor(100 * this.currentTps)/100
      },
      oponents: [],
      objects: {},
    }

    let player;
    
    // Ignore for now.
    // this.objects.forEach( o => serializable.objects.push(o.getSerializable()));
    this.playerSoliders.forEach((p) => {
      if (p.ssp.id == soliderId) {
        // serializable.player = p.getSerializable();
        serializable.player.id = p.ssp.id;
        player = p;
      } else {
        serializable.oponents.push(p.ssp.id);
      }
    });

    let playerSsp = player.ssp;

    this.objects.forEach( o => {
      let dx = playerSsp.x - o.ssp.x;
      let dy = playerSsp.y - o.ssp.y;
      //TODO: Set the limit according to the camera size!, use geometry toolbox for distance!
      if (
        o.ssp.type === "player" || 
        (dx * dx + dy * dy < 160000)
      ) {
        serializable.objects[o.ssp.id] = o.ssp;
      }
    })
    
    let outStr = "";
    Object.keys(serializable.objects).forEach((k) => {
      outStr += `k: ${k} type: ${serializable.objects[k].type}, `;
    });

    // console.log(outStr);
    return serializable;
  }

  serializeToJson() {
    return JSON.stringify(this.getSerializable(), undefined, "  ");
  }

  addObject(object){
    this.objects.push(object);
  }

  getObjects() {
    return this.objects;
  }

  getObject(objectId) {
    let o = this.objects.filter((o) =>  o.ssp.id === objectId );
    if (o.length >= 1) return o[0];

    return undefined;
  }

  removeObject(objectId) {
    this.objects = this.objects.filter((o) => o.ssp.id !== objectId);
    console.log(`Object ${objectId} removed from runtime`);
  }

  /**
   * Retrieves information about the current state of the room.
   *
   * @returns {String} A string representation of the current state of the room.
   */
  getInfo() {
    let str = "";
    // for (const [k, v] of this.playerSoliders) {
    //   str += `      solider: { id: ${v.id}, playerId: ${v.playerSocketId}}\n`;
    // }
    // str += `      objects json: \n${this.serializeToJson()}`
    return str;
  }
}

export { RoomRuntime };
