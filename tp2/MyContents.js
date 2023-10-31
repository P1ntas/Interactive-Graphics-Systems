import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
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

        this.reader = new MyFileReader(app, this, this.onSceneLoaded);
		this.reader.open("scenes/demo/demo.xml");		
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
    }

    /**
     * Called when the scene xml file load is complete
     * @param {MySceneData} data the entire scene data object
     */
    onSceneLoaded(data) {
        console.info("scene data loaded " + data + ". visit MySceneData javascript class to check contents for each data item.")
        this.onAfterSceneLoadedAndBeforeRender(data);
    }

    output(obj, indent = 0) {
        console.log("" + new Array(indent * 4).join(' ') + " - " + obj.type + " " + (obj.id !== undefined ? "'" + obj.id + "'" : ""))
    }

    onAfterSceneLoadedAndBeforeRender(data) {
       
        // refer to descriptors in class MySceneData.js
        // to see the data structure for each item

        this.output(data.options)
        console.log("textures:")
        for (var key in data.textures) {
            let texture = data.textures[key]
            this.output(texture, 1)
        }

        console.log("materials:")
        for (var key in data.materials) {
            let material = data.materials[key]
            this.output(material, 1)
        }

        console.log("cameras:")
        for (var key in data.cameras) {
            let camera = data.cameras[key]
            this.output(camera, 1)
        }

        console.log("nodes:")
        for (var key in data.nodes) {
            let node = data.nodes[key]
            this.output(node, 1)
            for (let i=0; i< node.children.length; i++) {
                let child = node.children[i]
                if (child.type === "primitive") {
                    console.log("" + new Array(2 * 4).join(' ') + " - " + child.type + " with "  + child.representations.length + " " + child.subtype + " representation(s)")
                    if (child.subtype === "nurbs") {
                        console.log("" + new Array(3 * 4).join(' ') + " - " + child.representations[0].controlpoints.length + " control points")
                    }
                }
                else {
                    this.output(child, 2)
                }
            }
        }

    this.setupMaterials(data);

    this.setupCameras(data);
    }

    setupMaterials(data) {

        let textures = {};

        let materials = [];

        for (var key in data.textures) {

            let texture = new THREE.TextureLoader().load(data.textures[key].filepath);

            textures[key.id] = texture;
        }

        for (var key in data.materials) {

            let material = new THREE.MeshPhongMaterial({ color: key.color, emissive: key.emissive, 
                                        specular: key.specular, shininess: key.shininess, 
                                        map: textures[key.textureref] });
            
            // textlength_s and textlength_t
            // twosided, wireframe and shading sometimes
            
        }
        
    }

    setupCameras(data) {

        let cameras = [];
 
        for (var key in data.cameras) {
            let cameraData = data.cameras[key];
            //console.log(cameraData)

            let camera;

            switch (cameraData.type) {
                case "perspective":
                    camera = new THREE.PerspectiveCamera(cameraData.fov, cameraData.aspect, cameraData.near, cameraData.far);

                    if(cameraData.position) {
                        camera.position.set(cameraData.position.x, cameraData.position.y, cameraData.position.z);
                    }
        
                    if(cameraData.target) {
                        camera.lookAt(new THREE.Vector3(cameraData.target.x, cameraData.target.y, cameraData.target.z));
                    }
                    cameras.push(camera);
                    break;

                case "orthogonal":
                    camera = new THREE.OrthographicCamera(cameraData.left, cameraData.right, cameraData.top, cameraData.bottom, cameraData.near, cameraData.far);

                    if(cameraData.position) {
                        camera.position.set(cameraData.position.x, cameraData.position.y, cameraData.position.z);
                    }
        
                    if(cameraData.target) {
                        camera.lookAt(new THREE.Vector3(cameraData.target.x, cameraData.target.y, cameraData.target.z));
                    }
                    cameras.push(camera);
                    break;

                default:
                    break;
            }
        }
    }

    update() {
        
    }
}

export { MyContents };