import * as THREE from 'three';

class MyLostMenu {
    constructor(x, y, z, scene) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.scene = scene;
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

        this.restartButton = null;

        this.createMenu();
    }

    createMenu() {
        this.createMenuBackgroundPlane();
        this.createRestartButton();
    }

    createMenuBackgroundPlane() {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load('scenes/textures/lostMenuBackground.png', 
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

    createRestartButton() {
        return new Promise((resolve, reject) => {
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load(
                'scenes/textures/restartButton.png',
                (texture) => {
                    const geometry = new THREE.PlaneGeometry(7,7);
                    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
                    this.restartButton = new THREE.Mesh(geometry, material);
                    this.restartButton.rotateY(Math.PI/2);
                    this.restartButton.position.set(this.x + 0.2, this.y+4, this.z);
                    this.restartButton.name = 'restart_button';
                    this.scene.add(this.restartButton);
    
                    resolve(texture);
                },
                undefined,
                (err) => {
                    console.error('Error loading start button texture:', err);
                    reject(err);
                }
            );
        });
    }
}

export { MyLostMenu };
