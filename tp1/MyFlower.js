import * as THREE from 'three';

class MyFlower {
    constructor(x, y, z, scene) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.scene = scene;
        this.group = new THREE.Group();
    }

    init() {
        // Create the rose-like flower with a circular center and petals.
        this.createRoseFlower();
    }

    createRoseFlower() {
        const numPetals = 12; // Number of petals in the "rose."
        this.petalRadius = 0.15;
        this.petalHeight = 0.05;
        this.petalMaterial = new THREE.MeshLambertMaterial({ color: "#cd7c8d" }); 

        // Create the circular center of the rose.
        this.centerGeometry = new THREE.CircleGeometry(this.petalRadius * 0.5, 16);
        this.centerMaterial = new THREE.MeshLambertMaterial({ color: "#ffff00", side: THREE.DoubleSide});
        this.center = new THREE.Mesh(this.centerGeometry, this.centerMaterial);
        this.center.rotation.x = Math.PI / 2; // Rotate it to be horizontal
        this.center.position.y = 0.05;

        this.center.castShadow = true;
        this.center.receiveShadow = true;

        this.group.add(this.center);

        for (let i = 0; i < numPetals; i++) {
            const angle = (i / numPetals) * Math.PI * 2;
            const x = this.petalRadius * Math.cos(angle);
            const z = this.petalRadius * Math.sin(angle);

            this.petalGeometry = new THREE.CylinderGeometry(0, this.petalRadius, this.petalHeight, 16, 1);
            this.petal = new THREE.Mesh(this.petalGeometry, this.petalMaterial);
            this.petal.position.set(x, this.petalHeight / 2, z);

            this.petal.castShadow = true;
            this.petal.receiveShadow = true;

            this.group.add(this.petal);
        }

        // Create the stem using a CubicBezierCurve3.
        const stemCurve = new THREE.CubicBezierCurve3(
            new THREE.Vector3(0, 0, 0), // Start point
            new THREE.Vector3(0.3, -0.7, 0), // Control point 1
            new THREE.Vector3(0.3, -1.4, 0), // Control point 2
            new THREE.Vector3(0, -2, 0) // End point
        );

        const stemPoints = stemCurve.getPoints(50);
        const stemGeometry = new THREE.BufferGeometry().setFromPoints(stemPoints);
        const stemMaterial = new THREE.MeshLambertMaterial({ color: "#5ced73" });
        const stem = new THREE.Line(stemGeometry, stemMaterial);

        this.group.add(stem);

        // Position the flower group within the jar.
        this.group.position.set(this.x, this.y, this.z);

    }
}

export { MyFlower };
