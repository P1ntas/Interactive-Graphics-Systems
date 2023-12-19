import * as THREE from 'three';

class MyBillboard {

    constructor(x, y, z, timer, contents) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.timer = timer; 
        this.contents = contents;
    }

    init() {
        this.group = new THREE.Group();

        const barGeometry = new THREE.CylinderGeometry(0.2, 0.2, 10, 32);

        const bar1 = new THREE.Mesh(barGeometry, this.contents.materials["barApp"]);
        bar1.position.set(-1.8, 2.5, 0);

        const bar2 = new THREE.Mesh(barGeometry, this.contents.materials["barApp"]);
        bar2.position.set(7.8, 2.5, 0);

        this.group.add(bar1);
        this.group.add(bar2);


        const displayGeometry = new THREE.BoxGeometry(9.5, 4, 0.1);

        const display = new THREE.Mesh(displayGeometry, this.contents.materials["displayApp"]);
        display.position.set(3, 5.5, 0);

        this.group.add(display);


        this.group.position.set(this.x, this.y, this.z);
        this.group.rotation.y = -Math.PI / 4;
        this.group.scale.set(2, 2, 2)

        this.update();
    }

    update() {
        
    }

    getMesh() {
        return this.group;
    }
}

export { MyBillboard };
