import * as THREE from 'three';

class MyFinishLine {

    constructor(x, y, z,) {
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

        const barGeometry = new THREE.CylinderGeometry(0.2, 0.2, 15, 32);
        const barMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, emissive:0xffffff, side: THREE.DoubleSide
        });

        const bar1 = new THREE.Mesh(barGeometry, barMaterial);
        bar1.position.set(-9.8, 8, 0);

        const bar2 = new THREE.Mesh(barGeometry, barMaterial);
        bar2.position.set(9, 8, 0);

        this.group.add(bar1);
        this.group.add(bar2);


        const displayGeometry = new THREE.BoxGeometry(18.8, 4, 0.1);
        const displayMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("./scenes/textures/finishLine.jpg"), side: THREE.DoubleSide });

        const display = new THREE.Mesh(displayGeometry, displayMaterial);
        display.position.set(-0.3, 13.5, 0);

        this.group.add(display);


        this.group.position.set(this.x, this.y, this.z);
        this.group.rotation.y = Math.PI / 2;
    }
}

export { MyFinishLine };
