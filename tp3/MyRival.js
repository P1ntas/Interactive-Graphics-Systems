import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/**
 * Represents a rival car in a 3D environment, managing its movement along a predefined path and visual appearance.
 */
class MyRival {
    /**
     * Constructs a MyRival object.
     * @param {THREE.Curve} curve The path along which the rival will move.
     * @param {THREE.Scene} scene The scene to which the rival will be added.
     */
    constructor(curve, scene) {
        this.curve = curve;
        this.scene = scene;
        const transformedPoints = this.curve.getPoints(50).map(p => 
            this.applyTransformations(p.clone())
        );
        this.curve = new THREE.CatmullRomCurve3(transformedPoints);
        this.points = this.curve.getPoints(100);
        this.speed = 2; 
        this.currentPointIndex = 0;
        this.model = null;
        this.wheels = [];
        this.startTime = 2; 
        this.elapsedTime = 0;
        this.startedMoving = false; 
    }

    /**
     * Initializes the rival by loading the model and setting up its path.
     */
    async init() {
        try {
            await this.loadModel();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Asynchronously loads the rival car model.
     * @returns {Promise<THREE.Group>} A promise that resolves with the loaded model.
     */
    async loadModel() {
        const loader = new GLTFLoader();

        return new Promise((resolve, reject) => {
            loader.load('./scenes/models/myCar.glb', (glb) => {
                this.model = glb.scene;
                this.model.position.copy(this.points[0]).add(new THREE.Vector3(0, 1.5, 0));
                glb.scene.scale.set(2.7, 2.7, 2.7);
                this.scene.add(this.model);
                this.loadWheels();
                this.model.name = "player_car";

                resolve(this.model); // Resolve the promise with the loaded model
            }, undefined, (error) => {
                console.error('An error happened while loading the model', error);
                reject(error); // Reject the promise on error
            });
        });
    } 

    /**
     * Loads the wheels for the rival car.
     */
    loadWheels() {
        const loader = new GLTFLoader();
        loader.load('./scenes/models/wheels.glb', (gltf) => {
            const wheelModel = gltf.scene;
            gltf.scene.scale.set(0.15, 0.15, 0.15);
            gltf.scene.rotation.y = Math.PI / 2;
            // Create and position wheels
            this.createWheel(wheelModel, new THREE.Vector3(0.67, -0.25, 0.45)); // Back-Left
            this.createWheel(wheelModel, new THREE.Vector3(-0.75, -0.25, 0.45)); // Front-Left
            this.createWheel(wheelModel, new THREE.Vector3(0.67, -0.25, -0.45)); // Back-Right
            this.createWheel(wheelModel, new THREE.Vector3(-0.75, -0.25, -0.45)); // Front-Left
        }, undefined, (error) => {
            console.error('An error happened while loading the wheel model', error);
        });
    }

    /**
     * Creates a wheel at a specified position.
     * @param {THREE.Group} wheelModel The 3D model of the wheel.
     * @param {THREE.Vector3} position The position to place the wheel at.
     */
    createWheel(wheelModel, position) {
        const wheel = wheelModel.clone();
        wheel.position.copy(position);
        this.model.add(wheel);
        this.wheels.push(wheel);
    }

    /**
     * Updates the rival car's position and orientation based on the time elapsed.
     * @param {number} deltaTime The time elapsed since the last update.
     */
    update(deltaTime) {
        if (this.points.length === 0 || !this.model) return;
    
        this.elapsedTime += deltaTime;
    
        if (!this.startedMoving) {
            if (this.elapsedTime >= this.startTime) {
                this.startedMoving = true;
            } else {
                return;
            }
        }
    
        this.currentPointIndex += this.speed * deltaTime;
        if (this.currentPointIndex >= this.points.length) {
            this.currentPointIndex = 0;
        }
    
        const currentPointIndexFloored = Math.floor(this.currentPointIndex);
        const currentPoint = this.points[currentPointIndexFloored];
        const nextPointIndex = (currentPointIndexFloored + 1) % this.points.length;
        const nextPoint = this.points[nextPointIndex];
    
        // Set the position with an additional 1 unit in the Y-axis
        this.model.position.copy(currentPoint).add(new THREE.Vector3(0, 1, 0));
    
        // Adjust the car's orientation to face forward
        this.model.lookAt(nextPoint.clone().add(new THREE.Vector3(0, 1, 0)));
    
        this.model.rotation.y += Math.PI; 
        this.model.rotation.y += Math.PI / 2;
    }
    
    /**
     * Applies transformations to a point in the rival car's path.
     * @param {THREE.Vector3} point The point to transform.
     * @returns {THREE.Vector3} The transformed point.
     */
    applyTransformations(point) {
        point.x *= 10;
        point.y += 0.5;
        point.z *= 10;
    
        return point;
    }

    /**
     * Changes the color of the rival car.
     * @param {string} color The new color for the rival car.
     */
    changeColor(color) {
        let boxMaterial = new THREE.MeshPhongMaterial({
            color: color,
            specular: "#000000",
            emissive: "#000000",
            shininess: 90,
        });

        this.model.children[0].children[2].material = boxMaterial;
        this.model.children[0].children[3].material = boxMaterial;
        this.model.children[0].children[4].material = boxMaterial;
        this.model.children[0].children[5].material = boxMaterial;
        this.model.children[0].children[6].material = boxMaterial;
        this.model.children[0].children[7].material = boxMaterial;

        this.model.userData.originalColor = color;
    } 
}

export { MyRival };
