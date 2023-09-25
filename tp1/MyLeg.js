import * as THREE from 'three';

/**
 *  This class contains the contents of out application
 */
class MyLeg  {

    /**
       constructs the object
       @param {MyLeg} app The application object
    */ 
    constructor(x,y,z, scene) {
        this.x = x
        this.y = y
        this.z = z
        this.scene = scene
        this.mesh
    }

    /**
     * initializes the contents
     */
    init() {
        let leg = new THREE.CylinderGeometry(0.5,0.5,8,32);
        let legMaterial = new THREE.MeshPhongMaterial({ color: "#4b3621"});
        this.mesh = new THREE.Mesh(leg, legMaterial);
        
        this.mesh.position.set(this.x,this.y, this.z);
    }
}

export { MyLeg };