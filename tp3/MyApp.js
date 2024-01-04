
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MyContents } from './MyContents.js';
import { MyGuiInterface } from './MyGuiInterface.js';
import Stats from 'three/addons/libs/stats.module.js'

/**
 * This class contains the application object
 */
class MyApp  {
    /**
     * the constructor
     */
    constructor() {
        this.scene = null
        this.stats = null

        // camera related attributes
        this.activeCamera = null
        this.activeCameraName = null
        this.lastCameraName = null
        this.cameras = []
        this.frustumSize = 20

        // other attributes
        this.renderer = null
        this.controls = null
        this.gui = null
        this.axis = null
        this.contents == null
    }
    /**
     * initializes the application
     */
    init() {
        // Create an empty scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x101010 );

        this.stats = new Stats()
        this.stats.showPanel(1) // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom)

        // Create a renderer with Antialiasing
        this.renderer = new THREE.WebGLRenderer({antialias:true});
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setClearColor("#000000");

        // Configure renderer size
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Append Renderer to DOM
        document.getElementById("canvas").appendChild( this.renderer.domElement );

        // manage window resizes
        window.addEventListener('resize', this.onResize.bind(this), false );
    }

    /**
     * sets the active camera by name
     * @param {String} cameraName 
     */
    setActiveCamera(cameraName) {   
        this.activeCameraName = cameraName
        this.activeCamera = this.cameras[this.activeCameraName]
    }

    
    getActiveCamera() {
        return this.cameras[this.activeCameraName]
    }

    /**
     * updates the active camera if required
     * this function is called in the render loop
     * when the active camera name changes
     * it updates the active camera and the controls
     */
    updateCameraIfRequired() {
        if (this.contents.stateMachine.currentState.name !== this.activeCameraName) {
            this.activeCameraName = this.contents.stateMachine.currentState.name;
        }

        // camera changed?
        if (this.lastCameraName !== this.activeCameraName) {
            this.lastCameraName = this.activeCameraName;
            this.activeCamera = this.cameras[this.activeCameraName]
            document.getElementById("camera").innerHTML = this.activeCameraName
           
            // call on resize to update the camera aspect ratio
            // among other things
            this.onResize()

            // are the controls yet?
            if (this.controls === null) {
                // Orbit controls allow the camera to orbit around a target.
                this.controls = new OrbitControls( this.activeCamera, this.renderer.domElement );
                this.controls.enableZoom = true;
                this.controls.update();
            }
            else {
                this.controls.object = this.activeCamera
            }

            this.controls.target.copy(this.activeCamera.target.position);
        }   

        
    }

    init_cameras(cameras) {
        const aspectRatio = window.innerWidth / window.innerHeight;

        for (let cameraID in cameras) {
            let cameraInfo = cameras[cameraID];

            switch(cameraInfo.type) {
                case "perspective":
                    const perspectiveCamera = new THREE.PerspectiveCamera(cameraInfo.angle, aspectRatio, cameraInfo.near, cameraInfo.far);
                    perspectiveCamera.position.set(cameraInfo.location[0], cameraInfo.location[1], cameraInfo.location[2]);
                    perspectiveCamera.initialPosition = perspectiveCamera.position.clone()
                    const targetObject = new THREE.Object3D()
                    this.scene.add(targetObject)
                    perspectiveCamera.target = targetObject
                    perspectiveCamera.target.position.set(cameraInfo.target[0], cameraInfo.target[1], cameraInfo.target[2])
                    perspectiveCamera.name = cameraID;
                    this.cameras[cameraID] = perspectiveCamera;
                    break;
                case "orthogonal":
                    const orthogonalCamera = new THREE.OrthographicCamera(cameraInfo.left, cameraInfo.right, cameraInfo.top, cameraInfo.bottom, cameraInfo.near, cameraInfo.far);
                    orthogonalCamera.position.set(cameraInfo.location[0], cameraInfo.location[1], cameraInfo.location[2]);
                    orthogonalCamera.lookAt(cameraInfo.target[0], cameraInfo.target[1], cameraInfo.target[2]);
                    orthogonalCamera.up = new THREE.Vector3(0,0,1);
                    this.cameras[cameraID] = orthogonalCamera;
                    break;
                default:
                    console.log("Camera type not recognized");
            }
        }

        this.setActiveCamera('MainMenuCam');
    }

    /**
     * the window resize handler
     */
    onResize() {
        if (this.activeCamera !== undefined && this.activeCamera !== null) {
            this.activeCamera.aspect = window.innerWidth / window.innerHeight;
            this.activeCamera.updateProjectionMatrix();
            this.renderer.setSize( window.innerWidth, window.innerHeight );
        }
    }
    /**
     * 
     * @param {MyContents} contents the contents object 
     */
    setContents(contents) {
        this.contents = contents;
    }

    /**
     * @param {MyGuiInterface} contents the gui interface object
     */
    setGui(gui) {   
        this.gui = gui
    }

    /**
    * the main render function. Called in a requestAnimationFrame loop
    */ 
    render () {
        this.stats.begin()
        this.updateCameraIfRequired()

        // update the animation if contents were provided
        if (this.activeCamera !== undefined && this.activeCamera !== null) {
            this.contents.update()
        }

        if (this.contents.stateMachine.currentState === this.contents.stateMachine.states['game']) {
            requestAnimationFrame(() => this.contents.car.updateCamera());
        }

        // required if controls.enableDamping or controls.autoRotate are set to true
        this.controls.update();

        // render the scene
        this.renderer.render(this.scene, this.activeCamera);

        // subsequent async calls to the render loop
        requestAnimationFrame( this.render.bind(this) );

        this.lastCameraName = this.activeCameraName
        this.stats.end()
    }
}


export { MyApp };