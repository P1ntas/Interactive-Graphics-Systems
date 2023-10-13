import * as THREE from 'three';

/**
 *  This class contains the contents of out application
 */
class MyPainting  {

    /**
       constructs the object
       @param {MyPainting} app The application object
    */ 
    constructor(x,y,z,scene, texture, type) {
        this.x = x
        this.y = y
        this.z = z
        this.scene = scene
        this.type = type

        this.paintingTexture = texture;
        this.group = new THREE.Group()
    }

    /**
     * initializes the contents
     */
    init() {
        if (this.type === "painting") {
            let painting = new THREE.BoxGeometry(3, 3, 0.1);
            let paintingMaterial = new THREE.MeshPhongMaterial({ map: this.paintingTexture });
            let frame = new THREE.BoxGeometry(3.5, 3.5, 0.1);
            let frameMaterial = new THREE.MeshPhongMaterial({ color: "#000000"});
            this.frameMesh = new THREE.Mesh(frame, frameMaterial);
            this.paintingMesh = new THREE.Mesh(painting, paintingMaterial);
            this.paintingMesh.position.set(this.x, this.y, this.z-0.03);
            this.frameMesh.position.set(this.x, this.y, this.z);

            this.group.add(this.paintingMesh);
            this.group.add(this.frameMesh);

        }
         else if (this.type === "car") {
        
            let frame = new THREE.BoxGeometry(8,4,0.4);
            let frameMaterial = new THREE.MeshPhongMaterial({ color: "#383838", specular: "#ffffff", shininess: 100});

            let painting = new THREE.BoxGeometry(7.6,3.6,0.1);
            let paintingMaterial = new THREE.MeshPhongMaterial({map: this.paintingTexture});

            this.mesh = new THREE.Mesh(frame, frameMaterial);
            this.pmesh = new THREE.Mesh(painting, paintingMaterial);

            if (this.type === "car") this.mesh.rotateY(Math.PI / 2)
            
            this.mesh.position.set(this.x,this.y, this.z);
            this.pmesh.position.set(this.x,this.y,this.z+0.18);

            this.group.add(this.mesh)
            this.group.add(this.pmesh)
        }

        else if (this.type === "window") {
            this.windowTexture = new THREE.TextureLoader().load('img/windowFrame.jpg');

            let frame = new THREE.BoxGeometry(9,4.5,0.05);
            let frameMaterial = new THREE.MeshPhongMaterial({map: this.windowTexture});

            let painting = new THREE.BoxGeometry(7.6,3.6,0.05);
            let paintingMaterial = new THREE.MeshPhongMaterial({map: this.paintingTexture});

            this.mesh = new THREE.Mesh(frame, frameMaterial);
            this.pmesh = new THREE.Mesh(painting, paintingMaterial);
            
            this.mesh.position.set(this.x,this.y, this.z);
            this.pmesh.position.set(this.x,this.y,this.z+0.20);

            this.group.add(this.mesh)
            this.group.add(this.pmesh)
        }
    }
}

export { MyPainting };