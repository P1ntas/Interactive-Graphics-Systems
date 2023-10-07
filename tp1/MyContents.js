import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyHouse } from './MyHouse.js';
import { MyTable } from './MyTable.js';
import { MyPainting } from './MyPainting.js';
import { MyDoor } from './MyDoor.js';
import { MyTarpet } from './MyTarpet.js';
import { MyCar } from './MyCar.js'
import { MySpring } from './MySpring.js';

/**
 *  This class contains the contents of out application
 */
class MyContents  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
        this.app = app
        this.axis = null

        this.house = null

        // box related attributes
        this.boxMesh = null
        this.boxMeshSize = 1.0
        this.boxEnabled = false
        this.lastBoxEnabled = null
        this.boxDisplacement = new THREE.Vector3(0,2,0)
    }

    /**
     * builds the box mesh with material assigned
     */
    buildBox() {    
        let boxMaterial = new THREE.MeshPhongMaterial({ color: "#ffff77", 
        specular: "#000000", shininess: 90 })

        // Create a Cube Mesh with basic material
        let box = new THREE.BoxGeometry(  this.boxMeshSize,  this.boxMeshSize,  this.boxMeshSize );
        this.boxMesh = new THREE.Mesh( box, boxMaterial );
        this.boxMesh.rotation.x = -Math.PI / 2;
        this.boxMesh.position.y = this.boxDisplacement.y;
    }

    buildHouse() {
        this.house = new MyHouse(10, this);
        this.houseEnabled = true
        this.lastHouseEnabled = null

        this.house.init();
        this.app.scene.add( this.house.group );

    }

    buildTable() {
        this.table = new MyTable(2,3,3, this);
        this.table.init();
        this.app.scene.add(this.table.group);

    }

    /**
     * initializes the contents
     */



    
    init() {
       
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }

        // add a point light on top of the model
        const pointLight = new THREE.PointLight( 0xd3d3d3, 500, 30 );
        pointLight.position.set( 0, 20, 0 );
        this.app.scene.add( pointLight );

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
        this.app.scene.add( pointLightHelper );

        this.spotColor = 0xfdfa72;
        this.spotLight = new THREE.SpotLight( this.spotColor, 5, 6, Math.PI / 3, 1, 0);
        this.spotLight.position.set(0, 10, 0)
        this.app.scene.add( this.spotLight );
        this.spotLight.target.position.set(0, 6.66, 1)
        this.app.scene.add(this.spotLight.target)

        // add a point light helper for the previous point light
        const spotLightHelper = new THREE.SpotLightHelper( this.spotLight);
        this.app.scene.add( spotLightHelper )


        // add an ambient light
        const ambientLight = new THREE.AmbientLight( 0x555555 );
        this.app.scene.add( ambientLight );

        this.buildBox()
        
        this.buildHouse();
        this.buildTable();

        let paiTexture = new THREE.TextureLoader().load('img/paisagem.jpg');

        this.painting = new MyPainting(0, 5, -9.9, this, paiTexture);
        this.door = new MyDoor(-9.9, 4.3, 5, this);
        this.tarpet =  new MyTarpet(0, 0.1, 0, this);
        this.paintingCar = new MyPainting(-9.8, 7, -2.5, this, paiTexture, "car");
        this.car = new MyCar(this);
        this.spring = new MySpring(this);

        

        this.painting.init();
        this.paintingCar.init();
        this.door.init();
        this.tarpet.init();
        this.car.init()
        this.spring.init();

        this.car.group.translateY(-0.45)

        this.app.scene.add(this.painting.group);
        this.app.scene.add(this.paintingCar.mesh);
        this.app.scene.add(this.car.group);
        this.app.scene.add(this.door.mesh);
        this.app.scene.add(this.tarpet.tarpetMesh);
        this.app.scene.add(this.mesh)
        this.app.scene.add(this.spring.group)


    }
    
    
    /**
     * rebuilds the box mesh if required
     * this method is called from the gui interface
     */
    rebuildBox() {
        // remove boxMesh if exists
        if (this.boxMesh !== undefined && this.boxMesh !== null) {  
            this.app.scene.remove(this.boxMesh)
        }
        this.buildBox();
        this.lastBoxEnabled = null
    }
    
    /**
     * updates the box mesh if required
     * this method is called from the render method of the app
     * updates are trigered by boxEnabled property changes
     */
    updateBoxIfRequired() {
        if (this.boxEnabled !== this.lastBoxEnabled) {
            this.lastBoxEnabled = this.boxEnabled
            if (this.boxEnabled) {
                this.app.scene.add(this.boxMesh)
            }
            else {
                this.app.scene.remove(this.boxMesh)
            }
        }
    }

    updateHouseIfRequired() {
        if (this.houseEnabled !== this.lastHouseEnabled) {
            this.lastHouseEnabled = this.houseEnabled
            if (this.houseEnabled) {
                this.app.scene.add(this.house.group)
            }
            else {
                this.app.scene.remove(this.house.group)
            }
        }
    }

    /**
     * updates the contents
     * this method is called from the render method of the app
     * 
     */
    update() {
        // check if box mesh needs to be updated
        this.updateBoxIfRequired()

        this.updateHouseIfRequired()

        // sets the box mesh position based on the displacement vector
        this.boxMesh.position.x = this.boxDisplacement.x
        this.boxMesh.position.y = this.boxDisplacement.y
        this.boxMesh.position.z = this.boxDisplacement.z
        
    }

}

export { MyContents };