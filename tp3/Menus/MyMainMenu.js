import * as THREE from 'three';

class MyMainMenu {
    constructor(x, y, z, scene) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.scene = scene;
        this.createMenu();
    }

    createMenu() {
        this.createMenuBackgroundPlane();
        this.createStartButton();
    }

    createMenuBackgroundPlane() {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load('scenes/textures/menuBackground.jpg', 
            // onLoad callback
            (texture) => {
                const geometry = new THREE.PlaneGeometry(50, 30);
                const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
                const plane = new THREE.Mesh(geometry, material);
                plane.rotateY(Math.PI/2);
                plane.position.set(this.x, this.y, this.z);
                this.scene.add(plane);
            },
            // onProgress callback
            undefined,
            // onError callback
            (err) => {
                console.error('Error loading menu background texture:', err);
            }
        );
    }

    createStartButton() {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load('scenes/textures/startButton.png', 
            (texture) => {
                const geometry = new THREE.PlaneGeometry(10, 5); // Adjust size as needed
                const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
                this.startButton = new THREE.Mesh(geometry, material);
                this.startButton.rotateY(Math.PI/2);
                this.startButton.position.set(this.x + 0.2, this.y, this.z); // Ensure this is in front of the background plane
                this.scene.add(this.startButton);
            },
            undefined,
            (err) => {
                console.error('Error loading start button texture:', err);
            }
        );
    }
}

export { MyMainMenu };
