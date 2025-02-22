import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/**
 * Represents a car in a 3D environment, handling its movement, collisions,
 * and interactions with the environment.
 */
class MyCar {
     /**
     * Constructs a MyCar object.
     * @param {Object} app The main application context.
     * @param {Object} track The track on which the car will move.
     */
    constructor(app, track) {
        this.scene = app.scene;
        this.app = app;
        this.track = track;
        this.model = null;
        this.camera = null;
        this.keyStates = { w: false, a: false, s: false, d: false };
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.acceleration = 0.5;
        this.maxSpeed = 0.8;
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
        this.lastIncrementTime = 0;
        this.incrementCooldown = 20000;
        this.passThroughCounter = -1;
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.animate = this.animate.bind(this);
        this.wheels= [];
        this.trackPoints = this.track.path.getPoints(200).map(point => 
            new THREE.Vector3(point.x * -10, point.y * -1, point.z * 10));
        this.loadModel();
        this.createCamera();
        this.initEventListeners();
    }

    /**
     * Initializes the car model asynchronously.
     */
    async init() {
        try {
            await this.loadModel();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Creates the camera associated with the car.
     */
    createCamera() {
        this.camera = this.app.cameras['GameCam'];
    }

    /**
     * Updates the camera position and orientation based on the car's position.
     */
    updateCamera() {
        if (!this.model) return;

        const cameraOffset = new THREE.Vector3(5, 2, 0);
        const cameraPosition = this.model.position.clone().add(cameraOffset.applyQuaternion(this.model.quaternion));

        this.camera.position.copy(cameraPosition);
        this.camera.lookAt(this.model.position);
    
        if (this.app.controls) {
            this.app.controls.target.copy(this.model.position);
            this.app.controls.update();
        }

        /*
        const offset = new THREE.Vector3(0, 5, -this.cameraDistance);

        offset.applyQuaternion(this.model.quaternion);

        const desiredPosition = this.model.position.clone().add(offset);

        this.camera.position.lerp(desiredPosition, 0.1);

        this.camera.lookAt(this.model.position);

        if (this.app.activeCameraName == "Car" && this.app.controls !== null) {
            this.app.controls.target.copy(this.model.position);
            this.app.controls.update();
        } */
    }

    /**
     * Asynchronously loads the car model from a specified path.
     * @returns {Promise<THREE.Group>} A promise that resolves with the loaded model.
     */
    async loadModel() {
        const loader = new GLTFLoader();

        return new Promise((resolve, reject) => {
            loader.load('./scenes/models/myCar.glb', (glb) => {
                this.model = glb.scene;
                this.model.position.y = 0.5;
                this.model.position.set(12, 1.7, -47);
                this.model.scale.set(2.7, 2.7, 2.7);
                this.scene.add(this.model);
                this.loadWheels();
                this.model.name = "player_car";
                resolve(this.model);
            }, undefined, (error) => {
                console.error('An error happened while loading the model', error);
                reject(error);
            });
        });
    }

    /**
     * Loads the wheels of the car from a specified model.
     */
    loadWheels() {
        const loader = new GLTFLoader();
        loader.load('./scenes/models/wheels.glb', (gltf) => {
            const wheelModel = gltf.scene;
            gltf.scene.scale.set(0.15, 0.15, 0.15);
            gltf.scene.rotation.y=Math.PI /2;
          
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
     * Initializes the event listeners for keyboard input.
     */
    initEventListeners() {
        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('keyup', this.onKeyUp);
        this.animate();
    }

    /**
     * Handles the keydown event for car control.
     * @param {Event} event The keydown event.
     */
    onKeyDown(event) {
        if (['w', 'a', 's', 'd'].includes(event.key)) {
            this.keyStates[event.key] = true;
        }
        
        if (event.code === 'Space') {

            if (this.app.contents.timer.running) {
                if (this.app.contents.timer.paused) {
                    this.app.contents.timer.resume();
                } else {
                    this.app.contents.timer.pause();
                }
            }
        }
    }

    /**
     * Handles the keyup event for car control.
     * @param {Event} event The keyup event.
     */
    onKeyUp(event) {
        if (['w', 'a', 's', 'd'].includes(event.key)) {
            this.keyStates[event.key] = false;
        }
    }

    /**
     * Animation loop to update the car's position and actions.
     */
    animate() {
        requestAnimationFrame(this.animate);
        this.updateMovement();
        // this.updateCamera();
        this.updateWheelRotation();
    }

    /**
     * Updates the car's movement based on user input and physics.
     */
    updateMovement() {
        if (!this.model) return;

        if (this.app.contents.timer.paused) return;

        if (this.app.contents.stateMachine.currentState === this.app.contents.stateMachine.states['game']) {
            this.checkPositionForWin();
        }

        let forward = new THREE.Vector3(-1, 0, 0);
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

        if (!this.isCarOnTrack()) {
            this.maxSpeed = this.originalMaxSpeed * 0.6;
        } else this.maxSpeed = this.originalMaxSpeed;

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

    /**
     * Updates the rotation of the car's wheels based on movement.
     */
    updateWheelRotation() {
        const wheelCircumference = 2 * Math.PI * 0.3; 
        const distanceTravelled = this.velocity.length(); 

        const wheelRotation = distanceTravelled / wheelCircumference * 2 * Math.PI;

        this.wheels.forEach(wheel => {
            wheel.rotateX(wheelRotation); 
        });
    }

    /**
     * Checks if the car has reached a winning position on the track.
     */
    checkPositionForWin() {
        if (!this.model) return;

        //console.log(this.model.position.x, this.model.position.z)
        //console.log(this.passThroughCounter);
    
        const currentTime = Date.now();
        const carX = this.model.position.x;
        const carZ = this.model.position.z;
        if (carX >= 0 && carX <= 15 && carZ >= -55 && carZ <= -40) {
            if (currentTime - this.lastIncrementTime > this.incrementCooldown) {
                this.passThroughCounter++;
                this.lastIncrementTime = currentTime; 
    
                if (this.passThroughCounter > 3) {
                    console.log("Game win");
                    this.app.contents.stateMachine.currentState = this.app.contents.stateMachine.states['win'];
                }
            }
        }
    }
    
    /**
     * Checks for collision with cones on the track.
     */
    checkCollisionWithCones() {
        if (!this.model || !this.app.contents || !this.app.contents.cones) {
            return;
        }
    
        const currentTime = Date.now();
    
        if (currentTime - this.lastCollisionTime < this.collisionCooldown) {
            return; 
        }
    
        const carPositionXZ = new THREE.Vector2(this.model.position.x, this.model.position.z);
    
        for (let cone of this.app.contents.cones) {
            const conePositionXZ = new THREE.Vector2(
                cone.mesh.position.x, 
                cone.mesh.position.z
            );
    
            if (carPositionXZ.distanceTo(conePositionXZ) < 1) {
                this.handleCollision();
                this.lastCollisionTime = currentTime; 
                this.collisionEndTime = currentTime + this.slowdownDuration; 
                this.inCollisionState = true;
                break; 
            }
        }
    }

    /**
     * Handles the actions to be taken when a collision occurs.
     */
    handleCollision() {
        //console.log("Handling collision"); 
        this.velocity.multiplyScalar(this.collisionDecelerationFactor); 
        this.isCollided = true;
        this.lastCollisionTime = Date.now();
    }

    /**
     * Checks for collision with signposts on the track and handles control switching.
     */
    checkCollisionWithSign() {
        if (!this.model || !this.app.contents || !this.app.contents.signs) {
            return;
        }
    
        const currentTime = Date.now();
    
        if (currentTime - this.lastControlSwitchTime < this.controlSwitchDuration) {
            return; 
        }
    
        const carPositionXZ = new THREE.Vector2(this.model.position.x, this.model.position.z);
    
        for (let sign of this.app.contents.signs) {
            const signPositionXZ = new THREE.Vector2(
                sign.mesh.position.x, 
                sign.mesh.position.z
            );
    
            if (carPositionXZ.distanceTo(signPositionXZ) < 1) {
                this.handleControlSwitch();
                this.lastControlSwitchTime = currentTime;
                break;
            }
        }
    }
    
    /**
     * Switches the control scheme for the car.
     */
    handleControlSwitch() {
        this.controlsSwitched = true;
    }

    /**
     * Checks for collision with 'shroom' objects on the track.
     */
    checkCollisionWithShroom() {
        if (!this.model || !this.app.contents || !this.app.contents.shrooms) {
            return;
        }
    
        const currentTime = Date.now();
    
        if (currentTime - this.lastControlSwitchTime < this.controlSwitchDuration) {
            return; 
        }
    
        const carPositionXZ = new THREE.Vector2(this.model.position.x, this.model.position.z);
    
        for (let shroom of this.app.contents.shrooms) {
            if (!shroom.model) {
                continue;
            }
    
            const shroomPositionXZ = new THREE.Vector2(
                shroom.model.position.x, 
                shroom.model.position.z
            );
    
            if (carPositionXZ.distanceTo(shroomPositionXZ) < 1) {
                this.handleShroomCollision();
                this.lastControlSwitchTime = currentTime;
                break;
            }
        }
    }
    
    /**
     * Handles the effect when the car collides with a 'shroom'.
     */
    handleShroomCollision() {
        this.lastShroomCollisionTime = Date.now();
        this.underShroomEffect = true;
    }

    /**
     * Checks for collisions with a rival car.
     * @param {Object} rival The rival car to check for collision against.
     */
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

    /**
     * Handles the effects when the car collides with rival.
     */
    handleCollision() {
        this.velocity.multiplyScalar(this.collisionDecelerationFactor);
        this.isCollided = true;
        this.inCollisionState = true;
        this.collisionEndTime = Date.now() + this.slowdownDuration;
    }

    /**
     * Checks for collision with clock objects on the track.
     */
    checkCollisionWithClock() {
        if (!this.model || !this.app.contents || !this.app.contents.clocks) {
            return;
        }
    
        const currentTime = Date.now();
    
        if (currentTime - this.lastCollisionTime < this.collisionCooldown) {
            return;
        }
    
        const carPosition = new THREE.Vector3().setFromMatrixPosition(this.model.matrixWorld);
        const collisionDistance = 2;
    
        for (let clock of this.app.contents.clocks) {
            if (!clock.model) {
                continue; 
            }
    
            const clockPosition = new THREE.Vector3().setFromMatrixPosition(clock.model.matrixWorld);
    
            const distance = carPosition.distanceTo(clockPosition);
    
            if (distance < collisionDistance) {
                this.handleClockCollision();
                this.lastCollisionTime = currentTime;
                break;
            }
        }
    }
    
    
    /**
     * Handles the effects when the car collides with a clock.
     */
    handleClockCollision() {
        if (this.app.contents.timer) {
            this.app.contents.timer.takeTime(5); 
        }
    }

    /**
     * Checks if the car is on the track.
     * @param {number} threshold The distance threshold to consider the car off track.
     * @returns {boolean} True if the car is on track, false otherwise.
     */
    isCarOnTrack(threshold = 10) {
        if (!this.model || !this.track || !this.track.path) {
            console.error('Car or track not properly initialized.');
            return false;
        }
    
        const carPosition = new THREE.Vector3().setFromMatrixPosition(this.model.matrixWorld);

        let closestPoint = this.trackPoints[0];
        let minDistance = carPosition.distanceTo(closestPoint);
    
        for (let i = 1; i < this.trackPoints.length; i++) {
            const distance = carPosition.distanceTo(this.trackPoints[i]);
            if (distance < minDistance) {
                minDistance = distance;
                closestPoint = this.trackPoints[i];
            }
        }
        //console.log(minDistance);

        /*if (minDistance > threshold) {
            console.log('Car is off track!');
        }
        else console.log('Car is on track!');*/

        return minDistance < threshold;
    }
    
    /**
     * Changes the color of the car.
     * @param {string} color The new color for the car.
     */
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

export { MyCar }
