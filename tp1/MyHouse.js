import * as THREE from 'three';

/**
 *  This class contains the contents of out application
 */
class MyHouse  {

    /**
       constructs the object
       @param {MyHouse} app The application object
    */ 
    constructor(size, scene) {
        this.size = size
        this.scene = scene

        this.group = new THREE.Group()


        // plane related attributes
        this.diffusePlaneColor = "#00ffff"
        this.specularPlaneColor = "#777777"
        this.planeShininess = 30
        this.planeMaterial = new THREE.MeshPhongMaterial({ color: this.diffusePlaneColor, 
            specular: this.diffusePlaneColor, emissive: "#000000", shininess: this.planeShininess, side: THREE.DoubleSide })
    }

    /**
     * initializes the contents
     */
    init() {

        
        // Create a Plane Mesh with basic material
        
        let plane = new THREE.PlaneGeometry( this.size * 2, this.size * 2 );
        this.planeMesh = new THREE.Mesh( plane, this.planeMaterial );
        this.planeMesh.rotation.x = -Math.PI / 2;
        this.planeMesh.position.y = -0;
        this.scene.app.scene.add( this.planeMesh );

        let wLeft = new THREE.PlaneGeometry( this.size * 2, this.size );
        this.planeMeshLeft = new THREE.Mesh( wLeft, this.planeMaterial );
        this.planeMeshLeft.position.z = 5 * 2;
        this.planeMeshLeft.position.y = 5;
        this.scene.app.scene.add( this.planeMeshLeft );

        let wRight = new THREE.PlaneGeometry( this.size * 2, this.size );
        this.planeMeshRight = new THREE.Mesh( wRight, this.planeMaterial );
        this.planeMeshRight.position.z = -5 * 2;
        this.planeMeshRight.position.y = 5;
        this.scene.app.scene.add( this.planeMeshRight );

        let wTop = new THREE.PlaneGeometry( this.size * 2, this.size );
        this.planeMeshTop = new THREE.Mesh( wTop, this.planeMaterial );
        this.planeMeshTop.rotation.y = Math.PI / 2;
        this.planeMeshTop.position.x = -5 * 2;
        this.planeMeshTop.position.y = 5;
        this.scene.app.scene.add( this.planeMeshTop );


        let wDown = new THREE.PlaneGeometry( this.size * 2, this.size );
        this.planeMeshDown = new THREE.Mesh( wDown, this.planeMaterial );
        this.planeMeshDown.rotation.y = Math.PI / 2;
        this.planeMeshDown.position.x = 5 * 2;
        this.planeMeshDown.position.y = 5;
        this.scene.app.scene.add( this.planeMeshDown );

        this.group.add(this.planeMesh)
        this.group.add(this.planeMeshLeft)
        this.group.add(this.planeMeshRight)
        this.group.add(this.planeMeshTop)
        this.group.add(this.planeMeshDown)


        
    }
    
    /**
     * updates the diffuse plane color and the material
     * @param {THREE.Color} value 
     */
    updateDiffusePlaneColor(value) {
        this.diffusePlaneColor = value
        this.planeMaterial.color.set(this.diffusePlaneColor)
    }
    /**
     * updates the specular plane color and the material
     * @param {THREE.Color} value 
     */
    updateSpecularPlaneColor(value) {
        this.specularPlaneColor = value
        this.planeMaterial.specular.set(this.specularPlaneColor)
    }
    /**
     * updates the plane shininess and the material
     * @param {number} value 
     */
    updatePlaneShininess(value) {
        this.planeShininess = value
        this.planeMaterial.shininess = this.planeShininess
    }

}

export { MyHouse };