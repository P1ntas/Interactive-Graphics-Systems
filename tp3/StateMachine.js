import * as THREE from 'three';

class StateMachine {
    constructor(app, cameras) {
        this.app = app;
        this.cameras = cameras;

        this.states = {
            initial: this.cameras['MainMenuCam'],
            game: this.cameras['GameCam'],
            lost: this.cameras['LostCam'],
            win: this.cameras['WinCam'],
            garage: this.cameras['GarageCam'],
            rivalGarageCam: this.cameras['MyRivalGarageCam'],
        };

        this.currentState = this.states.initial;
    }

    update(btn_pressed) {
        switch(btn_pressed) {
            case 'startButton':
                this.currentState = this.states.initial;
                break;
            case 'game':
                this.currentState = this.states.initial;
                break;
            case 'restartButton':
                this.currentState = this.states.initial;
                break;
            case 'lost':
                this.currentState = this.states.initial;
                break;
            case 'win':
                this.currentState = this.states.initial;
                break;
            default:
                break;
        }
    }
}


export { StateMachine }
