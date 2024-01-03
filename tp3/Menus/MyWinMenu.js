import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';


class MyWinMenu {
    constructor(x, y, z, scene) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.scene = scene;
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000 );

        this.startButton = null;

        this.createMenu();
    }

    createMenu() {
        this.createMenuBackgroundPlane();
        this.createWinText();
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

    createWinText() {
        const loader = new FontLoader();
        loader.load('fonts/helvetiker_bold.typeface.json', (font) => {
            const textGeometry = new TextGeometry('Congratulations!! You win the game', {
                font: font,
                size: 1,
                height: 0.1,
            });

            const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);

            textMesh.position.set(this.x - 10, this.y + 5, this.z); // Ajuste esses valores conforme necessário
            this.scene.add(textMesh);
        });
    }
}

export { MyWinMenu };
