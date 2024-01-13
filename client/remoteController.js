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
            this.playerObject.model.csp.movingFoward = true;
            this.playerObject.model.csp.movingBack = false;
        }

        ret[config.p1.backward] = () => {
            this.playerObject.model.csp.movingFoward = false;
            this.playerObject.model.csp.movingBack = true;
        }

        ret[config.p1.right] = () => this.playerObject.model.csp.rotatingRight = true;
        ret[config.p1.left] = () => this.playerObject.model.csp.rotatingLeft = true;
        ret[config.p1.turret_left] = () => this.playerObject.model.csp.turretMovingLeft = true;
        ret[config.p1.turret_right] = () => this.playerObject.model.csp.turretMovingRight = true;
        ret[config.p1.fire] = () => this.playerObject.model.csp.firing=true;
        ret[config.p1.nitro] = () => this.playerObject.model.csp.speedBoost = true;
        ret[config.p1.focus] = () => this.playerObject.model.csp.focusMode = true;
        ret[config.p1.mineDeploy] = () => this.playerObject.model.csp.mineDeployed = true;
        ret[config.p1.radar] = () => this.playerObject.model.csp.radarOn = true;

        return ret;
    }

    prepareKeyUpHandlers(config) {
        let ret = {};
        ret[config.p1.forward] = () => this.playerObject.model.csp.movingFoward = false;
        ret[config.p1.backward] = () => this.playerObject.model.csp.movingBack = false;
        ret[config.p1.right] = () => this.playerObject.model.csp.rotatingRight = false;
        ret[config.p1.left] = () => this.playerObject.model.csp.rotatingLeft = false;
        ret[config.p1.turret_left] = () => this.playerObject.model.csp.turretMovingLeft = false;
        ret[config.p1.turret_right] = () => this.playerObject.model.csp.turretMovingRight = false;
        ret[config.p1.fire] = () => this.playerObject.model.csp.firing=false;
        ret[config.p1.nitro] = () => this.playerObject.model.csp.speedBoost = false;
        ret[config.p1.focus] = () => this.playerObject.model.csp.focusMode = false;
        ret[config.p1.mineDeploy] = () => this.playerObject.model.csp.mineDeployed = false;
        ret[config.p1.radar] = () => this.playerObject.model.csp.radarOn = false;

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
            JSON.stringify(this.playerObject.model.csp, null, " "),
        );
    }
}

export { RemoteController }
