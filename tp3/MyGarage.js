import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/**
 * Represents a garage in a 3D environment, managing its loading, scaling, and positioning.
 */
class MyGarage {
    /**
     * Constructs a MyGarage object.
     * @param {number} x The x-coordinate of the garage in the 3D world.
     * @param {number} y The y-coordinate of the garage in the 3D world.
     * @param {number} z The z-coordinate of the garage in the 3D world.
     * @param {THREE.Scene} scene The scene to which the garage will be added.
     */
    constructor(x, y, z, scene) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.scene = scene;
        this.modelPath = './scenes/models/garage.glb';
        this.model = null;
    }

    /**
     * Initializes the garage by asynchronously loading the model and setting its position and scale.
     * @returns {Promise<THREE.Group>} A promise that resolves with the loaded model.
     */
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