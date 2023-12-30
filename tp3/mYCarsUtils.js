import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class MyCarsUtils {
    constructor(app, garage) {
        this.app = app;
        this.garage = garage;
        this.car_meshes = [];
        this.colors = ["#ff0000", "#00ff00", "#0000ff"];
    }

    init() {
        this.buildCarsColumn("car_");
    }

    /*
    *
    * Build a colums full of boxes
    *
    */
    buildCarsColumn(name) {
        //console.log("this.garage.modelllll: ", this.garage.model);
        for (let i = 0; i < 3; i++) {
            //console.log("this.garage.scene.position.x + i * 4: ", this.garage);
            this.buildCar(name + i, this.colors[i], -20 + this.garage.model.position.x + i * 4, this.garage.model.position.z);
        }
    }

    /**
     * builds the box mesh with material assigned
     */
    buildCar(name, color, xpos, zPos) {

        this.boxMeshSize = 1.0;
        let boxMaterial = new THREE.MeshPhongMaterial({
                color: color,
                specular: "#000000",
                emissive: "#000000",
                shininess: 90,
            }
        );

        const loader = new GLTFLoader();
            loader.load('./scenes/models/myCar.glb', (glb) => {
                glb.scene.position.x = xpos;
                glb.scene.position.y = 1.3;
                glb.scene.position.z = zPos;
                glb.scene.rotation.y = - Math.PI / 2;

                glb.scene.children[0].children[2].material = boxMaterial;
                glb.scene.children[0].children[3].material = boxMaterial;
                glb.scene.children[0].children[4].material = boxMaterial;
                glb.scene.children[0].children[5].material = boxMaterial;
                glb.scene.children[0].children[6].material = boxMaterial;
                glb.scene.children[0].children[7].material = boxMaterial;

                console.log("glb.scene: ", glb.scene);
                glb.scene.scale.set(2.7, 2.7, 2.7);

                this.car_meshes.push(glb.scene);
                this.app.scene.add(glb.scene);
            }, undefined, (error) => {
                console.error('An error happened while loading the model', error);
            }
        );

        // Create a Cube Mesh with basic material
        /* let box = new THREE.BoxGeometry(
            this.boxMeshSize,
            this.boxMeshSize,
            this.boxMeshSize
        );
        this.boxMesh = new THREE.Mesh(box, boxMaterial);
        this.boxMesh.name = name
        this.boxMesh.position.x = xpos;
        this.boxMesh.position.y = 0.5;
        this.boxMesh.position.z = 0; */
    }
    
}



export { MyCarsUtils }