import * as THREE from 'three';

class MyCar {
    constructor(scene) {
        this.scene = scene;
        this.box = null;
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
        document.addEventListener('keydown', this.onDocumentKeyDown);
    }

    onDocumentKeyDown = (event) => {
        const keyCode = event.key;
        switch (keyCode) {
            case 'w': // Move forward
                this.box.position.z -= 1;
                break;
            case 's': // Move backward
                this.box.position.z += 1;
                break;
            case 'a': // Move left
                this.box.position.x -= 1;
                break;
            case 'd': // Move right
                this.box.position.x += 1;
                break;
        }
    }
}

export { MyCar }
