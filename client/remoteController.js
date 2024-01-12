/**
 * @typedef { Object } RemoteController - provides a binding to a pressed keys, 
 * controlling the state of the object.
 */

class RemoteController {

    constructor(window, playerObject, config, socket) {
        this.window = window;
        this.playerObject = playerObject;
        this.socket = socket;
        this.keyDownHandlers = this.prepareKeyDownHandlers(config);
        this.keyUpHandlers = this.prepareKeyUpHandlers(config);
    }

    prepareKeyDownHandlers(config) {
        let ret = {};
        ret[config.p1.forward] = () => {
            this.playerObject.csp.movingFoward = true;
            this.playerObject.csp.movingBack = false;
        }

        ret[config.p1.backward] = () => {
            this.playerObject.csp.movingFoward = false;
            this.playerObject.csp.movingBack = true;
        }

        ret[config.p1.right] = () => this.playerObject.rotatingRight = true;
        ret[config.p1.left] = () => this.playerObject.rotatingLeft = true;
        ret[config.p1.turret_left] = () => this.playerObject.turretMovingLeft = true;
        ret[config.p1.turret_right] = () => this.playerObject.turretMovingRight = true;
        ret[config.p1.fire] = () => this.playerObject.fire();
        ret[config.p1.nitro] = () => this.playerObject.speedBoost = true;
        ret[config.p1.focus] = () => this.playerObject.focusMode = true;
        ret[config.p1.mineDeploy] = () => this.playerObject.mineDeployed = true;
        ret[config.p1.radar] = () => this.playerObject.radarOn = true;

        return ret;
    }

    prepareKeyUpHandlers(config) {
        let ret = {};
        ret[config.p1.forward] = () => this.playerObject.csp.movingFoward = false;
        ret[config.p1.backward] = () => this.playerObject.csp.movingBack = false;
        ret[config.p1.right] = () => this.playerObject.rotatingRight = false;
        ret[config.p1.left] = () => this.playerObject.rotatingLeft = false;
        ret[config.p1.turret_left] = () => this.playerObject.turretMovingLeft = false;
        ret[config.p1.turret_right] = () => this.playerObject.turretMovingRight = false;
        ret[config.p1.nitro] = () => this.playerObject.speedBoost = false;
        ret[config.p1.focus] = () => this.playerObject.focusMode = false;
        ret[config.p1.mineDeploy] = () => this.playerObject.mineDeployed = false;
        ret[config.p1.radar] = () => this.playerObject.radarOn = false;

        return ret;
    }

    registerController(config) {
        window.addEventListener("keydown", 
            function (e) {
                if (this.keyDownHandlers.hasOwnProperty(e.key)) {
                    this.keyDownHandlers[e.key]();
                    this.updateServerState();
                }
            }.bind(this)
        );
          
        window.addEventListener("keyup",
            function (e) {
                if (this.keyUpHandlers.hasOwnProperty(e.key)) {
                    this.keyUpHandlers[e.key]();
                    this.updateServerState();
                }
            }.bind(this)
        );
    }

    updateServerState() {
        this.socket.emit("update-controller",
            JSON.stringify(this.playerObject.csp, null, " "),
        );
    }
}

export { RemoteController }
