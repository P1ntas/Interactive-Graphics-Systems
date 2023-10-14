import * as THREE from 'three';

/**
 *  This class contains the contents of out application
 */
class MyNewspaper  {

    /**
       constructs the object
       @param {MyNewspaper} app The application object
    */ 
    constructor(scene) {
        this.scene = scene
        this.group = new THREE.Group()
    }
    init() {

    }

}

export { MyNewspaper };


