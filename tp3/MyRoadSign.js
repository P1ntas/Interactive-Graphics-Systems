import * as THREE from 'three';

class MyRoadSign {

    constructor(x, y, z, contents) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.contents = contents;
    }

    init() {
        let barGeometry = new THREE.CylinderGeometry( 0.1, 0.1, 5, 32 );
        let bar = new THREE.Mesh(barGeometry, this.contents.materials["barApp"]);

        let signGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.3, 32);
        let sign = new THREE.Mesh(signGeometry, this.contents.materials["arrowsApp"]);

        bar.position.y += 2.5
        sign.position.y = 5

        this.mesh = new THREE.Group();
        this.mesh.position.set(this.x, this.y, this.z);
        this.mesh.add(bar);
        this.mesh.add(sign);

        sign.rotation.x = -Math.PI / 2;
        sign.rotation.y = -Math.PI / 2;
    }
}

export { MyRoadSign };
