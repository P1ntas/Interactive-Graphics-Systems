import * as THREE from 'three';

class MyTimer {
    constructor() {
        this.elapsedTime = 0;
        this.lastUpdateTime = Date.now();
        this.running = false;
    }

    start() {
        if (!this.running) {
            this.lastUpdateTime = Date.now();
            this.running = true;
        }
    }

    stop() {
        this.update();
        this.running = false;
    }

    update() {
        if (this.running) {
            const currentTime = Date.now();
            this.elapsedTime += currentTime - this.lastUpdateTime;
            this.lastUpdateTime = currentTime;
        }
    }

    addTime(seconds) {
        this.elapsedTime += seconds * 1000;
    }

    takeTime(seconds) {
        this.elapsedTime = Math.max(0, this.elapsedTime - seconds * 1000);
    }

    getElapsedTime() {
        this.update();
        return this.elapsedTime;
    }

    getFormattedTime() {
        const totalSeconds = Math.floor(this.getElapsedTime() / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}


export { MyTimer }