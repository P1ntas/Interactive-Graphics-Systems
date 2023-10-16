import * as THREE from 'three';

class MyBookshelf {
    constructor(x, y, z, scene) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.scene = scene;
        this.group = new THREE.Group();
    }

    init() {
        let box = new THREE.BoxGeometry(8, 1, 2);

        let wood = new THREE.TextureLoader().load('img/bookshelf_wood.jpeg');
        let mat = new THREE.MeshPhongMaterial({ map: wood });
        let below = new THREE.MeshPhongMaterial({transparent: true});
        let materials1 = [mat, mat, mat, below, mat]
        this.mesh = new THREE.Mesh(box, materials1);

        this.mesh.rotateY(-Math.PI / 2);
        this.mesh.position.set(this.x, this.y, this.z);

        let books = new THREE.BoxGeometry(4, 2, 1.5);
        let book = new THREE.TextureLoader().load('img/book.png');
        let side = new THREE.MeshPhongMaterial({color: "#995128"})
        let mat1 = new THREE.MeshPhongMaterial({ map: book });
        let materials = [side, side, mat1, below, mat1] 
        this.mesh1 = new THREE.Mesh(books, materials);

        this.mesh1.rotateY(-Math.PI / 2);
        this.mesh1.position.set(this.x + 0.3, this.y + 1.5, this.z);

        this.group.add(this.mesh);
        this.group.add(this.mesh1);

    }
}

export { MyBookshelf };
