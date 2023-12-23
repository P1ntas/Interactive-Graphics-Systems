import * as THREE from 'three';

class MyTrafficCone  {

    constructor(x,y,z, contents) {
        this.x = x
        this.y = y
        this.z = z
        this.contents = contents;
    }

    init() {
        let cone = new THREE.ConeGeometry( 1, 3, 32 );
        
        this.mesh = new THREE.Mesh(cone, this.contents.materials["trafficConeApp"]);
        
        this.mesh.position.set(this.x,this.y, this.z);
    }
}

export { MyTrafficCone };