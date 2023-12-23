import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class MyHouse {

    constructor(x, y, z, scene) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.scene = scene;
        this.modelPath = './scenes/models/house.glb';
        this.model = null;
    }

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