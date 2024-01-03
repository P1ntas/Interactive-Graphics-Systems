import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class MyRival {
    constructor(curve, scene) {
        this.curve = curve;
        this.scene = scene;
        const transformedPoints = this.curve.getPoints(50).map(p => 
            this.applyTransformations(p.clone())
        );
        this.curve = new THREE.CatmullRomCurve3(transformedPoints);
        this.points = this.curve.getPoints(100);
        this.speed = 8; 
        this.currentPointIndex = 0;
        this.model = null;
        this.wheels= [];
        this.startTime = 2; 
        this.elapsedTime = 0;
        this.startedMoving = false; 
    }

    async init() {
        try {
            await this.loadModel();
        } catch (error) {
            console.error(error);
        }
    }

    async loadModel() {
        const loader = new GLTFLoader();

        return new Promise((resolve, reject) => {
            loader.load('./scenes/models/myCar.glb', (glb) => {
                this.model = glb.scene;
                console.log("this.points[0]: ", this.points);
                this.model.position.copy(this.points[0]).add(new THREE.Vector3(0, 1.5, 0));
                console.log("glb.scene: ", glb.scene);
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

    loadWheels() {
        const loader = new GLTFLoader();
        loader.load('./scenes/models/wheels.glb', (gltf) => {
            const wheelModel = gltf.scene;
            gltf.scene.scale.set(0.15, 0.15, 0.15);
            gltf.scene.rotation.y = Math.PI /2;
            // Create and position wheels
            this.createWheel(wheelModel, new THREE.Vector3(0.67, -0.25, 0.45)); // Back-Left
            this.createWheel(wheelModel, new THREE.Vector3(-0.75, -0.25, 0.45)); // Front-Left
            this.createWheel(wheelModel, new THREE.Vector3(0.67, -0.25, -0.45)); // Back-Right
            this.createWheel(wheelModel, new THREE.Vector3(-0.75, -0.25, -0.45)); // Front-Left
        }, undefined, (error) => {
            console.error('An error happened while loading the wheel model', error);
        });
    }

    createWheel(wheelModel, position) {
        const wheel = wheelModel.clone();
        wheel.position.copy(position);
        this.model.add(wheel);
        this.wheels.push(wheel);
    }

    update(deltaTime) {
        if (this.points.length === 0 || !this.model) return;

        // Incrementar o tempo decorrido
        this.elapsedTime += deltaTime;

        // Verificar se o carro já pode começar a se mover
        if (!this.startedMoving) {
            if (this.elapsedTime >= this.startTime) {
                this.startedMoving = true;
            } else {
                return; // Não atualizar a posição se ainda não for hora de se mover
            }
        }

        // Atualizar o índice do ponto atual com base na velocidade e deltaTime
        this.currentPointIndex += this.speed * deltaTime;
        if (this.currentPointIndex >= this.points.length) {
            this.currentPointIndex = 0;
        }
    
        const currentPoint = this.points[Math.floor(this.currentPointIndex)];
        const nextPointIndex = (Math.floor(this.currentPointIndex) + 1) % this.points.length;
        const nextPoint = this.points[nextPointIndex];
    
        this.model.position.copy(currentPoint);
    
        const direction = new THREE.Vector3().subVectors(nextPoint, currentPoint).normalize();
    
        const rotation = new THREE.Euler().setFromQuaternion(
            new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction)
        );
 
        rotation.y += Math.PI; 
    
        this.model.rotation.copy(rotation);
    }
    

    // inverse direction
    /*update(deltaTime) {
        if (this.points.length === 0 || !this.model) return;

        this.currentPointIndex -= this.speed * deltaTime;
    
        if (this.currentPointIndex < 0) {
            this.currentPointIndex += this.points.length;
        }
    
        const currentPointIndexFloored = Math.floor(this.currentPointIndex) % this.points.length;
        const nextPointIndex = (currentPointIndexFloored - 1 + this.points.length) % this.points.length;
    
        const currentPoint = this.points[currentPointIndexFloored];
        const nextPoint = this.points[nextPointIndex];
    
        this.model.position.copy(currentPoint);
        this.model.lookAt(nextPoint);
    }*/

    applyTransformations(point) {
        point.x *= 10;
        point.y += 0.5;
        point.z *= 10;
    
        return point;
    }

    changeColor(color) {
        let boxMaterial = new THREE.MeshPhongMaterial({
                color: color,
                specular: "#000000",
                emissive: "#000000",
                shininess: 90,
            }
        );

        this.model.children[0].children[2].material = boxMaterial;
        this.model.children[0].children[3].material = boxMaterial;
        this.model.children[0].children[4].material = boxMaterial;
        this.model.children[0].children[5].material = boxMaterial;
        this.model.children[0].children[6].material = boxMaterial;
        this.model.children[0].children[7].material = boxMaterial;

        this.model.userData.originalColor = color;
    }
    
}



export { MyRival }