import { Config } from "./config.js";

import { Obstacle } from "../model/obstacle.js";
import { Tree } from "../model/tree.js";
import { Solider } from "../model/solider.js";

/**
 * Keeps the game mechanics and the game objects for a single room.
 *
 * @typedef { Object } RoomRuntime
 * @property { Map<Number, Solider> } playerSoliders - A key-value store for the game objects representing the players. The key is the object's ID.
 *
 */

class RoomRuntime {
  /**
   * Constructs a new instance of RoomRuntime.
   * Initializes an empty Map to store player soldiers.
   */
  constructor() {
    this.playerSoliders = new Map();
    this.objects = [];

    this.lastTime = this.now();
    this.clocktime = 0;
    this.ticks = 0;
    this.currentTps = 0;

    this.running = false;
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
      solider = Solider.CreateOnRandomPosition(this);
      solider.playerSocketId = player.socket.id;
      this.playerSoliders.set(solider.id, solider);
    }

    return solider.id;
  }

  /**
   * Creates a scene at the startup, randomly placed walls and trees.
   * Populates the this.objects property.
   */
  initScene(){

    for (let i = 0; i <= Config.gameRoom.numOfObstacles; i++) {
      const myX = Math.random() * (Config.gameRoom.sizeX - 80) + 40;
      const myY = Math.random() * (Config.gameRoom.sizeY - 80) + 40;

      let myWidth = 30;
      let myHeight = Math.random() * 200 + 70;

      if (Math.random() > 0.5) {
        myWidth = myHeight;
        myHeight = 30;
      }

      const maybeWall = new Obstacle(this, myX, myY, myWidth, myHeight, 100, "");

      const wallCollides = this.objects.some((e) => {
        if (e.collides(maybeWall)) {
          return true;
        }
      });

      if (wallCollides === false) {
        this.objects.push(maybeWall);
      }
    }

    for (let j = 0; j <= Config.gameRoom.numOfTrees; ++j) {
      const myX = Math.random() * (Config.gameRoom.sizeX - 80) + 40;
      const myY = Math.random() * (Config.gameRoom.sizeY - 80) + 40;

      let myHeight = (Math.random() + 1) * 30;

      const maybeTree = new Tree(this, myX, myY, myHeight, 0, 100);

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
    this.playerSoliders.forEach((p,k,m) => p.update());
    this.objects.forEach(o => o.update())

    this.ticks++;
  }

  /**
   * Start the runtime, schedule the updates, computation of tps.
   */
  start() {
    console.log("    Starting the roomRuntime.")
    this.updatingScheduler = setInterval(() => this.update(), 1000/60);
    this.tpsComputeScheduler = setInterval(() => this.updateTps(), 1000);
    //TODO: Remove later
    this.debugOutputScheduler = setInterval(()=> {
      console.log(this.getInfo(), 3000);
    })

    this.initScene();
    this.running = true;
  }

  /**
   * Stops the update and tps computers.
   */
  stop(){
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

    console.log(`   TPS: ${this.currentTps}`)
    this.lastTime = this.now();
  }

  now() {
    return Number(process.hrtime.bigint() / 1000n);
  }

  getSerializable() {

    let serializable = {
      gameScene: [],
      players: [],
      objects: []
    }

    this.objects.forEach( o => serializable.objects.push(o.getSerializable()));
    this.playerSoliders.forEach( p => serializable.players.push(p.getSerializable()));

    return serializable;
  }

  serializeToJson() {
    return JSON.stringify(this.getSerializable(), undefined, "  ");
  }

  /**
   * Retrieves information about the current state of the room.
   *
   * @returns {String} A string representation of the current state of the room.
   */
  getInfo() {
    let str = "";
    str += `    RoomRuntime, num of players: ${this.playerSoliders.size}\n`;
    for (const [k, v] of this.playerSoliders) {
      str += `      solider: { id: ${v.id}, playerId: ${v.playerSocketId}}\n`;
    }
    str += `      objects json: \n${this.serializeToJson()}`
    return str;
  }
}

export { RoomRuntime };
