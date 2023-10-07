import * as THREE from 'three';

/**
 *  This class contains the contents of out application
 */
class MyTarpet  {

    /**
       constructs the object
       @param {MyTarpet} app The application object
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
        let tarpet = new THREE.PlaneGeometry(15, 10);
        this.tarpetMaterial = new THREE.MeshPhongMaterial({color: "#ffffff", map : this.tarpetTexture});
        this.tarpetMesh = new THREE.Mesh(tarpet, this.tarpetMaterial);
        this.tarpetMesh.rotation.x = -Math.PI / 2;
        this.tarpetMesh.position.set(this.x,this.y, this.z);
    }
}

export { MyTarpet };