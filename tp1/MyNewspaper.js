import * as THREE from 'three';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';

class MyNewspaper {

    /**
     * Constructor for the MyNewspaper class
     * @param {number} x - X position of the newspaper in 3D space
     * @param {number} y - Y position of the newspaper in 3D space
     * @param {number} z - Z position of the newspaper in 3D space
     * @param {THREE.Scene} scene - The scene in which the newspaper will be rendered
     */
    constructor(x,y,z,scene) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.scene = scene;
        this.group = new THREE.Group();
    }

    init() {
        // Set texture properties such as wrapping and repetition.
        this.journalTexture = new THREE.TextureLoader().load('img/journalTexture.jpg');
        this.journalTexture.wrapS = THREE.RepeatWrapping
        this.journalTexture.wrapT = THREE.RepeatWrapping

        let planeSizeU = 2;
        let planeSizeV = 1;
        let planeUVRate = planeSizeV/planeSizeU;
        let planeTextureUVRate = 4558/6546; 
        let planeTextureRepeatU = 1;
        let planeTextureRepeatV = planeTextureRepeatU * planeUVRate * planeTextureUVRate;
        this.journalTexture.repeat.set(planeTextureRepeatU, planeTextureRepeatV );
        this.journalTexture.rotation = 0;
        this.journalTexture.offset = new THREE.Vector2(0,0);


        this.material = new THREE.MeshLambertMaterial({map: this.journalTexture, side: THREE.DoubleSide});
        this.samplesU = 24;
        this.samplesV = 24;
        this.orderU = 5;
        this.orderV = 1;
        const myNurbsBuilder = new MyNurbsBuilder();

        // Define control vertexes to create the newspaper shape.
        const controlPoints = [
            [ // Row 1
                [0.25, 0, 0.5, 1],
                [0.25, 0, -0.5, 1],
            ],
            [ // Row 2
                [0.25, 0.25, 0.5, 1],
                [0.25, 0.25, -0.5, 1],
            ],
            [ // Row 3
                [0.25, 0.5, 0.5, 1],
                [0.25, 0.5, -0.5, 1],
            ],
            [ // Row 4 (Cylinder-like shape)
                [0.5, 1, 0.5, 3],
                [0.5, 1, -0.5, 3],
            ],
            [ // Row 5 (Cylinder-like shape)
                [0.5, 0.25, 0.5, 1],
                [0.5, 0.25, -0.5, 1],
            ],
            [ // Row 6 (Cylinder-like shape)
                [0.5, 0, 0.5, 1],
                [0.5, 0, -0.5, 1],
            ]
        ];
            
        // Build the NURBS geometry for the newspaper.
        let nurb_geometry = myNurbsBuilder.build(
            controlPoints,
            this.orderU, 
            this.orderV, 
            this.samplesU,
            this.samplesV, 
            this.material
        )

        this.journalMesh = new THREE.Mesh(nurb_geometry, this.material);

        this.journalMesh.rotateZ(Math.PI / 1.7);

        this.journalMesh.translateX(-0.02);

        this.journalMesh.receiveShadow = true;
        this.journalMesh.castShadow = true;

        this.group.add(this.journalMesh);

        this.group.position.set(this.x, this.y, this.z); 
    
    }

}

export { MyNewspaper };
