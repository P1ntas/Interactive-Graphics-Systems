import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


class MyCarsUtils {
    // Constructs the MyCarsUtils object.
    constructor(app, garage, label) {
        this.app = app;
        this.label = label;
        this.garage = garage;
        this.car_meshes = [];
        this.colors = ["#ff0000", "#00ff00", "#0000ff"];
        this.wheelModel = null;
    }

    /**
     * Initializes the utility by loading the wheel model and building the cars.
     * @returns {Promise<void>} A promise that resolves when initialization is complete.
     */
    async init() {
        await this.loadWheelModel();
        this.buildCarsColumn(this.label);
    }

    /**
     * Loads the wheel model for the cars.
     * @returns {Promise<void>} A promise that resolves when the wheel model is loaded.
     */
    async loadWheelModel() {
        const loader = new GLTFLoader();
        return new Promise((resolve, reject) => {
            loader.load('./scenes/models/wheels.glb', (gltf) => {
                this.wheelModel = gltf.scene;
                this.wheelModel.scale.set(0.15, 0.15, 0.15);
                this.wheelModel.rotation.y = Math.PI / 2;
                resolve();
            }, undefined, (error) => {
                console.error('An error happened while loading the wheel model', error);
                reject(error);
            });
        });
    }


    /**
     * Builds a column of cars with different colors.
     * @param {string} name - The base name for the cars.
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
                var model = glb.scene;
                model.position.x = xpos;
                model.position.y = 1.7;
                model.position.z = zPos;
                model.rotation.y = - Math.PI / 2;

                model.children[0].children[2].material = boxMaterial;
                model.children[0].children[3].material = boxMaterial;
                model.children[0].children[4].material = boxMaterial;
                model.children[0].children[5].material = boxMaterial;
                model.children[0].children[6].material = boxMaterial;
                model.children[0].children[7].material = boxMaterial;

                //console.log("MODEL: ", model);
                model.scale.set(2.7, 2.7, 2.7);

                this.addWheelsToCar(model);

                model.name = name;
                model.userData.originalColor = color;
                
                this.car_meshes.push(model);
                this.app.scene.add(model);
            }, undefined, (error) => {
                console.error('An error happened while loading the model', error);
            }
        );

    }

    /**
     * Adds wheels to a car model.
     * @param {THREE.Object3D} car - The car to which wheels are to be added.
     */
    addWheelsToCar(car) {
        const wheelPositions = [
            new THREE.Vector3(0.67, -0.25, 0.45),
            new THREE.Vector3(-0.75, -0.25, 0.45),
            new THREE.Vector3(0.67, -0.25, -0.45),
            new THREE.Vector3(-0.75, -0.25, -0.45)
        ];

        wheelPositions.forEach(position => {
            const wheel = this.wheelModel.clone();
            wheel.position.copy(position);
            car.add(wheel);
        });
    }
}


export { MyCarsUtils }