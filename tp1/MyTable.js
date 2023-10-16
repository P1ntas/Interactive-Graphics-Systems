import * as THREE from 'three';
import { MyLeg } from './MyLeg.js';
import { MyCake } from './MyCake.js';
import { MyNewspaper } from './MyNewspaper.js';

/**
 * This class represents a 3D table object in the scene.
 */
class MyTable  {

    /**
     * Constructor for the MyTable class.
     * @param {number} x - X position of the table in 3D space.
     * @param {number} y - Y position of the table in 3D space.
     * @param {number} z - Z position of the table in 3D space.
     * @param {THREE.Scene} scene - The scene in which the table will be rendered.
     */
    constructor(x, y, z, scene) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.scene = scene;
        this.myCake = null; // Reference to the cake on the table.
        this.group = new THREE.Group();
    }

    /**
     * Initializes the contents of the table.
     */
    init() {
        // Load and configure the table texture.
        this.tableTexture = new THREE.TextureLoader().load('img/table.png');
        this.tableTexture.wrapS = THREE.RepeatWrapping;
        this.tableTexture.wrapT = THREE.RepeatWrapping;

        let planeSizeU = 9;
        let planeSizeV = 1;
        let planeUVRate = planeSizeV / planeSizeU;
        let planeTextureUVRate = 777 / 381;
        let planeTextureRepeatU = 1;
        let planeTextureRepeatV = planeTextureRepeatU * planeUVRate * planeTextureUVRate;
        this.tableTexture.repeat.set(planeTextureRepeatU, planeTextureRepeatV);
        this.tableTexture.rotation = 0;
        this.tableTexture.offset = new THREE.Vector2(0, 0);

        // Create the table's geometry and material.
        let table = new THREE.BoxGeometry(9, 0.7, 5);
        let tableMaterial = new THREE.MeshPhongMaterial({ map: this.tableTexture });
        this.tableMesh = new THREE.Mesh(table, tableMaterial);
        this.tableMesh.position.set(0, 3, 0);

        // Create and initialize table legs, cake, and newspaper.
        let myLeg1 = new MyLeg(-3, -1.45, -1.5, "leg", this.scene);
        let myLeg2 = new MyLeg(3, -1.45, 1.5, "leg", this.scene);
        let myLeg3 = new MyLeg(3, -1.45, -1.5, "leg", this.scene);
        let myLeg4 = new MyLeg(-3, -1.45, 1.5, "leg", this.scene);
        let myLeg5 = new MyLeg(0, 0.4, 0, "plate", this.scene);
        this.myCake = new MyCake(0, 0.8, 0, this.scene);
        let myCakeInner = new MyCake(0, 0.8, 0, this.scene);
        this.newspaper = new MyNewspaper(-3, 0.2, 1.3, this.scene);

        myLeg1.init();
        myLeg2.init();
        myLeg3.init();
        myLeg4.init();
        myLeg5.init();
        this.myCake.init();
        myCakeInner.init();
        this.newspaper.init();

        this.tableMesh.receiveShadow = true;
        this.tableMesh.castShadow = true;

        // Add components to the table.
        this.tableMesh.add(myLeg1.mesh);
        this.tableMesh.add(myLeg2.mesh);
        this.tableMesh.add(myLeg3.mesh);
        this.tableMesh.add(myLeg4.mesh);
        this.tableMesh.add(myLeg5.mesh);
        this.tableMesh.add(this.myCake.mesh);
        this.tableMesh.add(this.myCake.candleMesh);
        this.tableMesh.add(this.myCake.fireMesh);
        this.tableMesh.add(this.myCake.fireMesh2);
        this.tableMesh.add(this.myCake.leftPlaneMesh);
        this.tableMesh.add(this.myCake.rightPlaneMesh);
        this.tableMesh.add(this.newspaper.group);

        // Add the table to the group.
        this.group.add(this.tableMesh);
    }
}

export { MyTable };
