import * as THREE from 'three';

class MyBookshelf {

    /**
     * Constructor for the MyBookshelf class.
     * @param {number} x - X position of the bookshelf in 3D space.
     * @param {number} y - Y position of the bookshelf in 3D space.
     * @param {number} z - Z position of the bookshelf in 3D space.
     * @param {THREE.Scene} scene - The scene in which the bookshelf will be rendered.
     */
    constructor(x, y, z, scene) {
        // Initialize the position and scene for the bookshelf.
        this.x = x;
        this.y = y;
        this.z = z;
        this.scene = scene;

        // Create a Three.js group to hold the bookshelf objects.
        this.group = new THREE.Group();
    }

    init() {
        // Create the bookshelf geometry.
        let box = new THREE.BoxGeometry(8, 1, 3);

        // Load the wood texture for the bookshelf.
        let wood = new THREE.TextureLoader().load('img/bookshelf_wood.jpeg');

        // Create materials for the bookshelf parts.
        let mat = new THREE.MeshPhongMaterial({ map: wood });
        let below = new THREE.MeshPhongMaterial({ transparent: true });

        // Combine the materials for different parts of the bookshelf.
        let materials1 = [mat, mat, mat, below, mat];

        // Create a mesh for the bookshelf.
        this.mesh = new THREE.Mesh(box, materials1);

        // Rotate and position the bookshelf in 3D space.
        this.mesh.rotateY(-Math.PI / 2);
        this.mesh.position.set(this.x, this.y, this.z);

        // Create the books' geometry.
        let books = new THREE.BoxGeometry(4, 2, 1.5);

        // Load a texture for the book covers.
        let book = new THREE.TextureLoader().load('img/book.png');

        // Create materials for the book covers and sides.
        let side = new THREE.MeshPhongMaterial({ color: "#995128" });
        let mat1 = new THREE.MeshPhongMaterial({ map: book });

        // Combine the materials for the books.
        let materials = [side, side, mat1, below, mat1];

        // Create a mesh for the books.
        this.mesh1 = new THREE.Mesh(books, materials);

        // Rotate and position the books on the bookshelf.
        this.mesh1.rotateY(-Math.PI / 2);
        this.mesh1.position.set(this.x + 0.3, this.y + 1.5, this.z);

        // Add the bookshelf and books to the Three.js group.
        this.group.add(this.mesh);
        this.group.add(this.mesh1);
    }
}

export { MyBookshelf };
