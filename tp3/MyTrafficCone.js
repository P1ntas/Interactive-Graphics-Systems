import * as THREE from 'three';

class MyTrafficCone  {

    constructor(x,y,z) {
        this.x = x
        this.y = y
        this.z = z
    }

    init() {
        let cone = new THREE.ConeGeometry( 1, 3, 32 );
        let coneMaterial = new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load("./scenes/textures/trafficCone.jpeg") });
        
        this.mesh = new THREE.Mesh(cone, coneMaterial);
        
        this.mesh.position.set(this.x,this.y, this.z);
    }
}

export { MyTrafficCone };