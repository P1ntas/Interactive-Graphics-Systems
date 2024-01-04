import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class MyGarage {

    constructor(x, y, z, scene) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.scene = scene;
        this.modelPath = './scenes/models/garage.glb';
        this.model = null;
    }

    async init() {
        const loader = new GLTFLoader();

        // Return a promise that resolves when the model is loaded
        return new Promise((resolve, reject) => {
            loader.load(this.modelPath, (gltf) => {
                this.model = gltf.scene;
                this.model.rotation.y = Math.PI / 2;
                this.model.position.set(this.x, this.y, this.z);
                this.model.position.y += 0.5;
                this.model.scale.set(1.5, 1.5, 1.5);
                this.model.name = "garage";

                this.scene.add(this.model);

                resolve(this.model); // Resolve the promise with the loaded model
            }, undefined, (error) => {
                console.error('An error happened while loading the model:', error);
                reject(error); // Reject the promise on error
            });
        });
    }
}

export { MyGarage };