import * as THREE from 'three';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';

class MyNewspaper {
    constructor(x,y,z,scene) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.scene = scene;
        this.group = new THREE.Group();
    }

    init() {
        this.journalTexture = new THREE.TextureLoader().load('img/journalTexture.jpg');
        this.material = new THREE.MeshLambertMaterial({map: this.journalTexture, side: THREE.DoubleSide});
        this.samplesU = 24;
        this.samplesV = 24;
        this.orderU = 5;
        this.orderV = 1;
        const myNurbsBuilder = new MyNurbsBuilder();

        const controlVertexes = [
            [
                [0, 0, 0.5, 1],
                [-0.5, 0.25, -0.5, 1],
            ],
            [
                [0, 0.25, 0.5, 1],
                [0, 0.25, -0.5, 1],
            ],
            [
                [0, 0.5, 0.5, 1],
                [0, 0.5, -0.5, 1],
            ],
            [
                [0.5, 0.5, 0.5, 1],
                [0.5, 0.5, -0.5, 1],
            ],
            [
                [0.5, 0.25, 0.5, 1],
                [0.5, 0.25, -0.5, 1],
            ],
            [
                [1, 0.25, 0.5, 1],
                [1, 0.25, -0.5, 1],
            ]
        ];
            
        

        let nurb_geometry = myNurbsBuilder.build(
            controlVertexes,
            this.orderU, 
            this.orderV, 
            this.samplesU,
            this.samplesV, 
            this.material
        )

        this.journalMesh = new THREE.Mesh(nurb_geometry, this.material);
        this.group.add(this.journalMesh);

        this.group.position.set(this.x, this.y, this.z); 
    
    }

}

export { MyNewspaper };
