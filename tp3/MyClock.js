import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class MyClock {

    // Constructs a MyClock object.
    constructor(x, y, z, scene) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.scene = scene;
        this.modelPath = './scenes/models/clock.glb';
        this.model = null;
    }

    /**
     * Initializes the clock by loading its 3D model and adding it to the scene.
     * Handles the asynchronous loading of the model and sets its position and scale.
     */
    init() {
        const loader = new GLTFLoader();

        loader.load(this.modelPath, (gltf) => {
            this.model = gltf.scene;
            this.model.position.set(this.x, this.y, this.z);
            this.model.position.y += 0.5
            this.model.scale.set(5, 5, 5);
            this.scene.add(this.model);
        }, undefined, (error) => {
            console.error('An error happened while loading the model:', error);
        });
    }
}

export { MyClock };