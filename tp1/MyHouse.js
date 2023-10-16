import * as THREE from 'three';


/**
 *  This class contains the contents of out application
 */
class MyHouse  {

    /**
     * Constructor for the MyHouse class
     * @param {number} size  
     * @param {THREE.Scene} scene - The scene in which the house will be rendered
     */
    constructor(size, scene) {
        this.size = size
        this.scene = scene

        this.group = new THREE.Group()

        // plane related attributes
        this.diffusePlaneColor = "#00ffff"
        this.specularPlaneColor = "#777777"
        this.planeShininess = 40
        this.planeMaterial = new THREE.MeshPhongMaterial({ color: "#F2F2F2", 
            specular: "#FFe9ec", shininess: this.planeShininess })
    }

    /**
     * initializes the contents
     */
    init() {
        // Create a Plane Mesh with a texture
        let plane = new THREE.PlaneGeometry( this.size * 2, this.size * 2 );
        this.floorTexture = new THREE.TextureLoader().load('img/floor.png');
        this.floorMaterial = new THREE.MeshPhongMaterial({map : this.floorTexture, emissive: "#010101"});

        // Create floor plane
        this.planeMesh = new THREE.Mesh( plane, this.floorMaterial );
        this.planeMesh.rotation.x = -Math.PI / 2;
        this.planeMesh.position.y = -0;
        this.planeMesh.receiveShadow = true;
        this.scene.app.scene.add( this.planeMesh );
        
        // Create walls
        let wLeft = new THREE.PlaneGeometry( this.size * 2, this.size );
        this.planeMeshLeft = new THREE.Mesh( wLeft, this.planeMaterial );
        this.planeMeshLeft.position.z = -5 * 2;
        this.planeMeshLeft.position.y = 5;
        this.planeMeshLeft.receiveShadow = true;
        this.scene.app.scene.add( this.planeMeshLeft );

        let wRight = new THREE.PlaneGeometry( this.size * 2, this.size );
        this.planeMeshRight = new THREE.Mesh( wRight, this.planeMaterial );
        this.planeMeshRight.rotation.y = Math.PI;
        this.planeMeshRight.position.z = 5 * 2;
        this.planeMeshRight.position.y = 5;
        this.planeMeshRight.receiveShadow = true;
        this.scene.app.scene.add( this.planeMeshRight );

        let wTop = new THREE.PlaneGeometry( this.size * 2, this.size );
        this.planeMeshTop = new THREE.Mesh( wTop, this.planeMaterial );
        this.planeMeshTop.rotation.y = -Math.PI / 2;
        this.planeMeshTop.position.x = 5 * 2;
        this.planeMeshTop.position.y = 5;
        this.planeMeshTop.receiveShadow = true;
        this.scene.app.scene.add( this.planeMeshTop );

        let wDown = new THREE.PlaneGeometry( this.size * 2, this.size );
        this.planeMeshDown = new THREE.Mesh( wDown, this.planeMaterial );
        this.planeMeshDown.rotation.y = Math.PI / 2;
        this.planeMeshDown.position.x = -5 * 2;
        this.planeMeshDown.position.y = 5;
        this.planeMeshDown.receiveShadow = true;
        this.scene.app.scene.add(this.planeMeshDown);

        // Add planes to the group
        this.group.add(this.planeMesh)
        this.group.add(this.planeMeshLeft)
        this.group.add(this.planeMeshRight)
        this.group.add(this.planeMeshTop)
        this.group.add(this.planeMeshDown)
        
    }
    
    /**
     * Updates the diffuse plane color and material.
     * @param {THREE.Color} value - The new color value.
     */
    updateDiffusePlaneColor(value) {
        this.diffusePlaneColor = value
        this.planeMaterial.color.set(this.diffusePlaneColor)
    }

    /**
     * Updates the specular plane color and material.
     * @param {THREE.Color} value - The new color value.
     */
    updateSpecularPlaneColor(value) {
        this.specularPlaneColor = value
        this.planeMaterial.specular.set(this.specularPlaneColor)
    }
    
    /**
     * Updates the plane shininess and material.
     * @param {number} value - The new shininess value.
     */
    updatePlaneShininess(value) {
        this.planeShininess = value
        this.planeMaterial.shininess = this.planeShininess
    }

}

export { MyHouse };