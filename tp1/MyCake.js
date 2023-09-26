import * as THREE from 'three';

/**
 *  This class contains the contents of out application
 */
class MyCake  {

    /**
       constructs the object
       @param {MyCake} app The application object
    */ 
    constructor(x,y,z,scene) {
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
        let myCake = new THREE.CylinderGeometry(
            1, 1, 1,
            12, 2,
            false,
            Math.PI * 0.25, Math.PI * 1.78 );

        let cakeMaterial = new THREE.MeshPhongMaterial({ color: "#FFC0CB"});
        
        this.mesh = new THREE.Mesh(myCake, cakeMaterial);        
        this.mesh.position.set(this.x,this.y, this.z);
    }
}

export { MyCake };