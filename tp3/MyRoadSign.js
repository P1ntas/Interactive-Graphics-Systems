import * as THREE from 'three';

class MyRoadSign {

    constructor(x, y, z, texturePath) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    init() {
        let barGeometry = new THREE.CylinderGeometry( 0.1, 0.1, 5, 32 );
        let barMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 });
        let bar = new THREE.Mesh(barGeometry, barMaterial);

        let signGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.3, 32);
        let signMaterial = new THREE.MeshPhongMaterial({ 
            map: new THREE.TextureLoader().load("./scenes/textures/arrows.png")
        });
        let sign = new THREE.Mesh(signGeometry, signMaterial);

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
