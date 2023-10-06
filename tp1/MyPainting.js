import * as THREE from 'three';

/**
 *  This class contains the contents of out application
 */
class MyPainting  {

    /**
       constructs the object
       @param {MyPainting} app The application object
    */ 
    constructor(x,y,z,scene) {
        this.x = x
        this.y = y
        this.z = z
        this.scene = scene

        this.paintingTexture = new THREE.TextureLoader().load('img/paisagem.jpg');
    }

    /**
     * initializes the contents
     */
    init() {
        let frame = new THREE.BoxGeometry(8,4,0.8);
        let frameMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff", specular: "#ffffff", emissive: "#e8e4c9", shininess: 100});

        let painting = new THREE.BoxGeometry(7.6,3.6,0.1);
        let paintingMaterial = new THREE.MeshPhongMaterial({map: this.paintingTexture});

        this.mesh = new THREE.Mesh(frame, frameMaterial);
        this.pmesh = new THREE.Mesh(painting, paintingMaterial);
        
        this.mesh.position.set(this.x,this.y, this.z);
        this.pmesh.position.set(this.x,this.y,this.z+0.4);
    }
}

export { MyPainting };