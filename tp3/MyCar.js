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
        this.controlSwitchDuration = 5000;
        this.lastControlSwitchTime = 0;
        this.controlsSwitched = false;
        this.shroomEffectDuration = 5000; 
        this.lastShroomCollisionTime = 0;
        this.underShroomEffect = false;
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
        loader.load('./scenes/models/blue_car.glb', (glb) => {
            this.model = glb.scene;
            this.model.position.y = 0.5;
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

        if (this.controlsSwitched) {
            if (this.keyStates.d) {
                turnAngle = turnRate;
            } else if (this.keyStates.a) {
                turnAngle = -turnRate;
            }
        } else {
            if (this.keyStates.d) {
                turnAngle = -turnRate;
            } else if (this.keyStates.a) {
                turnAngle = turnRate;
            }
        }

        this.model.rotateY(turnAngle);

        if (this.keyStates.w) {
            this.velocity.addScaledVector(forward, this.acceleration);
        } else if (this.keyStates.s) {
            this.velocity.addScaledVector(forward, -this.acceleration);
        }

        this.velocity.multiplyScalar(1 - this.deceleration);
        this.velocity.clampLength(0, this.maxSpeed);

        this.checkCollisionWithSign();

        if (this.controlsSwitched && (Date.now() - this.lastControlSwitchTime > this.controlSwitchDuration)) {
            this.controlsSwitched = false;
        }

        this.checkCollisionWithCones();

        if (this.inCollisionState) {
            if (Date.now() < this.collisionEndTime) {
                this.maxSpeed = this.originalMaxSpeed / 2;
            } else {
                this.inCollisionState = false;
                this.maxSpeed = this.originalMaxSpeed;
            }
        }

        this.checkCollisionWithShroom();

        if (this.underShroomEffect) {
            if (Date.now() - this.lastShroomCollisionTime < this.shroomEffectDuration) {
                this.maxSpeed = this.originalMaxSpeed * 2;
            } else {
                this.underShroomEffect = false;
                this.maxSpeed = this.originalMaxSpeed;
            }
        }

        this.checkCollisionWithClock();

        this.velocity.clampLength(0, this.maxSpeed);
        this.model.position.add(this.velocity);
    }

    checkCollisionWithCones() {
        if (!this.model || !this.app.contents || !this.app.contents.trafficCone) {
            return;
        }

        const currentTime = Date.now();

        if (currentTime - this.lastCollisionTime < this.collisionCooldown) {
            return; 
        }
        
        const carPositionXZ = new THREE.Vector2(this.model.position.x, this.model.position.z);
        let conePositionXZ = new THREE.Vector2(
            this.app.contents.trafficCone.mesh.position.x, 
            this.app.contents.trafficCone.mesh.position.z
        );

        if (carPositionXZ.distanceTo(conePositionXZ) < 1) {
            this.handleCollision();
            this.lastCollisionTime = currentTime; 
            this.collisionEndTime = currentTime + this.slowdownDuration; 
            this.inCollisionState = true; 
        }

        conePositionXZ = new THREE.Vector2(
            this.app.contents.trafficCone2.mesh.position.x, 
            this.app.contents.trafficCone2.mesh.position.z
        );

        if (carPositionXZ.distanceTo(conePositionXZ) < 1) {
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

    checkCollisionWithSign() {
        if (!this.model || !this.app.contents || !this.app.contents.sign) {
            return;
        }

        const currentTime = Date.now();

        if (currentTime - this.lastControlSwitchTime < this.controlSwitchDuration) {
            return; 
        }

        const carPositionXZ = new THREE.Vector2(this.model.position.x, this.model.position.z);
        let signPositionXZ = new THREE.Vector2(
            this.app.contents.sign.mesh.position.x, 
            this.app.contents.sign.mesh.position.z
        );

        if (carPositionXZ.distanceTo(signPositionXZ) < 1) {
            this.handleControlSwitch();
            this.lastControlSwitchTime = currentTime;
            //console.log("Switching controls")
        }

        signPositionXZ = new THREE.Vector2(
            this.app.contents.sign2.mesh.position.x, 
            this.app.contents.sign2.mesh.position.z
        );

        if (carPositionXZ.distanceTo(signPositionXZ) < 1) {
            this.handleControlSwitch();
            this.lastControlSwitchTime = currentTime;
            //console.log("Switching controls")
        }
    }

    handleControlSwitch() {
        this.controlsSwitched = true;
    }

    checkCollisionWithShroom() {
        if (!this.model || !this.app.contents || !this.app.contents.shroom.model) {
            return;
        }

        const currentTime = Date.now();

        if (currentTime - this.lastControlSwitchTime < this.controlSwitchDuration) {
            return; 
        }

        const carPositionXZ = new THREE.Vector2(this.model.position.x, this.model.position.z);
        let signPositionXZ = new THREE.Vector2(
            this.app.contents.shroom.model.position.x, 
            this.app.contents.shroom.model.position.z
        );

        if (carPositionXZ.distanceTo(signPositionXZ) < 1) {
            this.handleShroomCollision();
            this.lastControlSwitchTime = currentTime;
            //console.log("Boosting")
        }

        signPositionXZ = new THREE.Vector2(
            this.app.contents.shroom2.model.position.x, 
            this.app.contents.shroom2.model.position.z
        );

        if (carPositionXZ.distanceTo(signPositionXZ) < 1) {
            this.handleShroomCollision();
            this.lastControlSwitchTime = currentTime;
            //console.log("Boosting")
        }
    }

    handleShroomCollision() {
        this.lastShroomCollisionTime = Date.now();
        this.underShroomEffect = true;
    }

    checkCollisionWithRival(rival) {
        if (!this.model || !rival.model) return;
    
        const currentTime = Date.now();
        if (currentTime - this.lastCollisionTime < this.collisionCooldown) return;
    
        const carPosition = new THREE.Vector3().setFromMatrixPosition(this.model.matrixWorld);
        const rivalPosition = new THREE.Vector3().setFromMatrixPosition(rival.model.matrixWorld);
        
        const distance = carPosition.distanceTo(rivalPosition);
        const collisionDistance = 5; 
        
        if (distance < collisionDistance) {
            this.handleCollision();
            this.lastCollisionTime = currentTime;
            this.collisionEndTime = currentTime + this.slowdownDuration;
            this.inCollisionState = true;
        }
    }

    handleCollision() {
        this.velocity.multiplyScalar(this.collisionDecelerationFactor);
        this.isCollided = true;
        this.inCollisionState = true;
        this.collisionEndTime = Date.now() + this.slowdownDuration;
    }

    checkCollisionWithClock() {
        if (!this.model || !this.app.contents || !this.app.contents.clock1 || !this.app.contents.clock1.model) {
            return;
        }
    
        const currentTime = Date.now();
    
        if (currentTime - this.lastCollisionTime < this.collisionCooldown) {
            return;
        }
        
        const carPosition = new THREE.Vector3().setFromMatrixPosition(this.model.matrixWorld);
        const clockPosition = new THREE.Vector3().setFromMatrixPosition(this.app.contents.clock1.model.matrixWorld);
    
        const distance = carPosition.distanceTo(clockPosition);
        const collisionDistance = 2; 
    
        if (distance < collisionDistance) {
            this.handleClockCollision();
            this.lastCollisionTime = currentTime;
        }
    }

    handleClockCollision() {
        if (this.app.contents.timer) {
            this.app.contents.timer.takeTime(5); 
        }
    }
    
    
}

export { MyCar }
