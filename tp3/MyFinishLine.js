import * as THREE from 'three';

/**
 * Represents a finish line in a 3D environment, managing its creation and positioning.
 */
class MyFinishLine {
    /**
     * Constructs a MyFinishLine object.
     * @param {number} x The x-coordinate of the finish line in the 3D world.
     * @param {number} y The y-coordinate of the finish line in the 3D world.
     * @param {number} z The z-coordinate of the finish line in the 3D world.
     * @param {Object} contents Contains additional data and resources like materials for the finish line.
     */
    constructor(x, y, z, contents) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.contents = contents;
    }

    /**
     * Initializes the finish line by creating and positioning its components.
     */
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
