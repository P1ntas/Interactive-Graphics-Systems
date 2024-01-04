import * as THREE from 'three';

/**
 * Represents a timer for tracking elapsed time in an application or game.
 */
class MyTimer {
    /**
     * Constructs a MyTimer object.
     * @param {Object} contents Contains additional data and resources needed for the timer.
     */
    constructor(contents) {
        this.contents = contents;
        this.elapsedTime = 0;
        this.lastUpdateTime = 0;
        this.running = false;
        this.paused = false;
    }

    /**
     * Starts the timer.
     */
    start() {
        if (!this.running) {
            this.lastUpdateTime = Date.now();
            this.running = true;
            this.paused = false;
        }
    }

    /**
     * Stops the timer and updates the elapsed time.
     */
    stop() {
        this.update();
        this.running = false;
    }

    /**
     * Pauses the timer if it is running.
     */
    pause() {
        if (this.running && !this.paused) {
            this.update();
            this.paused = true;
        }
    }

    /**
     * Resumes the timer if it has been paused.
     */
    resume() {
        if (this.running && this.paused) {
            this.lastUpdateTime = Date.now();
            this.paused = false;
        }
    }

    /**
     * Updates the elapsed time of the timer.
     */
    update() {
        if (this.running && !this.paused) {
            const currentTime = Date.now();
            this.elapsedTime += currentTime - this.lastUpdateTime;
            this.lastUpdateTime = currentTime;
        }
        
    }

    /**
     * Adds a specified number of seconds to the elapsed time.
     * @param {number} seconds The number of seconds to add.
     */
    addTime(seconds) {
        this.elapsedTime += seconds * 1000;
    }

    /**
     * Subtracts a specified number of seconds from the elapsed time.
     * @param {number} seconds The number of seconds to subtract.
     */
    takeTime(seconds) {
        this.elapsedTime = Math.max(0, this.elapsedTime - seconds * 1000);
    }

    /**
     * Gets the elapsed time since the timer was started.
     * @returns {number} The elapsed time in milliseconds.
     */
    getElapsedTime() {
        this.update();
        return this.elapsedTime;
    }

    /**
     * Gets the formatted elapsed time in minutes and seconds.
     * @returns {string} The formatted time as a string in the format "mm:ss".
     */
    getFormattedTime() {
        const totalSeconds = Math.floor(this.getElapsedTime() / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}

export { MyTimer }