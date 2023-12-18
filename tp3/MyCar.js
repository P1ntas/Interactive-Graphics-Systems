import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class MyCar {
    constructor(app, track) {
        this.scene = app.scene;
        this.app = app;
        this.track = track;
        this.model = null;
        this.camera = null;
        this.keyStates = { w: false, a: false, s: false, d: false };
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.acceleration = 0.5;
        this.maxSpeed = 0.2;
        this.deceleration = 0.03;
        this.cameraDistance = -5;
        this.collisionCooldown = 1000;
        this.lastCollisionTime = 0;
        this.collisionDecelerationFactor = 0.5; 
        this.isCollided = false;
        this.slowdownDuration = 3000; 
        this.originalMaxSpeed = this.maxSpeed; 
        this.inCollisionState = false;
        this.collisionEndTime = 0;
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.animate = this.animate.bind(this);
        this.loadModel();
        this.createCamera();
        this.initEventListeners();
    }

    createCamera() {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 5, -10);
        this.app.cameras['Car'] = this.camera;
    }

    updateCamera() {
        if (!this.model) return;

        const offset = new THREE.Vector3(0, 5, -this.cameraDistance);

        offset.applyQuaternion(this.model.quaternion);

        const desiredPosition = this.model.position.clone().add(offset);

        this.camera.position.lerp(desiredPosition, 0.1);

        this.camera.lookAt(this.model.position);

        if (this.app.controls !== null) {
            this.app.controls.target.copy(this.model.position);
            this.app.controls.update();
        }
    }

    loadModel() {
        const loader = new GLTFLoader();
        loader.load('./scenes/models/car1.glb', (glb) => {
            this.model = glb.scene;
            this.model.position.y = 1;
            this.scene.add(this.model);
        }, undefined, (error) => {
            console.error('An error happened while loading the model', error);
        });
    }

    initEventListeners() {
        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('keyup', this.onKeyUp);
        this.animate();
    }

    onKeyDown(event) {
        if (['w', 'a', 's', 'd'].includes(event.key)) {
            this.keyStates[event.key] = true;
        }
    }

    onKeyUp(event) {
        if (['w', 'a', 's', 'd'].includes(event.key)) {
            this.keyStates[event.key] = false;
        }
    }

    animate() {
        requestAnimationFrame(this.animate);
        this.updateMovement();
        this.updateCamera();
    }

    updateMovement() {
        if (!this.model) return;

        let forward = new THREE.Vector3(0, 0, -1);
        forward.applyQuaternion(this.model.quaternion);

        let turnAngle = 0;
        const turnRate = 0.05;

        if (this.keyStates.d) {
            turnAngle = -turnRate;
        } else if (this.keyStates.a) {
            turnAngle = turnRate;
        }

        this.model.rotateY(turnAngle);

        if (this.keyStates.w) {
            this.velocity.addScaledVector(forward, this.acceleration);
        } else if (this.keyStates.s) {
            this.velocity.addScaledVector(forward, -this.acceleration);
        }

        this.velocity.multiplyScalar(1 - this.deceleration);
        this.velocity.clampLength(0, this.maxSpeed);

        this.checkCollisionWithCones();

        if (this.inCollisionState) {
            if (Date.now() < this.collisionEndTime) {
                this.maxSpeed = this.originalMaxSpeed / 2;
            } else {
                this.inCollisionState = false;
                this.maxSpeed = this.originalMaxSpeed;
            }
        }

        this.velocity.clampLength(0, this.maxSpeed);
        this.model.position.add(this.velocity);
    }

    checkCollisionWithCones() {
        if (!this.model || !this.app.contents || !this.app.contents.trafficCone) {
            return;
        }

        const carPosition = this.model.position.clone();
        const currentTime = Date.now();

        if (currentTime - this.lastCollisionTime < this.collisionCooldown) {
            return; 
        }

        if (carPosition.distanceTo(this.app.contents.trafficCone.mesh.position) < 1) {
            this.handleCollision();
            this.lastCollisionTime = currentTime; 
            this.collisionEndTime = currentTime + this.slowdownDuration; 
            this.inCollisionState = true; 
        }
    }

    handleCollision() {
        //console.log("Handling collision"); 
        this.velocity.multiplyScalar(this.collisionDecelerationFactor); 
        this.isCollided = true;
        this.lastCollisionTime = Date.now();
    }

    isOnTrack(thresholdDistance = 5) {
        if (!this.model) {
            return false;
        }

        const carPosXZ = new THREE.Vector2(this.model.position.x, this.model.position.z);
        let minDistance = Infinity;
        //console.log(minDistance)
        const trackPoints = this.track.path.getPoints(500); 
        //console.log(this.model.position);
        for (let i = 0; i < trackPoints.length; i++) {
            //console.log(trackPoints[i].z);
            const pointXZ = new THREE.Vector2(trackPoints[i].x, trackPoints[i].z);
            const distance = carPosXZ.distanceTo(pointXZ);
            //console.log(distance);
            if (distance < minDistance) {
                minDistance = distance;
            }
        }

        return minDistance <= thresholdDistance;
    }
}

export { MyCar }
