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
        this.candleMesh
        this.fireMesh
        this.fireMesh2
    }

    /**
     * initializes the contents
     */
    init() {
        let myCake = new THREE.CylinderGeometry(
            1, 1, 1,
            12, 2,
            false,
            Math.PI * 0.25, Math.PI * 1.78);

        let cakeMaterial = new THREE.MeshPhongMaterial({ color: "#FFC0CB", side: THREE.DoubleSide});
        
        this.mesh = new THREE.Mesh(myCake, cakeMaterial);        
        this.mesh.position.set(this.x,this.y, this.z);

        let myCandle = new THREE.CylinderGeometry(
            0.1, 0.1, 0.8,
            12);

        let candleMaterial = new THREE.MeshPhongMaterial({ color: "#FFFFFF"});
        
        this.candleMesh = new THREE.Mesh(myCandle, candleMaterial);        
        this.candleMesh.position.set(this.x,this.y + 0.9, this.z);

        let halfSphere = new THREE.SphereGeometry( 0.1, 10, 5, 0, Math.PI * 2, 0, Math.PI / 2 );
        let fireMaterial = new THREE.MeshPhongMaterial({ color: "#E25822", side: THREE.DoubleSide});
        
        this.fireMesh = new THREE.Mesh(halfSphere, fireMaterial);   
        this.fireMesh.rotateX(Math.PI)
        this.fireMesh.position.set(this.x,this.y + 1.4, this.z);

        let cone = new THREE.ConeGeometry( 0.1, 0.4, 16 );
        
        this.fireMesh2 = new THREE.Mesh(cone, fireMaterial);   
        //this.fireMesh.rotateX(Math.PI)
        this.fireMesh2.position.set(this.x,this.y + 1.6, this.z);
    }
}

export { MyCake };