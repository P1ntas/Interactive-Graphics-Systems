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

    init() {
        const loader = new GLTFLoader();

        loader.load(this.modelPath, (gltf) => {
            this.model = gltf.scene;
            this.model.rotation.y = Math.PI / 2;
            this.model.position.set(this.x, this.y, this.z);
            this.model.position.y += 0.5
            this.model.scale.set(1, 1, 1);
            this.scene.add(this.model);
        }, undefined, (error) => {
            console.error('An error happened while loading the model:', error);
        });
    }
}

export { MyGarage };