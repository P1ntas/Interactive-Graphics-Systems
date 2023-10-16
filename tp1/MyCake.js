import * as THREE from 'three';

class MyCake {

    /**
     * Constructor for the MyCake class.
     * @param {number} x - X position of the cake in 3D space.
     * @param {number} y - Y position of the cake in 3D space.
     * @param {number} z - Z position of the cake in 3D space.
     * @param {THREE.Scene} scene - The scene in which the cake will be rendered.
     */
    constructor(x, y, z, scene) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.scene = scene;
        this.mesh;
        this.candleMesh;
        this.fireMesh;
        this.fireMesh2;
        this.leftPlaneMesh;
        this.rightPlaneMesh;

        this.group = new THREE.Group();
    }

    /**
     * Initializes the contents of the cake.
     */
    init() {
        // Create the cake geometry.
        let myCake = new THREE.CylinderGeometry(1, 1, 1, 24, 2, false, Math.PI * 0.25, Math.PI * 1.75);

        // Create a material for the cake.
        let cakeMaterial = new THREE.MeshPhongMaterial({ color: "#FFC0CB", side: THREE.DoubleSide });

        // Create the 3D object of the cake.
        this.mesh = new THREE.Mesh(myCake, cakeMaterial);
        this.mesh.position.set(this.x, this.y, this.z);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        // Create geometries for left and right planes.
        let leftPlane = new THREE.PlaneGeometry(2, 1);
        let rightPlane = new THREE.PlaneGeometry(2, 1);

        // Create materials for the planes.
        this.leftPlaneMesh = new THREE.Mesh(leftPlane, cakeMaterial);
        this.leftPlaneMesh.rotateY(Math.PI * 0.5);
        this.leftPlaneMesh.position.set(this.x, this.y, this.z);
        this.leftPlaneMesh.castShadow = true;
        this.leftPlaneMesh.receiveShadow = true;

        this.rightPlaneMesh = new THREE.Mesh(rightPlane, cakeMaterial);
        this.rightPlaneMesh.rotateY(Math.PI * 0.75);
        this.rightPlaneMesh.position.set(this.x, this.y, this.z);
        this.rightPlaneMesh.castShadow = true;
        this.rightPlaneMesh.receiveShadow = true;

        // Create the candle geometry.
        let myCandle = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 12);

        // Create a material for the candle.
        let candleMaterial = new THREE.MeshPhongMaterial({ color: "#FFFFFF" });

        // Create the 3D object of the candle.
        this.candleMesh = new THREE.Mesh(myCandle, candleMaterial);
        this.candleMesh.position.set(this.x, this.y + 0.75, this.z);
        this.candleMesh.castShadow = true;
        this.candleMesh.receiveShadow = true;

        // Create geometries for the flames (half-sphere and cone).
        let halfSphere = new THREE.SphereGeometry(0.1, 10, 5, 0, Math.PI * 2, 0, Math.PI / 2);
        let cone = new THREE.ConeGeometry(0.1, 0.4, 16);

        // Create a material for the flames.
        let fireMaterial = new THREE.MeshPhongMaterial({ color: "#E25822", side: THREE.DoubleSide });

        // Create 3D objects for the flames.
        this.fireMesh = new THREE.Mesh(halfSphere, fireMaterial);
        this.fireMesh.rotateX(Math.PI);
        this.fireMesh.position.set(this.x, this.y + 1.2, this.z);
        this.fireMesh.castShadow = true;
        this.fireMesh.receiveShadow = true;

        this.fireMesh2 = new THREE.Mesh(cone, fireMaterial);
        this.fireMesh2.position.set(this.x, this.y + 1.4, this.z);
        this.fireMesh2.castShadow = true;
        this.fireMesh2.receiveShadow = true;
    }
}

export { MyCake };
