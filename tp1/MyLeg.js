import * as THREE from 'three';

/**
 *  This class contains the contents of out application
 */
class MyLeg  {

    /**
       constructs the object
       @param {MyLeg} app The application object
    */ 
    constructor(x,y,z,type, scene) {
        this.x = x
        this.y = y
        this.z = z
        this.scene = scene
        this.mesh
        this.type = type
    }

    /**
     * initializes the contents
     */
    init() {
        let leg;
        let legMaterial;
        if (this.type === "leg") {
            leg = new THREE.CylinderGeometry(0.4,0.4,3,32);
            legMaterial = new THREE.MeshPhongMaterial({ color: "#A1662F", specular: "#ffffff", shininess: 100});
        }
        else if (this.type === "plate") {
            leg = new THREE.CylinderGeometry(0.5,1.3,0.1,32);
            legMaterial = new THREE.MeshPhongMaterial({ color: "#FFFFFF"});
        }
        
        this.mesh = new THREE.Mesh(leg, legMaterial);

        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        
        this.mesh.position.set(this.x,this.y, this.z);
    }
}

export { MyLeg };