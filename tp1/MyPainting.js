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
            let paintingMaterial = new THREE.MeshPhongMaterial({ map: this.paintingTexture, side:THREE.FrontSide });
            let frame = new THREE.BoxGeometry(3.5, 3.5, 0.1);
            let frameMaterial = new THREE.MeshPhongMaterial({ color: "#000000", side: THREE.FrontSide});

            let tMaterial = new THREE.MeshPhongMaterial({opacity: 0, transparent: true});

            var materials = [tMaterial, tMaterial, tMaterial, tMaterial, tMaterial, frameMaterial]

            this.frameMesh = new THREE.Mesh(frame, materials);

            var materials1 = [tMaterial, tMaterial, tMaterial, tMaterial, tMaterial, paintingMaterial]

            this.paintingMesh = new THREE.Mesh(painting, materials1);
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

            let tMaterial = new THREE.MeshPhongMaterial({opacity: 0, transparent: true});

            var materials = [tMaterial, tMaterial, tMaterial, tMaterial, paintingMaterial, tMaterial]

            this.mesh = new THREE.Mesh(frame, frameMaterial);
            this.pmesh = new THREE.Mesh(painting, paintingMaterial);

            if (this.type === "car") this.mesh.rotateY(Math.PI / 2)
            
            this.mesh.position.set(this.x,this.y, this.z);
            this.pmesh.position.set(this.x,this.y,this.z+0.18);

            this.group.add(this.mesh)
            this.group.add(this.pmesh)
        }

        else if (this.type === "window") {

            let painting = new THREE.BoxGeometry(9.5,6,0.01);
            let paintingMaterial = new THREE.MeshPhongMaterial({map: this.paintingTexture});
            let tMaterial = new THREE.MeshPhongMaterial({opacity: 0, transparent: true});

            var materials = [tMaterial, tMaterial, tMaterial, tMaterial, paintingMaterial, tMaterial]

            this.pmesh = new THREE.Mesh(painting, materials);
            this.pmesh.position.set(this.x,this.y, this.z);

            this.group.add(this.pmesh)
        }
    }
}

export { MyPainting };