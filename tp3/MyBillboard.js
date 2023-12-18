import * as THREE from 'three';

class MyBillboard {

    constructor(x, y, z, startTime) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.startTime = this.startTime; 
        this.canvas = document.createElement('canvas');
        this.canvas.width = 512;
        this.canvas.height = 256;
        this.context = this.canvas.getContext('2d');
    }

    init() {
        this.group = new THREE.Group();

        const barGeometry = new THREE.CylinderGeometry(0.2, 0.2, 10, 32);
        const barMaterial = new THREE.MeshPhongMaterial({ 
            map: new THREE.TextureLoader().load("./scenes/textures/metal.jpg") ,
            side: THREE.DoubleSide
        });

        const bar1 = new THREE.Mesh(barGeometry, barMaterial);
        bar1.position.set(-1.8, 2.5, 0);

        const bar2 = new THREE.Mesh(barGeometry, barMaterial);
        bar2.position.set(7.8, 2.5, 0);

        this.group.add(bar1);
        this.group.add(bar2);


        const displayGeometry = new THREE.BoxGeometry(9.5, 4, 0.1);
        const displayMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });

        const display = new THREE.Mesh(displayGeometry, displayMaterial);
        display.position.set(3, 5.5, 0);

        this.group.add(display);


        this.group.position.set(this.x, this.y, this.z);
        this.group.rotation.y = -Math.PI / 4;

        this.update();
    }

    update() {
        
    }

    getMesh() {
        return this.group;
    }
}

export { MyBillboard };
