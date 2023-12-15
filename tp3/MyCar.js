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
        this.cameraOffset = new THREE.Vector3(0, 3, 100);
        this.cameraDistance = -5;
        this.collisionRecoveryTime = 2000; // Time in milliseconds to recover speed after collision
        this.collisionCooldown = 1000;
        this.lastCollisionTime = 0;
        this.collisionDecelerationFactor = 0.5; // How much to reduce speed upon collision
        this.isCollided = false;
        this.slowdownDuration = 3000; // 3 seconds slowdown duration
        this.timeSinceCollision = 0;
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

        // Define the offset from the car in local space
        const offset = new THREE.Vector3(0, 5, -this.cameraDistance);

        // Apply the car's rotation to the offset
        offset.applyQuaternion(this.model.quaternion);

        // Calculate the desired camera position in world space
        const desiredPosition = this.model.position.clone().add(offset);

        // Smoothly interpolate the camera's position
        this.camera.position.lerp(desiredPosition, 0.1);

        // Make the camera look at the car
        this.camera.lookAt(this.model.position);

        // Update controls if they exist
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

        // Collision check
        let collisionDetected = this.checkCollisionWithCones();

        if (this.isCollided) {
            const timeElapsedSinceCollision = Date.now() - this.lastCollisionTime;
            if (timeElapsedSinceCollision < this.slowdownDuration) {
                this.timeSinceCollision = timeElapsedSinceCollision;
            } else {
                this.isCollided = false;
                this.timeSinceCollision = 0;
            }

            const slowdownFactor = 1 - (this.timeSinceCollision / this.slowdownDuration);
            this.velocity.multiplyScalar(slowdownFactor);
        }

        this.model.position.add(this.velocity);
        //console.log(this.velocity)
        // Apply velocity to move the car
    }

    checkCollisionWithCones() {
        const carPosition = this.model.position.clone();
        const currentTime = Date.now();

        // Check if we are still within the cooldown period
        if (currentTime - this.lastCollisionTime < this.collisionCooldown) {
            return false; // Ignore collision as we are in cooldown
        }

            if (carPosition.distanceTo(this.app.contents.trafficCone.mesh.position) < 1) {
                this.handleCollision();
                this.lastCollisionTime = currentTime; // Update the last collision time
                return true; // Collision detected
            }
        return false; // No collision
    }

    handleCollision() {
        //console.log("Handling collision"); // Debug log
        this.velocity.multiplyScalar(this.collisionDecelerationFactor); // Reduce velocity
        this.isCollided = true;
        this.lastCollisionTime = Date.now();
    }

    isOnTrack(thresholdDistance = 5) { // Adjusted threshold distance
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
