import * as THREE from 'three';

/**
 * MyPolygon
 * @constructor
 * @param radius - radius of the circle
 * @param slices - number of subdivisions around the circle
 * @param stacks - number of concentric circles towards the center
 */
class MyPolygon extends THREE.BufferGeometry {
    constructor(radius = 1, slices = 32, stacks = 16) {
        super();
        this.radius = radius;
        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();
    }

    initBuffers() {
        const vertices = [];
        const indices = [];
        const normals = [];
        const uvs = [];

        for (let i = 0; i <= this.stacks; i++) {
            // Calculate the radius for this stack
            const stackRadius = (this.radius / this.stacks) * i;

            for (let j = 0; j <= this.slices; j++) {
                // Angle for this slice
                const sliceAngle = j * 2 * Math.PI / this.slices;
                const x = stackRadius * Math.cos(sliceAngle);
                const y = stackRadius * Math.sin(sliceAngle);

                vertices.push(x, y, 0);
                normals.push(0, 0, 1); // Normal facing up
                uvs.push((x / this.radius) / 2 + 0.5, (y / this.radius) / 2 + 0.5);
            }
        }

        // Creating two triangles for each quad in the grid
        for (let i = 0; i < this.stacks; i++) {
            for (let j = 0; j < this.slices; j++) {
                const first = i * (this.slices + 1) + j;
                const second = first + this.slices + 1;

                indices.push(first, second, first + 1);
                indices.push(second, second + 1, first + 1);
            }
        }

        this.setIndex(indices);
        this.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        this.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        this.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    }
}

export { MyPolygon };
