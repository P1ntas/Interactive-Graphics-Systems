import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/**
 * Represents a mushroom object in a 3D environment, handling its loading, scaling, and positioning.
 */
class MyShroom {
    /**
     * Constructs a MyShroom object.
     * @param {number} x The x-coordinate of the mushroom in the 3D world.
     * @param {number} y The y-coordinate of the mushroom in the 3D world.
     * @param {number} z The z-coordinate of the mushroom in the 3D world.
     * @param {THREE.Scene} scene The scene to which the mushroom will be added.
     */
    constructor(x, y, z, scene) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.scene = scene;
        this.modelPath = './scenes/models/mushroom.glb';
        this.model = null;
    }

    /**
     * Initializes the mushroom by loading the model and setting its position and scale.
     */
    init() {
        const loader = new GLTFLoader();

        loader.load(this.modelPath, (gltf) => {
            this.model = gltf.scene;
            this.model.position.set(this.x, this.y, this.z);
            this.model.scale.set(0.3, 0.3, 0.3);
            this.scene.add(this.model);
        }, undefined, (error) => {
            console.error('An error happened while loading the model:', error);
        });
    }
}

export { MyShroom };
