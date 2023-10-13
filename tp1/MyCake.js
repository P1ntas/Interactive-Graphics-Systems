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
        this.leftPlaneMesh
        this.rightPlaneMesh

        this.group = new THREE.Group()
    }

    /**
     * initializes the contents
     */
    init() {
        let myCake = new THREE.CylinderGeometry(
            1, 1, 1,
            24, 2,
            false,
            Math.PI * 0.25, Math.PI * 1.75);

        let cakeMaterial = new THREE.MeshPhongMaterial({ color: "#FFC0CB", side: THREE.DoubleSide});
        
        this.mesh = new THREE.Mesh(myCake, cakeMaterial);        
        this.mesh.position.set(this.x,this.y, this.z);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        let leftPlane = new THREE.PlaneGeometry(2, 1);
        this.leftPlaneMesh = new THREE.Mesh(leftPlane, cakeMaterial);
        this.leftPlaneMesh.rotateY(Math.PI*0.5);
        this.leftPlaneMesh.position.set(this.x, this.y, this.z);
        this.leftPlaneMesh.castShadow = true;
        this.leftPlaneMesh.receiveShadow = true;
    

        let rightPlane = new THREE.PlaneGeometry(2, 1);
        this.rightPlaneMesh = new THREE.Mesh(rightPlane, cakeMaterial);
        this.rightPlaneMesh.rotateY(Math.PI*0.75);
        this.rightPlaneMesh.position.set(this.x, this.y, this.z);
        this.rightPlaneMesh.castShadow = true;
        this.rightPlaneMesh.receiveShadow = true;

        let myCandle = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 12);

        let candleMaterial = new THREE.MeshPhongMaterial({ color: "#FFFFFF"});
        
        this.candleMesh = new THREE.Mesh(myCandle, candleMaterial);        
        this.candleMesh.position.set(this.x,this.y + 0.75, this.z);
        this.candleMesh.castShadow = true;
        this.candleMesh.receiveShadow = true;

        let halfSphere = new THREE.SphereGeometry(0.1, 10, 5, 0, Math.PI * 2, 0, Math.PI / 2);
        let fireMaterial = new THREE.MeshPhongMaterial({ color: "#E25822", side: THREE.DoubleSide});
        
        this.fireMesh = new THREE.Mesh(halfSphere, fireMaterial);   
        this.fireMesh.rotateX(Math.PI)
        this.fireMesh.position.set(this.x,this.y + 1.2, this.z);
        this.leftPlaneMesh.castShadow = true;
        this.leftPlaneMesh.receiveShadow = true;

        let cone = new THREE.ConeGeometry( 0.1, 0.4, 16 );
        
        this.fireMesh2 = new THREE.Mesh(cone, fireMaterial);   
        //this.fireMesh.rotateX(Math.PI)
        this.fireMesh2.position.set(this.x,this.y + 1.4, this.z);
        this.fireMesh2.castShadow = true;
        this.fireMesh2.receiveShadow = true;
       
    }
}

export { MyCake };