import * as THREE from 'three';

/**
 * Represents a traffic cone in a 3D environment with a shader effect.
 */
class MyTrafficCone {
    /**
     * Constructs a MyTrafficCone object.
     * @param {number} x The x-coordinate of the cone in the 3D world.
     * @param {number} y The y-coordinate of the cone in the 3D world.
     * @param {number} z The z-coordinate of the cone in the 3D world.
     * @param {Object} contents Contains additional data and resources needed for the cone, like textures.
     */
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

    /**
     * Initializes the cone's geometry and shader material.
     */
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

    /**
     * Updates the cone's shader material based on the elapsed time.
     */
    update() {
        this.uniforms.time.value = this.clock.getElapsedTime();
    }
}

export { MyTrafficCone };
