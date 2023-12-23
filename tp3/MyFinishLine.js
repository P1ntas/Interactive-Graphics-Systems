import * as THREE from 'three';

class MyFinishLine {

    constructor(x, y, z, contents) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.contents = contents;
    }

    init() {
        this.group = new THREE.Group();

        const barGeometry = new THREE.CylinderGeometry(0.2, 0.2, 15, 32);

        const bar1 = new THREE.Mesh(barGeometry, this.contents.materials["barApp"]);
        bar1.position.set(-9.8, 8, 0);

        const bar2 = new THREE.Mesh(barGeometry, this.contents.materials["barApp"]);
        bar2.position.set(9, 8, 0);

        this.group.add(bar1);
        this.group.add(bar2);


        const displayGeometry = new THREE.BoxGeometry(18.8, 4, 0.1);

        const display = new THREE.Mesh(displayGeometry, this.contents.materials["finishLineApp"]);
        display.position.set(-0.3, 13.5, 0);

        this.group.add(display);


        this.group.position.set(this.x, this.y, this.z);
        this.group.rotation.y = Math.PI / 2;
    }
}

export { MyFinishLine };
