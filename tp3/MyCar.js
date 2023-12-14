import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class MyCar {
    constructor(app, track) {
        this.scene = app.scene;
        this.app = app;
        this.track = track;
        this.box = null;
        this.camera = null;
        this.keyStates = { w: false, a: false, s: false, d: false };
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.acceleration = 0.5;
        this.maxSpeed = 0.2;
        this.deceleration = 0.03;
        this.cameraOffset = new THREE.Vector3(0, 3, -100);
        this.cameraDistance = -5;
        this.createBox();
        this.createCamera();
        this.initEventListeners();
    }

    createCamera() {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 5, -10);
        this.app.cameras['Car'] = this.camera;
    }

    updateCamera() {
        // Define the offset from the car in local space
        const offset = new THREE.Vector3(0, 5, -this.cameraDistance);

        // Apply the car's rotation to the offset
        offset.applyQuaternion(this.box.quaternion);

        // Calculate the desired camera position in world space
        const desiredPosition = this.box.position.clone().add(offset);

        // Smoothly interpolate the camera's position
        this.camera.position.lerp(desiredPosition, 0.1);

        // Make the camera look at the car
        this.camera.lookAt(this.box.position);

        // Update controls if they exist
        if (this.app.controls !== null) {
            this.app.controls.target.copy(this.box.position);
            this.app.controls.update();
        }
    }

    createBox() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.box = new THREE.Mesh(geometry, material);
        this.box.position.y += 2;
        this.scene.add(this.box);
    }

    initEventListeners() {
        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('keyup', this.onKeyUp);
        this.animate();
    }

    onKeyDown = (event) => {
        if (['w', 'a', 's', 'd'].includes(event.key)) {
            this.keyStates[event.key] = true;
        }
    }

    onKeyUp = (event) => {
        if (['w', 'a', 's', 'd'].includes(event.key)) {
            this.keyStates[event.key] = false;
        }
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        this.updateMovement();
        this.updateCamera();
    }

    updateMovement() {
        let forward = new THREE.Vector3(0, 0, -1);
        forward.applyQuaternion(this.box.quaternion);

        let turnAngle = 0;
        const turnRate = 0.05;

        if (this.keyStates.d) {
            turnAngle = -turnRate;
        } else if (this.keyStates.a) {
            turnAngle = turnRate;
        }

        this.box.rotateY(turnAngle);

        let isMoving = false;

        if (this.keyStates.w) {
            this.velocity.addScaledVector(forward, this.acceleration);
            isMoving = true;
        } else if (this.keyStates.s) {
            this.velocity.addScaledVector(forward, -this.acceleration);
            isMoving = true;
        }

        if (!isMoving) {
            this.velocity.multiplyScalar(1 - this.deceleration);
        }

        this.velocity.clampLength(0, this.maxSpeed);

        this.box.position.add(this.velocity);
    }
}

export { MyCar }
