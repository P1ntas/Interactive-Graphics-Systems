import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/**
 * Represents a house in a 3D environment, managing its loading, scaling, and positioning.
 */
class MyHouse {
    /**
     * Constructs a MyHouse object.
     * @param {number} x The x-coordinate of the house in the 3D world.
     * @param {number} y The y-coordinate of the house in the 3D world.
     * @param {number} z The z-coordinate of the house in the 3D world.
     * @param {THREE.Scene} scene The scene to which the house will be added.
     */ 
    constructor(x, y, z, scene) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.scene = scene;
        this.modelPath = './scenes/models/house.glb';
        this.model = null;
    }

    /**
     * Initializes the house by loading the model and setting its position and scale.
     */
    init() {
        const loader = new GLTFLoader();

        loader.load(this.modelPath, (gltf) => {
            this.model = gltf.scene;
            this.model.rotation.y = Math.PI / 2;
            this.model.position.set(this.x, this.y, this.z);
            this.model.position.y += 0.5
            this.model.scale.set(5, 5, 5);
            this.scene.add(this.model);
        }, undefined, (error) => {
            console.error('An error happened while loading the model:', error);
        });
    }
}

export { MyHouse };