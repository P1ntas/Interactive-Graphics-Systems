import * as THREE from 'three';

class MyDisplay {
    constructor(x, y, z, contents) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.contents = contents;
    }

    init() {
        this.group = new THREE.Group();

        // Other objects
        const barGeometry = new THREE.CylinderGeometry(0.2, 0.2, 10, 32);
        const bar1 = new THREE.Mesh(barGeometry, this.contents.materials["barApp"]);
        bar1.position.set(-1.8, 2.5, 0);
        const bar2 = new THREE.Mesh(barGeometry, this.contents.materials["barApp"]);
        bar2.position.set(7.8, 2.5, 0);
        this.group.add(bar1);
        this.group.add(bar2);

        const textureLoader = new THREE.TextureLoader();
        const mapTexture = textureLoader.load('./scenes/textures/brick.jpg');
        const bumpMap = textureLoader.load('./scenes/textures/bumpmap.jpg');

        // Create custom shader material
        const customMaterial = new THREE.ShaderMaterial({
            uniforms: {
                mapTexture: { value: mapTexture },
                bumpMap: { value: bumpMap },
                bumpScale: { value: 0.05 }
            },
            vertexShader: `
            uniform sampler2D bumpMap;
            uniform float bumpScale;

            varying vec2 vUv;
            varying vec3 vNormal;

            void main() {
                vUv = uv;
                vNormal = normal;

                vec3 bumpData = texture2D(bumpMap, uv).rgb;
                float displacement = (bumpData.x + bumpData.y + bumpData.z) / 3.0 * bumpScale;

                vec3 newPosition = position + normal * displacement;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
            }
            `,
            fragmentShader: `
            uniform sampler2D mapTexture;

            varying vec2 vUv;

            void main() {
                gl_FragColor = texture2D(mapTexture, vUv);
            }
            `
        });

        const displayGeometry = new THREE.BoxGeometry(9.5, 4, 0.1);
        const display = new THREE.Mesh(displayGeometry, customMaterial);
        display.position.set(3, 5.5, 0);
        this.group.add(display);

        this.group.position.set(this.x, this.y, this.z);
        this.group.rotation.y = Math.PI / 2;
        this.group.scale.set(2, 2, 2);
        this.group.position.y += 1.5;
    }

    getMesh() {
        return this.group;
    }
}

export { MyDisplay };
