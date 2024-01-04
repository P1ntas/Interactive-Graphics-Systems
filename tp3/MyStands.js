import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/**
 * Represents stands in a 3D environment, handling their loading and rendering.
 */
class MyStands {
    /**
     * Constructs a MyStands object.
     * @param {number} x The x-coordinate of the stands in the 3D world.
     * @param {number} y The y-coordinate of the stands in the 3D world.
     * @param {number} z The z-coordinate of the stands in the 3D world.
     * @param {THREE.Scene} scene The scene to which the stands will be added.
     */
    constructor(x, y, z, scene) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.scene = scene;
        this.modelPath = './scenes/models/stands.glb';
        this.model = null;
        this.textureLoader = new THREE.TextureLoader();
        this.texturePath = './scenes/textures/RGB_7f9ea787d03a4ad6b1e636fe64c898c4_Bench.png';
    }

    /**
     * Initializes the stands by loading the model and applying the texture.
     */
    init() {
        const loader = new GLTFLoader();
        const texture = this.textureLoader.load(this.texturePath);
        loader.load(this.modelPath, (gltf) => {
            gltf.scene.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    let material = new THREE.MeshPhongMaterial({
                        map: texture
                    });

                    child.material = material;
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            this.model = gltf.scene;
            //this.model.rotation.y = Math.PI / 2;
            this.model.position.set(this.x, this.y, this.z);
            this.model.position.y += 1.5
            this.model.scale.set(0.002, 0.002, 0.002);
            this.scene.add(this.model);
        }, undefined, (error) => {
            console.error('An error happened while loading the model:', error);
        });
    }
}

export { MyStands };