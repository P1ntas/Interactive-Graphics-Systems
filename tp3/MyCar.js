import * as THREE from 'three';

class MyCar {
    constructor(scene) {
        this.scene = scene;
        this.box = null;
        this.keyStates = { w: false, a: false, s: false, d: false };
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.acceleration = 0.005; // Rate of speed increase
        this.maxSpeed = 1; // Maximum speed
        this.deceleration = 0.1; // Rate of speed decrease when keys are released
        this.createBox();
        this.initEventListeners();
    }

    createBox() {
        const geometry = new THREE.BoxGeometry(1, 1, 1); // Size of the box
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green color
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
    }

    updateMovement() {
        // Update velocity based on key states
        if (this.keyStates.w) this.velocity.z = Math.max(this.velocity.z - this.acceleration, -this.maxSpeed);
        else if (this.keyStates.s) this.velocity.z = Math.min(this.velocity.z + this.acceleration, this.maxSpeed);
        else this.velocity.z *= (1 - this.deceleration); // Natural deceleration

        if (this.keyStates.a) this.velocity.x = Math.max(this.velocity.x - this.acceleration, -this.maxSpeed);
        else if (this.keyStates.d) this.velocity.x = Math.min(this.velocity.x + this.acceleration, this.maxSpeed);
        else this.velocity.x *= (1 - this.deceleration); // Natural deceleration

        // Update the box position
        this.box.position.add(this.velocity);
    }
}

export { MyCar }
