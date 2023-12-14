import * as THREE from 'three';

class MyTrack {
    constructor(app) {
        this.app = app;
        this.segments = 100;
        this.radius = 1;
        this.textureRepeat = 100;
        this.showWireframe = false;
        this.showMesh = true;
        this.showLine = true;
        this.closedCurve = false;
        this.curve = null;
        this.path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, -6),
            new THREE.Vector3(-7, 0, -5),
            new THREE.Vector3(-7, 0, 5),
            new THREE.Vector3(-3, 0, 5),
            new THREE.Vector3(-2, 0, 0),
            new THREE.Vector3(0, 0, -1),
            new THREE.Vector3(2, 0, 0),
            new THREE.Vector3(3, 0, 5),
            new THREE.Vector3(7, 0, 5),
            new THREE.Vector3(7, 0, -5),
            new THREE.Vector3(-0.3, 0, -6)
        ]);
    }

    loadTexture() {
        const texture = new THREE.TextureLoader().load("./scenes/textures/rainbow.jpeg");
        texture.wrapS = THREE.RepeatWrapping;
        return texture;
    }

    createMaterial(texture) {
        let material = new THREE.MeshBasicMaterial({ map: texture });
        material.map.repeat.set(3, 3);
        material.map.wrapS = THREE.RepeatWrapping;
        material.map.wrapT = THREE.RepeatWrapping;
        material.map.repeat.set(5, 5);
        return material;
    }

    createWireframeMaterial() {
        return new THREE.MeshBasicMaterial({
            color: 0x0000ff,
            opacity: 0.3,
            wireframe: true,
            transparent: true,
        });
    }

    createLineMaterial() {
        return new THREE.LineBasicMaterial({ color: 0xff0000 });
    }

    createGeometry() {
        return new THREE.TubeGeometry(
            this.path,
            this.segments,
            this.radius,
            3,
            this.closedCurve
        );
    }

    createMesh(geometry, material) {
        return new THREE.Mesh(geometry, material);
    }

    createLine() {
        let points = this.path.getPoints(this.segments);
        let geometry = new THREE.BufferGeometry().setFromPoints(points);
        let material = this.createLineMaterial();
        return new THREE.Line(geometry, material);
    }

    createTrack() {
        const texture = this.loadTexture();
        const material = this.createMaterial(texture);
        const wireframeMaterial = this.createWireframeMaterial();
        const geometry = this.createGeometry(this.path);
        const mesh = this.createMesh(geometry, material);
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
