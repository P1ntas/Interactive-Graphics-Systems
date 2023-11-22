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

        // Initialize the buffers for geometry.
        this.initBuffers();
    }

    /**
     * Initializes buffers for the polygon geometry.
     */
    initBuffers() {
        // Arrays to store vertices, indices, normals, and texture coordinates.
        const vertices = [];
        const indices = [];
        const normals = [];
        const uvs = [];

        // Calculate vertices for each stack and slice.
        for (let i = 0; i <= this.stacks; i++) {

            const stackRadius = (this.radius / this.stacks) * i;

            // Loop through each stack and slice to calculate vertices.
            for (let j = 0; j <= this.slices; j++) {

                const sliceAngle = j * 2 * Math.PI / this.slices;
                const x = stackRadius * Math.cos(sliceAngle);
                const y = stackRadius * Math.sin(sliceAngle);

                vertices.push(x, y, 0);
                normals.push(0, 0, 1);
                uvs.push((x / this.radius) / 2 + 0.5, (y / this.radius) / 2 + 0.5);
            }
        }

        // Create faces (triangles) using calculated vertices.
        for (let i = 0; i < this.stacks; i++) {
            // Loop to create two triangles for each quad in the grid.
            for (let j = 0; j < this.slices; j++) {
                const first = i * (this.slices + 1) + j;
                const second = first + this.slices + 1;

                indices.push(first, second, first + 1);
                indices.push(second, second + 1, first + 1);
            }
        }

        // Assign the calculated arrays to the BufferGeometry.
        this.setIndex(indices);
        this.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        this.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        this.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    }
}

export { MyPolygon };
