import * as THREE from 'three';
import { MyLeg } from './MyLeg.js';
import { MyCake } from './MyCake.js';

/**
 *  This class contains the contents of out application
 */
class MyTable  {

    /**
       constructs the object
       @param {MyTable} app The application object
    */ 
    constructor(x,y,z, scene) {
        this.x = x
        this.y = y
        this.z = z
        this.scene = scene

        this.group = new THREE.Group()

    }

    /**
     * initializes the contents
     */
    init() {

        this.tableTexture = new THREE.TextureLoader().load('img/table.png');
        this.tableTexture.wrapS = THREE.RepeatWrapping
        this.tableTexture.wrapT = THREE.RepeatWrapping

        let planeSizeU = 9;
        let planeSizeV = 1;
        let planeUVRate = planeSizeV/planeSizeU;
        let planeTextureUVRate = 777/381; 
        let planeTextureRepeatU = 1;
        let planeTextureRepeatV = planeTextureRepeatU * planeUVRate * planeTextureUVRate;
        this.tableTexture.repeat.set(planeTextureRepeatU, planeTextureRepeatV );
        this.tableTexture.rotation = 0;
        this.tableTexture.offset = new THREE.Vector2(0,0);

        let table = new THREE.BoxGeometry(9,0.7,5);
        let tableMaterial = new THREE.MeshPhongMaterial({map : this.tableTexture});
        this.tableMesh = new THREE.Mesh(table, tableMaterial);
        this.tableMesh.position.set(0,3,0);
        this.group.add(this.tableMesh)

        let myLeg1 = new MyLeg(-3,-1.45,-1.5,"leg", this.scene);
        let myLeg2 = new MyLeg(3,-1.45,1.5,"leg", this.scene);
        let myLeg3 = new MyLeg(3,-1.45,-1.5,"leg", this.scene);
        let myLeg4 = new MyLeg(-3,-1.45,1.5,"leg", this.scene);
        let myLeg5 = new MyLeg(0,5.55,0,"plate", this.scene);
        let myCake = new MyCake(0,0.8,0, this.scene);
        let myCakeInner = new MyCake(0,0.8,0, this.scene);
        
        
        myLeg1.init();
        myLeg2.init();
        myLeg3.init();
        myLeg4.init();
        myLeg5.init();
        myCake.init();
        myCakeInner.init();

        this.tableMesh.add(myLeg1.mesh);
        this.tableMesh.add(myLeg2.mesh);
        this.tableMesh.add(myLeg3.mesh);
        this.tableMesh.add(myLeg4.mesh);
        this.tableMesh.add(myLeg5.mesh);
        this.tableMesh.add(myCake.mesh);
        this.tableMesh.add(myCake.candleMesh);
        this.tableMesh.add(myCake.fireMesh);
        this.tableMesh.add(myCake.fireMesh2);
        this.tableMesh.add(myCake.leftPlaneMesh);
        this.tableMesh.add(myCake.rightPlaneMesh);

    }
}

export { MyTable };