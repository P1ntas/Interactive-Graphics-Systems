import * as THREE from 'three';

class MyTimer {
    constructor() {
        this.startTime = Date.now();
        this.elapsedTime = 0; 
        this.paused = false;
    }

    start() {
        this.startTime = Date.now() - this.elapsedTime;
        this.paused = false;
    }

    pause() {
        this.update();
        this.paused = true;
    }

    update() {
        if (!this.paused) {
            const currentTime = Date.now();
            this.elapsedTime = currentTime - this.startTime;
        }
    }

    addTime(milliseconds) {
        this.elapsedTime += milliseconds;
    }

    getElapsedTime() {
        this.update();
        return this.elapsedTime;
    }

    formatTime() {
        let seconds = Math.floor(this.getElapsedTime() / 1000);
        let minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}

export { MyTimer }