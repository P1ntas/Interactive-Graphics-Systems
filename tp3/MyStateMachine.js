import * as THREE from 'three';

/**
 * Manages the state transitions within an application, particularly for switching between different camera views.
 */
class MyStateMachine {
    /**
     * Constructs a MyStateMachine object.
     * @param {Object} app The main application context, containing contents and functionalities.
     * @param {Object} cameras An object containing different camera setups for various states.
     */
    constructor(app, cameras) {
        this.app = app;
        this.cameras = cameras;

        this.states = {
            initial: this.cameras['MainMenuCam'],
            game: this.cameras['GameCam'],
            lost: this.cameras['LostCam'],
            win: this.cameras['WinCam'],
            garage: this.cameras['GarageCam'],
            rivalGarageCam: this.cameras['RivalGarageCam'],
        };

        this.currentState = this.states['initial'];
    }

    /**
     * Updates the current state based on a button press.
     * @param {string} btn_pressed The identifier of the button pressed.
     */
    update(btn_pressed) {
        switch(btn_pressed) {
            case 'start_button':
                this.currentState = this.states['garage'];
                break;
            case 'restart_button':
                this.currentState = this.states['intial'];
                break;
            case 'car_0':
            case 'car_1':
            case 'car_2':
                this.player_car_selected = btn_pressed;
                this.currentState = this.states['rivalGarageCam'];
                this.app.contents.car.changeColor(this.app.contents.carsUtils.car_meshes.find(carMesh => carMesh.name === btn_pressed).userData.originalColor);
                break;
            case 'car_rival_0':
            case 'car_rival_1':
            case 'car_rival_2':
                this.rival_car_selected = btn_pressed;
                this.currentState = this.states['game'];
                this.app.contents.timer.start();

                // Update the player car and the opponent car colors
                // this.app.contents.rival.changeColor()
                this.app.contents.rival.changeColor(this.app.contents.carsRivalUtils.car_meshes.find(carMesh => carMesh.name === btn_pressed).userData.originalColor);
                
                break;
            default:
                break;
        }
    }
}


export { MyStateMachine }
