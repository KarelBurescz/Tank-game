globalThis.Audio = class {
    constructor() {
        this.playing = false;
        this.loaded = false;
    }
    play() {
        this.playing = true;
    }
    pause() {
        this.playing = false;
    }
    load() {
        this.loaded = true;
    }
}

globalThis.Image = class { };