import * as THREE from 'three';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';

class MyJar {
    constructor(x,y,z,scene) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.scene = scene;
        this.group = new THREE.Group() 
    }

    init() {
        this.jarTexture = new THREE.TextureLoader().load('img/jarTexture.jpg');
        this.material = new THREE.MeshLambertMaterial({map: this.jarTexture});
        this.meshes = [];
        this.samplesU = 16;
        this.samplesV = 16;
        this.createNurbsSurfaces();
    }

    createNurbsSurfaces() {
        let orderU = 4;
        let orderV = 2;
        const myNurbsBuilder = new MyNurbsBuilder();

        const controlVertexes = [
            // U = 0
            [
                [-0.5, -2, 0, 1],
                [0, -2, 1, 1],
                [0.5, -2, 0, 1],
            ],
            // U = 1
            [
                [-0.25, -1.5, 0, 1],
                [0, -1.5, 0, 1],
                [0.25, -1.5, 0, 1],
            ],
            // U = 2
            [
                [-1, -0.5, 0, 1],
                [0, -0.5, 3.5, 1],
                [1, -0.5, 0, 1],
            ],
            // U = 3
            [
                [-0.25, 0, 0, 1],
                [0, 0, -0.5, 1],
                [0.25, 0, 0, 1],
            ],
            // U = 4
            [
                [-0.25, 0.25, 0, 1],
                [0, 0.25, 0.5, 1],
                [0.25, 0.25, 0, 1],
            ]
        ];

        let nurb_geometry = myNurbsBuilder.build(
            controlVertexes,
            orderU,
            orderV,
            this.samplesU,
            this.samplesV,
            this.material
        );

        this.mesh = new THREE.Mesh(nurb_geometry, this.material);

        this.mesh.position.set(this.x, this.y, this.z); 
        this.group.add(this.mesh); 
    }
}

export { MyJar };
