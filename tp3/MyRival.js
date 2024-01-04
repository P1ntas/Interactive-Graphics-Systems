import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class MyRival {
    constructor(curve, scene) {
        this.curve = curve;
        this.scene = scene;
        this.carMesh = null;
        const transformedPoints = this.curve.getPoints(50).map(p => 
            this.applyTransformations(p.clone())
        );
        this.curve = new THREE.CatmullRomCurve3(transformedPoints);
        this.points = this.curve.getPoints(100);
        this.speed = 10; 
        this.currentPointIndex = 0;
        this.model = null;
        this.loadModel();
    }

    loadModel() {
        const loader = new GLTFLoader();
        loader.load('./scenes/models/car1.glb', (glb) => {
            this.model = glb.scene;
            
            this.model.scale.set(1, 1, 1);
            this.model.position.copy(this.points[0]); 
            this.scene.add(this.model);
        }, undefined, (error) => {
            console.error('An error happened while loading the model', error);
        });
    }

    update(deltaTime) {
        if (this.points.length === 0 || !this.model) return;
    
        this.currentPointIndex += this.speed * deltaTime;
        if (this.currentPointIndex >= this.points.length) {
            this.currentPointIndex = 0;
        }
    
        const currentPoint = this.points[Math.floor(this.currentPointIndex)];
        const nextPointIndex = (Math.floor(this.currentPointIndex) + 1) % this.points.length;
        const nextPoint = this.points[nextPointIndex];
    
        this.model.position.copy(currentPoint);
    
        // Calculate the direction vector
        const direction = new THREE.Vector3().subVectors(nextPoint, currentPoint).normalize();
    
        // Calculate the rotation
        const rotation = new THREE.Euler().setFromQuaternion(
            new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction)
        );
    
        // Adjust for the original orientation of the model if needed
        rotation.y += Math.PI; // Adjust this as per the model's original orientation
    
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
    
}



export { MyRival }