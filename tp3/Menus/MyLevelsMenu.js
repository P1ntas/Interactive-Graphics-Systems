import * as THREE from 'three';

class MyLevelsMenu {
    constructor(x, y, z, scene) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.scene = scene;
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

        this.startButton = null;

        this.createMenu();
    }

    createMenu() {
        this.createMenuBackgroundPlane();
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

}

export { MyLevelsMenu };
