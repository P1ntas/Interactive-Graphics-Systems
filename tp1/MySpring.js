import * as THREE from 'three';

/**
 *  This class contains the contents of out application
 */
class MySpring  {

    /**
       constructs the object
       @param {MySpring} app The application object
    */ 
    constructor(x,y,z,scene) {
        this.x = x
        this.y = y
        this.z = z
        this.scene = scene

        this.group = new THREE.Group()
    }

    /**
     * initializes the contents
     */
    init() {


        
    }
}

export { MySpring };