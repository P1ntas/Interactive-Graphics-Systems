import * as THREE from 'three';

class MyTrafficCone {
    constructor(x, y, z, contents) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.contents = contents;

        this.clock = new THREE.Clock();
        this.uniforms = {
            time: { value: 0.0 },
            scale: { value: 0.1 },
            tex: { value: this.contents.textures["trafficConeTex"] }
        };
    }

    init() {
        let cone = new THREE.ConeGeometry(1, 3, 32);

        const vertexShader = document.getElementById('vertexShader').textContent;
        const fragmentShader = document.getElementById('fragmentShader').textContent;

        let shaderMaterial = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        });

        this.mesh = new THREE.Mesh(cone, shaderMaterial);
        this.mesh.position.set(this.x, this.y, this.z);
    }

    update() {
        this.uniforms.time.value = this.clock.getElapsedTime();
    }
}

export { MyTrafficCone };
