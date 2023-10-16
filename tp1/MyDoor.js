import * as THREE from 'three';

/**
 *  This class contains the contents of out application
 */
class MyDoor  {

    /**
     * Constructor for the MyDoor class
     * @param {number} x - X position of the door in 3D space
     * @param {number} y - Y position of the door in 3D space
     * @param {number} z - Z position of the door in 3D space
     * @param {THREE.Scene} scene - The scene in which the door will be rendered
     */
    constructor(x,y,z,scene) {
        this.x = x
        this.y = y
        this.z = z
        this.scene = scene
    }

    /**
     * initializes the contents
     */
    
    init() {
        // Load the door texture
        this.doorTexture = new THREE.TextureLoader().load('img/door.jpg');
        this.doorTexture.wrapS = THREE.RepeatWrapping
        this.doorTexture.wrapT = THREE.RepeatWrapping

        // Set texture properties
        let planeSizeU = 4;
        let planeSizeV = 9.6;
        let planeUVRate = planeSizeV/planeSizeU;
        let planeTextureUVRate = 373/900; 
        let planeTextureRepeatU = 1;
        let planeTextureRepeatV = planeTextureRepeatU * planeUVRate * planeTextureUVRate;
        this.doorTexture.repeat.set(planeTextureRepeatU, planeTextureRepeatV );
        this.doorTexture.rotation = 0;
        this.doorTexture.offset = new THREE.Vector2(0,0);

        // Create the door geometry
        let door = new THREE.BoxGeometry(4,9,0.1);

        // Create the door mesh
        let doorMaterial = new THREE.MeshPhongMaterial({color: "#ffffff", map: this.doorTexture });
        this.mesh = new THREE.Mesh(door, doorMaterial);
        this.mesh.rotateY(-Math.PI / 2);

        this.mesh.position.set(this.x, this.y, this.z);
    }
}

export { MyDoor };