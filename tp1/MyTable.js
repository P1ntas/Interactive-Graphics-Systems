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
        let table = new THREE.BoxGeometry(9,1,5);
        let tableMaterial = new THREE.MeshPhongMaterial({ color: "#4b3621"});
        this.tableMesh = new THREE.Mesh(table, tableMaterial);
        this.tableMesh.position.set(0,5,0);
        this.group.add(this.tableMesh)

        let myLeg1= new MyLeg(-3,1.5,-1.5,"leg", this.scene);
        let myLeg2= new MyLeg(3,1.5,1.5,"leg", this.scene);
        let myLeg3= new MyLeg(3,1.5,-1.5,"leg", this.scene);
        let myLeg4= new MyLeg(-3,1.5,1.5,"leg", this.scene);
        let myLeg5= new MyLeg(0,5.55,0,"plate", this.scene);
        let myCake= new MyCake(0,5.56,0, this.scene);
        
        
        myLeg1.init();
        myLeg2.init();
        myLeg3.init();
        myLeg4.init();
        myLeg5.init();
        myCake.init();

        this.group.add(myLeg1.mesh);
        this.group.add(myLeg2.mesh);
        this.group.add(myLeg3.mesh);
        this.group.add(myLeg4.mesh);
        this.group.add(myLeg5.mesh);
        this.group.add(myCake.mesh);
        this.group.add(myCake.candleMesh);
        this.group.add(myCake.fireMesh)
        this.group.add(myCake.fireMesh2)

    }
}

export { MyTable };