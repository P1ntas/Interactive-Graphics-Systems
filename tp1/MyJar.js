import * as THREE from 'three';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';

class MyJar {

    /**
     * Constructor for the MyJar class
     * @param {number} x - X position of the jar in 3D space
     * @param {number} y - Y position of the jar in 3D space
     * @param {number} z - Z position of the jar in 3D space
     * @param {THREE.Scene} scene - The scene in which the jar will be rendered
     */
    constructor(x,y,z,scene) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.scene = scene;
        this.group = new THREE.Group() 
    }

    init() {
        this.jarTexture = new THREE.TextureLoader().load('img/jarTexture.jpg');
        this.material = new THREE.MeshLambertMaterial({map: this.jarTexture, side: THREE.DoubleSide});
        this.samplesU = 16;
        this.samplesV = 16;
        this.orderU = 2;
        this.orderV = 2;
        const myNurbsBuilder = new MyNurbsBuilder();

        // Define control points positions for the NURBS surface.
        const controlPoints = [
            [
                [-0.4, 0, 0],
                [-0.4, 1, 0],
                [-0.2, 5, 0]
            ],
            [
                [0, 0, 1],
                [0, 1, 2],
                [0, 5, 0.5]
            ],
            [
                [0.4, 0, 0],
                [0.4, 1, 0],
                [0.2, 5, 0]
            ]
        ];

        // Build the NURBS geometry for the jar using control vertex positions and other parameters.
        let nurb_geometry = myNurbsBuilder.build(
            controlPoints,
            this.orderU,
            this.orderV,
            this.samplesU,
            this.samplesV,
            this.material
        );

        // Create two mesh instances, one for the right side and one for the left side of the jar.
        this.right = new THREE.Mesh(nurb_geometry, this.material);
        this.left = new THREE.Mesh(nurb_geometry, this.material);
        this.left.scale.set(1,1,-1);
        this.left.receiveShadow = true;
        this.right.receiveShadow = true;
        this.left.castShadow = true;
        this.right.castShadow = true;
        this.group.add(this.right);
        this.group.add(this.left); 

        this.group.position.set(this.x, this.y, this.z); 
        this.group.scale.set(1,0.8,1);
    }

}

export { MyJar };