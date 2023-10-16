import * as THREE from 'three';

/**
 *  This class contains the contents of out application
 */
class MyTarpet  {

    /**
    * Constructor for the MyTarpet class
    * @param {number} x - X position of the tarpet in 3D space
    * @param {number} y - Y position of the tarpet in 3D space
    * @param {number} z - Z position of the tarpet in 3D space
    * @param {THREE.Scene} scene - The scene in which the tarpet will be rendered
    */
    constructor(x,y,z,scene) {
        this.x = x
        this.y = y
        this.z = z
        this.scene = scene
        this.tarpetTexture = new THREE.TextureLoader().load('img/tarpet.png');
    
    }

    /**
     * initializes the contents
     */
    init() {
        // Create a carpet plane geometry and apply the carpet texture.
        let tarpet = new THREE.PlaneGeometry(15, 10);
        this.tarpetMaterial = new THREE.MeshPhongMaterial({color: "#ffffff", map : this.tarpetTexture});
        this.tarpetMesh = new THREE.Mesh(tarpet, this.tarpetMaterial);
        this.tarpetMesh.receiveShadow = true;
        this.tarpetMesh.rotation.x = -Math.PI / 2;
        this.tarpetMesh.position.set(this.x,this.y, this.z);
    }
}

export { MyTarpet };