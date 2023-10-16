import * as THREE from 'three';

class MyPainting  {

    constructor(x, y, z, scene, texture, type) {
        this.x = x; // X position in 3D space
        this.y = y; // Y position in 3D space
        this.z = z; // Z position in 3D space
        this.scene = scene; // The scene where the painting will be rendered
        this.type = type; // Type of the painting
        this.paintingTexture = texture; // Texture or image applied to the painting
        this.group = new THREE.Group(); // Create a group to hold the painting and its frame
    }

    init() {
        if (this.type === "painting") {
            // Create a painting with a frame
            let painting = new THREE.BoxGeometry(3, 3, 0.1);
            let paintingMaterial = new THREE.MeshPhongMaterial({ map: this.paintingTexture, side: THREE.FrontSide });
            let frame = new THREE.BoxGeometry(3.5, 3.5, 0.1);
            let frameMaterial = new THREE.MeshPhongMaterial({ color: "#000000", side: THREE.FrontSide });
            
            // Create a transparent material for areas without texture
            let tMaterial = new THREE.MeshPhongMaterial({ opacity: 0, transparent: true });

            // Create materials array for the frame and painting
            var materials = [tMaterial, tMaterial, tMaterial, tMaterial, tMaterial, frameMaterial];
            var materials1 = [tMaterial, tMaterial, tMaterial, tMaterial, tMaterial, paintingMaterial];

            // Create meshes for the frame and painting
            this.frameMesh = new THREE.Mesh(frame, materials);
            this.paintingMesh = new THREE.Mesh(painting, materials1);

            // Position the painting and frame
            this.paintingMesh.position.set(this.x, this.y, this.z - 0.03);
            this.frameMesh.position.set(this.x, this.y, this.z);

            // Add the painting and frame to the group
            this.group.add(this.paintingMesh);
            this.group.add(this.frameMesh);
        }
        else if (this.type === "car") {
            // Create a painting that looks like a car
            let frame = new THREE.BoxGeometry(8, 4, 0.4);
            let frameMaterial = new THREE.MeshPhongMaterial({ color: "#383838", specular: "#ffffff", shininess: 100 });
            let painting = new THREE.BoxGeometry(7.6, 3.6, 0.1);
            let paintingMaterial = new THREE.MeshPhongMaterial({ map: this.paintingTexture });
            
            // Create a transparent material for areas without texture
            let tMaterial = new THREE.MeshPhongMaterial({ opacity: 0, transparent: true });

            // Create materials array for the frame and painting
            var materials = [tMaterial, tMaterial, tMaterial, tMaterial, paintingMaterial, tMaterial];

            // Create meshes for the frame and painting
            this.mesh = new THREE.Mesh(frame, frameMaterial);
            this.pmesh = new THREE.Mesh(painting, paintingMaterial);

            // Rotate the car if it's a car painting
            if (this.type === "car") this.mesh.rotateY(Math.PI / 2);
            
            // Position the car painting and frame
            this.mesh.position.set(this.x, this.y, this.z);
            this.pmesh.position.set(this.x, this.y, this.z + 0.18);

            // Add the car painting and frame to the group
            this.group.add(this.mesh);
            this.group.add(this.pmesh);
        }
        else if (this.type === "window") {
            // Create a painting that looks like a window
            let painting = new THREE.BoxGeometry(9.5, 6, 0.01);
            let paintingMaterial = new THREE.MeshPhongMaterial({ map: this.paintingTexture });

            // Create a transparent material for areas without texture
            let tMaterial = new THREE.MeshPhongMaterial({ opacity: 0, transparent: true });

            // Create materials array for the window painting
            var materials = [tMaterial, tMaterial, tMaterial, tMaterial, paintingMaterial, tMaterial];

            // Create a mesh for the window painting
            this.pmesh = new THREE.Mesh(painting, materials);

            // Position the window painting
            this.pmesh.position.set(this.x, this.y, this.z);

            // Add the window painting to the group
            this.group.add(this.pmesh);
        }
    }
}

export { MyPainting };
