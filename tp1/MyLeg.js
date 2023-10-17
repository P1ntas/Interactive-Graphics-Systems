import * as THREE from 'three';

/**
 *  This class contains the contents of out application
 */
class MyLeg  {

    /**
     * Constructor for the MyLeg class
     * @param {number} x - X position of the leg in 3D space
     * @param {number} y - Y position of the leg in 3D space
     * @param {number} z - Z position of the leg in 3D space
     * @param {string} type - choose between table leg or plate
     * @param {THREE.Scene} scene - The scene in which the leg will be rendered
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
             // Create a table leg geometry.
            leg = new THREE.CylinderGeometry(0.4,0.4,3,32);
            legMaterial = new THREE.MeshPhongMaterial({ color: "#A1662F", specular: "#ffffff", shininess: 100});
        }
        else if (this.type === "plate") {
            // Create a plate or base geometry.
            leg = new THREE.CylinderGeometry(0.5,1.3,0.1,32);
            legMaterial = new THREE.MeshPhongMaterial({ color: "#FFFFFF"});
        }
        
        this.mesh = new THREE.Mesh(leg, legMaterial);
        
        this.mesh.position.set(this.x,this.y, this.z);
    }
}

export { MyLeg };