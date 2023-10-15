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
        this.material = new THREE.MeshLambertMaterial({map: this.jarTexture, side: THREE.DoubleSide});
        this.meshes = [];
        this.samplesU = 16;
        this.samplesV = 16;
        this.createNurbsSurfaces();
    }

    createNurbsSurfaces() {
        let orderU = 2;
        let orderV = 2;
        const myNurbsBuilder = new MyNurbsBuilder();

        const controlVertexes = [
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

        let nurb_geometry = myNurbsBuilder.build(
            controlVertexes,
            orderU,
            orderV,
            this.samplesU,
            this.samplesV,
            this.material
        );

        this.right = new THREE.Mesh(nurb_geometry, this.material);
        this.left = new THREE.Mesh(nurb_geometry, this.material);
        this.left.scale.set(1,1,-1);
        this.group.add(this.right);
        this.group.add(this.left); 

        this.group.position.set(this.x, this.y, this.z); 
        this.group.scale.set(1,0.8,1);
    }
}

export { MyJar };

