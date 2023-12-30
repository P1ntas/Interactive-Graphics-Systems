import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class CarsUtils {
    constructor(app) {
        this.app = app;
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
        for (let i = 0; i < 3; i++) {
            this.buildCar(name + i, this.colors[i], i * 2);
        }
    }

    /**
     * builds the box mesh with material assigned
     */
    buildCar(name, color, xpos) {

        this.boxMeshSize = 1.0;
        let boxMaterial = new THREE.MeshPhongMaterial({
                color: color,
                specular: "#000000",
                emissive: "#000000",
                shininess: 90,
            }
        );

        const loader = new GLTFLoader();
            loader.load('./scenes/models/blue_car.glb', (glb) => {
                glb.scene.position.x = xpos;
                glb.scene.position.y = 0.5;
                glb.scene.position.z = 0;
                glb.scene.rotation.y = - Math.PI / 2;

                /* glb.scene.children[0].children.map(mesh => {
                    mesh.material = boxMaterial;
                }); */

                glb.scene.children[0].children[2].material = boxMaterial;

                console.log("glb.scene: ", glb.scene);

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



export { CarsUtils }