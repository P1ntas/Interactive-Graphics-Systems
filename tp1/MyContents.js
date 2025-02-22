import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyHouse } from './MyHouse.js';
import { MyTable } from './MyTable.js';
import { MyPainting } from './MyPainting.js';
import { MyDoor } from './MyDoor.js';
import { MyTarpet } from './MyTarpet.js';
import { MyCar } from './MyCar.js'
import { MyJar } from './MyJar.js'
import { MySpring } from './MySpring.js';
import { MyFlower } from './MyFlower.js';
import { MyChair } from './MyChair.js';
import { MyBookshelf } from './MyBookshelf.js';

/**
 *  This class contains the contents of out application
 */
class MyContents  {

    /**
     * Constructor for the MyContents class.
     * @param {MyApp} app - The application object.
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
     * Builds the box mesh with the assigned material.
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

    /**
     * Builds the 3D house object and initializes it.
     */
    buildHouse() {
        this.house = new MyHouse(10, this);
        this.houseEnabled = true
        this.lastHouseEnabled = null

        this.house.init();
        this.app.scene.add( this.house.group );

    }

    /**
     * Builds the 3D table object and initializes it.
     */
    buildTable() {
        this.table = new MyTable(2,3,3, this);
        this.table.init();
        this.app.scene.add(this.table.group);

    }

    /**
    * Initializes the contents of the scene.
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
        pointLight.castShadow = true;
        pointLight.shadow.mapSize.width = 4096;
        pointLight.shadow.mapSize.height = 4096;
        pointLight.shadow.camera.near = 0.5;
        pointLight.shadow.camera.far = 100;
        pointLight.shadow.camera.top = 15;

        this.app.scene.add( pointLight );

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
        this.app.scene.add( pointLightHelper );

        this.spotColor = 0xfdfa72;
        this.spotLight = new THREE.SpotLight( this.spotColor, 4, 10, Math.PI / 3, 1, 0);
        this.spotLight.position.set(3, 7, 0)
        this.app.scene.add( this.spotLight );
        this.spotLight.target.position.set(0, 6,0)

        this.spotLight.castShadow = true;
        this.spotLight.shadow.mapSize.width = 4096;
        this.spotLight.shadow.mapSize.height = 4096;
        this.spotLight.shadow.camera.near = 0.5;
        this.spotLight.shadow.camera.far = 100;
        this.spotLight.shadow.camera.top = 15;

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

        // Load textures
        let afonsoTexture = new THREE.TextureLoader().load('img/afonso.png');
        let inesTexture = new THREE.TextureLoader().load('img/ines.png');
        let paiTexture = new THREE.TextureLoader().load('img/paisagem.jpg');

        // Create and initialize various objects
        this.paintingWindow = new MyPainting(0, 5, -9.9, this, paiTexture, "window");
        this.painting1 = new MyPainting(-4, 5, 9.9, this, inesTexture, "painting");
        this.painting2 = new MyPainting(4, 5, 9.9, this, afonsoTexture, "painting");
        this.door = new MyDoor(-9.9, 4.3, 5, this);
        this.tarpet =  new MyTarpet(0, 0.1, 0, this);
        this.paintingCar = new MyPainting(-9.8, 7, -2.5, this, paiTexture, "car");
        this.car = new MyCar(this);
        this.jar = new MyJar(-7,0,-7.5,this);
        this.spring = new MySpring(this);
        this.flower = new MyFlower(-7.2,5.5,-7.5,this);
        this.chair = new MyChair(-2,2,2,this);
        this.bookshelf = new MyBookshelf(9, 6, 0, this);

        
        this.paintingWindow.init();
        this.paintingCar.init();
        this.painting1.init();
        this.painting2.init();
        this.door.init();
        this.tarpet.init();
        this.car.init();
        this.jar.init();
        this.spring.init();
        this.flower.init();
        this.chair.init();
        this.bookshelf.init();

        this.car.group.translateY(-0.45);

        // Add objects to the scene
        this.app.scene.add(this.paintingWindow.group);
        this.app.scene.add(this.paintingCar.mesh);
        this.app.scene.add(this.painting1.group);
        this.app.scene.add(this.painting2.group);
        this.app.scene.add(this.car.group);
        this.app.scene.add(this.jar.group);
        this.app.scene.add(this.door.mesh);
        this.app.scene.add(this.tarpet.tarpetMesh);
        this.app.scene.add(this.mesh);
        this.app.scene.add(this.spring.group);
        this.app.scene.add(this.flower.group);
        this.app.scene.add(this.chair.mesh);
        this.app.scene.add(this.bookshelf.group);

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