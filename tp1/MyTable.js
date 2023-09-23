import * as THREE from 'three';

/**
 *  This class contains the contents of out application
 */
class MyTable  {

    /**
       constructs the object
       @param {MyTable} app The application object
    */ 
    constructor(size, scene) {
        this.size = size
        this.scene = scene

        this.group = new THREE.Group()

    }

    /**
     * initializes the contents
     */
    init() {

        
        
    }
}

export { MyTable };