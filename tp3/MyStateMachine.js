import * as THREE from 'three';

class MyStateMachine {
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

    update(btn_pressed) {
        switch(btn_pressed) {
            case 'start_button':
                this.currentState = this.states['garage'];
                break;
            case 'restart_button':
                this.currentState = this.states['intial'];
                break;
            case 'car_1':
            case 'car_2':
            case 'car_3':
                this.player_car_selected = btn_pressed;
                this.currentState = this.states['rivalGarageCam'];
                break;
            case 'car_rival_1':
            case 'car_rival_2':
            case 'car_rival_3':
                this.rival_car_selected = btn_pressed;
                this.currentState = this.states['game'];
                break;
            default:
                break;
        }
    }
}


export { MyStateMachine }
