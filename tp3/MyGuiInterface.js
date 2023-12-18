import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';
import * as THREE from 'three';

/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface  {

    /**
     * 
     * @param {MyApp} app The application object 
     */
    constructor(app) {
        this.app = app
        this.datgui =  new GUI();
        this.contents = null
    }

    /**
     * Set the contents object
     * @param {MyContents} contents the contents objects 
     */
    setContents(contents) {
        this.contents = contents
    }

    /**
     * Initialize the gui interface
     */
    init() {
        // adds a folder to the gui interface for the camera
        const cameraFolder = this.datgui.addFolder('Camera')
        cameraFolder.add(this.app, 'activeCameraName', [ 'Perspective', 'Left', 'Top', 'Front', 'XML Perspective', 'Car'] ).name("active camera");
        cameraFolder.open()

        this.contents.lights.forEach((light, index) => {
            let isPointLight = light instanceof THREE.PointLight;
            let isDirectionalLight = light instanceof THREE.DirectionalLight;
            let isSpotLight = light instanceof THREE.SpotLight;

            let lightFolder;

            if (isPointLight) lightFolder = this.datgui.addFolder(`Point Light ${index + 1}`);
            if (isDirectionalLight) lightFolder = this.datgui.addFolder(`Directional Light ${index + 1}`);
            if (isSpotLight) lightFolder = this.datgui.addFolder(`Spot Light ${index + 1}`);

            //console.log(this.app.scene.children.includes(light))

            const isLightInScene = this.app.scene.children.includes(light);

            // Object to hold the state of the light
            const lightState = {
                inScene: isLightInScene
            };
            
            lightFolder.add(lightState, 'inScene').name('On').onChange((value) => {
                if (value) {
                    this.app.scene.add(light); // Add the light to the scene
                } else {
                    this.app.scene.remove(light); // Remove the light from the scene
                }
            });
        
            // Add controls for light properties
            //lightFolder.add(light, 'enabled');
            lightFolder.addColor(light, 'color');
            lightFolder.add(light, 'intensity', 0, 1000);
            lightFolder.add(light, 'castShadow');           

        
            // Depending on the light type, you might want to add other controls
            // For example, for a PointLight, you might want to control distance and decay:
            if (light instanceof THREE.PointLight || light instanceof THREE.SpotLight) {
                lightFolder.add(light, 'distance', 0, 1000);
                lightFolder.add(light, 'decay', 0, 10);
            }

            if (light instanceof THREE.SpotLight) {
                lightFolder.add(light, 'angle', 0, Math.PI * 2, Math.PI / 10);
                lightFolder.add(light, 'penumbra', 0, 1);
            }
        
            lightFolder.open(); // Open the folder by default
        });

    }

}

export { MyGuiInterface };