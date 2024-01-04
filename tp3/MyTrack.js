import * as THREE from 'three';

/**
 * Represents a 3D track in a virtual environment, handling its creation, textures, and geometry.
 */
class MyTrack {
    /**
     * Constructs a MyTrack object.
     * @param {Object} app The main application context.
     * @param {Object} contents Contains additional data and resources needed for the track, like textures and materials.
     */
    constructor(app, contents) {
        this.app = app;
        this.contents = contents;
        this.segments = 100;
        this.radius = 1;
        this.textureRepeat = 100;
        this.showWireframe = false;
        this.showMesh = true;
        this.showLine = true;
        this.closedCurve = false;
        this.curve = null;
        this.path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0.3, 0, -5),
            new THREE.Vector3(-7, 0, -5),
            new THREE.Vector3(-7, 0, 5),
            new THREE.Vector3(-3, 0, 5),
            new THREE.Vector3(-2, 0, 0),
            new THREE.Vector3(0, 0, -1),
            new THREE.Vector3(2, 0, 0),
            new THREE.Vector3(3, 0, 5),
            new THREE.Vector3(7, 0, 5),
            new THREE.Vector3(7, 0, -5),
            new THREE.Vector3(0.3, 0, -5)
        ]);
    }

    /**
     * Loads a texture from a given path.
     * @returns {THREE.Texture} The loaded texture.
     */
    loadTexture() {
        const texture = new THREE.TextureLoader().load("./scenes/textures/rainbow.jpeg");
        texture.wrapS = THREE.RepeatWrapping;
        return texture;
    }

    /**
     * Creates a material using a given texture.
     * @param {THREE.Texture} texture The texture to use for the material.
     * @returns {THREE.MeshBasicMaterial} The created material.
     */
    createMaterial(texture) {
        let material = new THREE.MeshBasicMaterial({ map: texture });
        material.map.repeat.set(3, 3);
        material.map.wrapS = THREE.RepeatWrapping;
        material.map.wrapT = THREE.RepeatWrapping;
        material.map.repeat.set(5, 5);
        return material;
    }

    /**
     * Creates a wireframe material.
     * @returns {THREE.MeshBasicMaterial} The created wireframe material.
     */
    createWireframeMaterial() {
        return new THREE.MeshBasicMaterial({
            color: 0x0000ff,
            opacity: 0.3,
            wireframe: true,
            transparent: true,
        });
    }

    /**
     * Creates a line material.
     * @returns {THREE.LineBasicMaterial} The created line material.
     */
    createLineMaterial() {
        return new THREE.LineBasicMaterial({ color: 0xff0000 });
    }

    /**
     * Creates the geometry for the track based on the defined path.
     * @returns {THREE.TubeGeometry} The created geometry.
     */
    createGeometry() {
        return new THREE.TubeGeometry(
            this.path,
            this.segments,
            this.radius,
            3,
            this.closedCurve
        );
    }

    /**
     * Creates a mesh using the given geometry and material.
     * @param {THREE.Geometry} geometry The geometry for the mesh.
     * @param {THREE.Material} material The material for the mesh.
     * @returns {THREE.Mesh} The created mesh.
     */
    createMesh(geometry, material) {
        return new THREE.Mesh(geometry, material);
    }

    /**
     * Creates a line representing the track's path.
     * @returns {THREE.Line} The created line.
     */
    createLine() {
        let points = this.path.getPoints(this.segments);
        let geometry = new THREE.BufferGeometry().setFromPoints(points);
        let material = this.createLineMaterial();
        return new THREE.Line(geometry, material);
    }

    /**
     * Creates the complete track with its geometry, mesh, and line.
     */
    createTrack() {
        const wireframeMaterial = this.createWireframeMaterial();
        const geometry = this.createGeometry(this.path);
        this.contents.materials["rainbowApp"].map.repeat.set(3, 3);
        this.contents.materials["rainbowApp"].map.wrapS = THREE.RepeatWrapping;
        this.contents.materials["rainbowApp"].map.wrapT = THREE.RepeatWrapping;
        this.contents.materials["rainbowApp"].map.repeat.set(5, 5);
        const mesh = this.createMesh(geometry, this.contents.materials["rainbowApp"]);
        const wireframe = this.createMesh(geometry, wireframeMaterial);
        const line = this.createLine(this.path);

        this.curve = new THREE.Group();
        this.curve.add(mesh);
        this.curve.add(wireframe);
        this.curve.add(line);

        mesh.visible = this.showMesh;
        wireframe.visible = this.showWireframe;
        line.visible = this.showLine;

        this.curve.rotateZ(Math.PI);
        this.curve.scale.set(10, 1, 10);
        this.app.scene.add(this.curve);
    }
}


export { MyTrack }
