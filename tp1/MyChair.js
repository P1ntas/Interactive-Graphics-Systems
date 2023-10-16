import * as THREE from 'three';

/**
 * Classe que representa uma cadeira melhorada.
 */
class MyChair {
  constructor(x, y, z, scene) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.scene = scene;
    this.init();
  }

  init() {
    // Pernas da cadeira
    const legGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1.5, 32);
    const legMaterial = new THREE.MeshPhongMaterial({ color: '#000000', shininess: 100 });

    const legs = new THREE.Group();

    for (let i = -1; i <= 1; i += 2) {
      for (let j = -1; j <= 1; j += 2) {
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        leg.position.set(i, -0.75, j);
        legs.add(leg);
      }
    }

    // assento da cadeira 
    const seatGeometry = new THREE.BoxGeometry(3, 0.2, 2.5);
    const seatTexture = new THREE.TextureLoader().load('img/chairTexture.jpg'); 
    seatTexture.wrapS = THREE.RepeatWrapping;
    seatTexture.wrapT = THREE.RepeatWrapping;
    const seatMaterial = new THREE.MeshPhongMaterial({ map: seatTexture });
    const seat = new THREE.Mesh(seatGeometry, seatMaterial);
    seat.position.set(0, 0, 0);

    //encosto da cedeira
    const backrestGeometry = new THREE.BoxGeometry(3, 2.8, 0.2);
    const backrestMaterial = new THREE.MeshPhongMaterial({ map: seatTexture });
    const backrest = new THREE.Mesh(backrestGeometry, backrestMaterial);
    backrest.position.set(0, 1.3, 1.3);

    seat.castShadow = true;
    seat.receiveShadow = true;

    backrest.castShadow = true;
    backrest.receiveShadow = true;

    legMaterial.castShadow = true;
    legMaterial.receiveShadow = true;

    this.mesh = new THREE.Group();
    this.mesh.add(legs);
    this.mesh.add(seat);
    this.mesh.add(backrest);

    this.mesh.position.set(this.x+1, this.y-0.5, this.z+0.5);
    this.mesh.rotateY(-Math.PI / 8);

}
}

export { MyChair };
