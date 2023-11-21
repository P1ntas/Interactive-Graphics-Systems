import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';
import { MyPolygon } from './MyPolygon.js'
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

        this.materials = {};
        this.lights = [];

        this.reader = new MyFileReader(app, this, this.onSceneLoaded);
		this.reader.open("scenes/scene.xml");	
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

        /*this.output(data.options)

        // first and only skybox is called "default"
        this.output(data.skyboxes["default"])
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
            if (node.loaded === false) {
                console.error("" + new Array(2 * 4).join(' ') + " not loaded. Possibly refered as a node child but not defined in scene.")
            }
            for (let i=0; i< node.children.length; i++) {
                let child = node.children[i]
                if (child.type === "primitive") {
                    console.log("" + new Array(2 * 4).join(' ') + " - " + child.type + " with "  + child.representations.length + " " + child.subtype + " representation(s)")
                    if (child.subtype === "nurbs") {
                        console.log("" + new Array(3 * 4).join(' ') + " - " + child.representations[0].controlpoints.length + " control points")
                    }
                }
                else
                if (child.type === "lodref") {
                    console.log("" + new Array(2 * 4).join(' ') + " - " + child.type + ", id "  + child.id)                    
                }
                else {
                    this.output(child, 2)
                }
            }
        }

        console.log("lods:")
        for (var key in data.lods) {
            let lod = data.lods[key]
            this.output(lod, 1)
            if (lod.loaded === false) {
                console.error("" + new Array(2 * 4).join(' ') + " not loaded. Possibly refered as a node child but not defined in scene.")
            }
            for (let i=0; i< lod.children.length; i++) {
                let child = lod.children[i]
                console.log("" + new Array(2 * 4).join(' ') + " - " + child.type + " "  + child.node.id + ", min distance: " + child.mindist)
            }
        }*/

        //console.log(data.lods)

        this.setupMaterials(data);

        this.setupCameras(data);
        //console.log(data.nodes)
        for (var node in data.nodes) {
            if (data.nodes[node].id === "scene") {
                this.traverseNode(data, node, 1);
            }
        }
    }

    traverseNode(data, nodeId, depth=0, materialId = null) {
        let findLod = false;
        let node = data.nodes[nodeId];

        console.log(node);
        
        if (!node) return;
        //console.log(node)
        let group = new THREE.Group();
        //console.log(node.materialIds)
        if (node.materialIds && node.materialIds.length > 0) {
            materialId = node.materialIds[0];
        }
        if (node.castShadows !== undefined) {
            //castShadows = node.castShadows
        }
        if (node.receiveShadows !== undefined) {
            //receiveShadows = node.receiveShadows
        }

        if (materialId) {
            const material = this.materials[materialId];
            if (material) {
                group.material = material;
            }
        }
    
        if (node.transformations) {
            //console.log(node.transformations[0])
            if (node.transformations.length > 0) {
                
                if (node.transformations.length === 1) {
                    //console.log(node.transformations[0])
                    if (node.transformations[0].type === 'T') {
                        group.translateX(node.transformations[0].translate[0]);
                        group.translateY(node.transformations[0].translate[1]);
                        group.translateZ(node.transformations[0].translate[2]);
                    }
                    else if (node.transformations[0].type === 'R') {
                        group.rotateX(node.transformations[0].rotation[0] * Math.PI / 180);
                        group.rotateY(node.transformations[0].rotation[1] * Math.PI / 180);
                        group.rotateZ(node.transformations[0].rotation[2] * Math.PI / 180);
                    }
                    else if (node.transformations[0].type === 'S') {
                
                        group.scale.set(node.transformations[0].scale[0], node.transformations[0].scale[1], node.transformations[0].scale[2]);
                    }
                }
                else if (node.transformations.length > 1) {
                    for (let k = 0; k < node.transformations.length; k++) {
                        if (node.transformations[k].type === 'T') {
                            group.translateX(node.transformations[k].translate[0]);
                            group.translateY(node.transformations[k].translate[1]);
                            group.translateZ(node.transformations[k].translate[2]);
                        }
                        else if (node.transformations[k].type === 'R') {
                            group.rotateX(node.transformations[k].rotation[0] * Math.PI / 180);
                            group.rotateY(node.transformations[k].rotation[1] * Math.PI / 180);
                            group.rotateZ(node.transformations[k].rotation[2] * Math.PI / 180);
                        }
                        else if (node.transformations[k].type === 'S') {
                            group.scale.set(node.transformations[k].scale[0], node.transformations[k].scale[1], node.transformations[k].scale[2]);
                        }
                    }
                }
            }
        }
        
        for (let i = 0; i < node.children.length; i++) {
            let child = node.children[i];
            //console.log(child.type)

            let pri, mesh;
            //if (child.id === 'leg') console.log(child.type)
            switch (child.type) {
                case "node":
                    if (!child.materialIds) {
                        child.materialIds = []
                        child.materialIds.push(node.materialIds[0])
                    }
                    const childGroup = this.traverseNode(data, child.id, depth + 1, materialId);
                    if (childGroup) group.add(childGroup);
                    
                    break;

                case "primitive":
                    //console.log(child)
                    switch (child.subtype) {
                        case "rectangle":
                            
                            pri = new THREE.PlaneGeometry(child.representations[0].xy2[0] - child.representations[0].xy1[0],
                                child.representations[0].xy2[1] - child.representations[0].xy1[1], child.representations.parts_x, child.representations.parts_x)


                                    //console.log(this.materials[node.materialIds[0]])
                                    
                                    mesh = new THREE.Mesh(pri, this.materials[materialId]);
                                    mesh.position.x += (child.representations[0].xy2[0] + child.representations[0].xy1[0]) / 2;
                                    mesh.position.y += (child.representations[0].xy2[1] + child.representations[0].xy1[1]) / 2;
                                    //mesh.castShadow = castShadows
                                    //mesh.receiveShadow = receiveShadows
                                    //console.log(node)
                                    if (node.loaded) group.add(mesh);
                                    
                                
                        
                            break;

                        case "polygon":
                            //console.log(child)
                            pri = new MyPolygon(child.representations[0].radius, child.representations[0].slices, child.representations[0].stacks)
                            let color6 = new THREE.MeshPhongMaterial({
                                vertexColors: true,
                              });
                            
                            const vertexCount = pri.getAttribute('position').count;
                            const colors = [];

                            for (let i = 0; i < vertexCount; i++) {
                                // Calculate the interpolation factor (between 0 and 1)
                                const t = i / (vertexCount - 1);

                                // Interpolate between the two colors
                                const r = child.representations[0].color_c.r + t * (child.representations[0].color_p.r - child.representations[0].color_c.r);
                                const g = child.representations[0].color_c.g + t * (child.representations[0].color_p.g - child.representations[0].color_c.g);
                                const b = child.representations[0].color_c.b + t * (child.representations[0].color_p.b - child.representations[0].color_c.b);

                                // Add the color to the array
                                colors.push(r, g, b);
                            }

                            pri.setAttribute(
                                'color',
                                new THREE.BufferAttribute(new Float32Array(colors), 3)
                              );

                            mesh = new THREE.Mesh(pri, color6);
                            mesh.castShadow = node.castShadows
                            mesh.receiveShadow = node.receiveShadows
                            if (node.loaded) group.add(mesh);
                            break

                        case "triangle":
                        
                        pri = new THREE.PlaneGeometry(child.representations[0].xyz1, child.representations[0].xyz2,
                                                    child.representations[0].xyz3)


                                //console.log(this.materials[node.materialIds[0]])
                                
                                mesh = new THREE.Mesh(pri, this.materials[materialId]);
                                
                                mesh.position.x += (child.representations[0].xyz2[0] + child.representations[0].xyz1[0] 
                                    + child.representations[0].xyz3[0]) / 3;
                                mesh.position.y += (child.representations[0].xyz2[1] + child.representations[0].xyz1[1] 
                                    + child.representations[0].xyz3[1]) / 3;
                                mesh.position.z += (child.representations[0].xyz2[2] + child.representations[0].xyz1[2] 
                                    + child.representations[0].xyz3[2]) / 3;
                                mesh.castShadow = node.castShadows
                                mesh.receiveShadow = node.receiveShadows
                                    if (node.loaded) group.add(mesh);
                                
                            
                    
                        break;

                        case "cylinder":
                            pri = new THREE.CylinderGeometry(child.representations[0].top, 
                                child.representations[0].base, child.representations[0].height,
                                child.representations[0].slices, child.representations[0].stacks,child.representations[0].capsclose,
                                child.representations[0].thetastart, child.representations[0].thetalength)
                              
                                    //console.log(this.materials[node.materialIds[0]])
                                    
                                    mesh = new THREE.Mesh(pri, this.materials[materialId]);
                                    mesh.castShadow = node.castShadows
                                    mesh.receiveShadow = node.receiveShadows
                                    if (node.loaded) group.add(mesh);
                                
                                
                            break;
                        
                        case "box":
                            //console.log(child)
                            pri = new THREE.BoxGeometry(child.representations[0].xyz2[0] - child.representations[0].xyz1[0],
                                child.representations[0].xyz2[1] - child.representations[0].xyz1[1],
                                child.representations[0].xyz2[2] - child.representations[0].xyz1[2],
                                child.representations[0].parts_x, child.representations[0].parts_y, child.representations[0].parts_z)
                               
                                    //console.log(this.materials[node.materialIds[0]])
                                    
                                    mesh = new THREE.Mesh(pri, this.materials[materialId]);
                                    mesh.position.x += (child.representations[0].xyz2[0] + child.representations[0].xyz1[0]) / 2;
                                    mesh.position.y += (child.representations[0].xyz2[1] + child.representations[0].xyz1[1]) / 2;
                                    mesh.position.z += (child.representations[0].xyz2[2] + child.representations[0].xyz1[2]) / 2;

                                    mesh.castShadow = node.castShadows
                                    mesh.receiveShadow = node.receiveShadows
                                    if (node.loaded) group.add(mesh);
                                
                            
                            break;
                        
                        case "sphere":
                            pri = new THREE.SphereGeometry(child.representations[0].radius, 
                                child.representations[0].slices, child.representations[0].stacks,child.representations[0].phistart * Math.PI / 180,
                                child.representations[0].philength * Math.PI / 180,
                                child.representations[0].thetastart * Math.PI / 180, child.representations[0].thetalength * Math.PI / 180)

                                    //console.log(this.materials[node.materialIds[0]])
                                    
                                    mesh = new THREE.Mesh(pri, this.materials[materialId]);

                                    mesh.castShadow = node.castShadows
                                    mesh.receiveShadow = node.receiveShadows
                                    if (node.loaded) group.add(mesh);
                            break;
        
                        case "nurbs":
                            pri = new MyNurbsBuilder(this.app);
                            let controlPoints = []
                            for (let i = 0; i < child.representations[0].controlpoints.length; i++) {
                                let points = [child.representations[0].controlpoints[i].xx, 
                                            child.representations[0].controlpoints[i].yy,
                                            child.representations[0].controlpoints[i].zz, 1]
                                controlPoints.push(points)

                            }
                            //console.log(controlPoints)
                            //console.log(child.representations[0].controlpoints)
                            pri.build(controlPoints, 
                                child.representations[0].degree_u, child.representations[0].degree_v, 
                                child.representations[0].parts_u, child.representations[0].parts_v)

                                if (node.materialIds.length > 0) {
                                    //console.log(this.materials[node.materialIds[0]])
                                    
                                    mesh = new THREE.Mesh(pri, this.materials[materialId]);
                                    mesh.castShadow = node.castShadows
                                    mesh.receiveShadow = node.receiveShadows
                                    if (node.loaded) group.add(mesh);
                                } 
                                
                                break;
                        default: 
                            break;
                    }
                    break;

                case "pointlight":
                    const pointLight = new THREE.PointLight(child.color, child.intensity, child.distance, 
                        child.decay);
                    pointLight.position.set(child.position[0], child.position[1], child.position[2]);
                    pointLight.castShadow = child.castshadow;
                    pointLight.shadow.mapSize.width = child.shadowmapsize;
                    pointLight.shadow.mapSize.height = child.shadowmapsize;
                    pointLight.shadow.camera.far = child.shadowfar;
                    if (child.enabled) this.app.scene.add(pointLight);
                    this.lights.push(pointLight);
                    break;

                case "spotlight":
                    const spotLight = new THREE.SpotLight(child.color, child.intensity, child.distance, 
                        child.angle * Math.PI / 180, child.penumbra, child.decay);
                    spotLight.position.set(child.position[0], child.position[1], child.position[2]);
                    spotLight.castShadow = child.castshadow;
                    spotLight.shadow.mapSize.width = child.shadowmapsize;
                    spotLight.shadow.mapSize.height = child.shadowmapsize;
                    spotLight.shadow.camera.far = child.shadowfar;

                    if (child.enabled) {
                        this.app.scene.add(spotLight);
                        spotLight.target.position.set(0,0,0);
                        this.app.scene.add(spotLight.target);
                    }
                    this.lights.push(spotLight);
                    break;

                case "directionallight": 
                    //console.log(child)
                    const directionalLight = new THREE.DirectionalLight( child.color, child.intensity);
                    directionalLight.position.set(child.position[0], child.position[1], child.position[2]);
                    directionalLight.castShadow = child.castshadow;
                    directionalLight.shadow.mapSize.width = child.shadowmapsize;
                    directionalLight.shadow.mapSize.height = child.shadowmapsize;
                    directionalLight.shadow.camera.left = child.shadowleft;
                    directionalLight.shadow.camera.far = child.shadowfar;
                    directionalLight.shadow.camera.top = child.shadowtop;
                    directionalLight.shadow.camera.bottom = child.shadowbottom;
                    directionalLight.shadow.camera.right = child.shadowright;

                    if (child.enabled) this.app.scene.add(directionalLight);
                    this.lights.push(directionalLight);
                    break;
                
                case "lod": 
                    let lod = new THREE.LOD();
                    findLod = true;
                    console.log(child.children);
                    child.children?.forEach(nodeChildren => {
                        let childLodGroup = new THREE.Group();

                        nodeChildren.node.children.forEach( i => {
                            console.log(nodeChildren.node);
                            const childMesh = this.traverseNode(data, nodeChildren.node.id, depth + 1, materialId);
                            console.log(childMesh);
                            childLodGroup.add(childMesh);
                        })
                        console.log(childLodGroup, nodeChildren.mindist);
                        lod.addLevel(childLodGroup, nodeChildren.mindist);
                    })
                    
                    group.add(lod);
                    break;   
                
                default:
                    break;
                }
            }                 
        if (depth === 1){
            console.log(group);
            this.app.scene.add(group);
        }
        return group;
    }


    setupMaterials(data) {
        this.app.scene.background = data.options.background;
        const light1 = new THREE.AmbientLight( data.options.ambient );
        this.app.scene.add( light1 );
        this.app.scene.fog = new THREE.Fog(data.fog.color, data.fog.near, data.fog.far);

        let skybox = new THREE.BoxGeometry(
            data.skyboxes["default"].size[0],
            data.skyboxes["default"].size[1], 
            data.skyboxes["default"].size[2]
        )
        
        
        console.log(data.skyboxes["default"]);

        let skyMaterial = [
            new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load(data.skyboxes["default"].front), side: THREE.BackSide}),
            new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load(data.skyboxes["default"].back), side: THREE.BackSide}),
            new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load(data.skyboxes["default"].up), side: THREE.BackSide}),
            new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load(data.skyboxes["default"].down), side: THREE.BackSide}),
            new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load(data.skyboxes["default"].right), side: THREE.BackSide}),
            new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load(data.skyboxes["default"].left), side: THREE.BackSide}),
        ];

        console.log(skyMaterial);
        let skyMesh = new THREE.Mesh(skybox, skyMaterial);

        this.app.scene.add(skyMesh);

        let textures = {};

        for (var key in data.textures) {

            let texture = new THREE.TextureLoader().load(data.textures[key].filepath);
            texture.wrapS = THREE.ClampToEdgeWrapping
            texture.wrapT = THREE.ClampToEdgeWrapping
    

            textures[key] = texture;
            //console.log(key);
        }
        for (var key in data.materials) {
            //console.log(data.materials[key]);
            let material = new THREE.MeshPhongMaterial({ color: data.materials[key].color, 
                                        emissive: data.materials[key].emissive, 
                                        specular: data.materials[key].specular, 
                                        shininess: data.materials[key].shininess,
                                        map: textures[data.materials[key].textureref] });

            if (material.map) material.map.repeat.set(data.materials[key].texlength_s || 1, data.materials[key].texlength_t || 1);

            if (data.materials[key].twosided) material.side = THREE.DoubleSide;
            if (data.materials[key].wireframe) material.wireframe = data.materials[key].wireframe;
            if (data.materials[key].shading === "flat") material.flatShading = true;
            this.materials[data.materials[key].id] = material;
        }
        
    }

    setupCameras(data) {
 
        for (var key in data.cameras) {
            let cameraData = data.cameras[key];
            //console.log(cameraData)

            let camera;

            switch (cameraData.type) {
                case "perspective":
                    camera = new THREE.PerspectiveCamera(cameraData.angle, window.innerWidth / window.innerHeight, cameraData.near, cameraData.far);

                    if(cameraData.location.length > 0) {
                        camera.position.set(cameraData.location[0], cameraData.location[1], cameraData.location[2]);
                    }
        
                    if(cameraData.target) {
                        camera.lookAt(new THREE.Vector3(cameraData.target[0], cameraData.target[1], cameraData.target[2]));
                    }
                    this.app.cameras['XML Perspective'] = camera;
                    break;

                case "orthogonal":
                    camera = new THREE.OrthographicCamera(cameraData.left, cameraData.right, cameraData.top, cameraData.bottom, cameraData.near, cameraData.far);

                    if(cameraData.location.length > 0) {
                        camera.position.set(cameraData.location[0], cameraData.location[1], cameraData.location[2]);
                    }
        
                    if(cameraData.target) {
                        camera.lookAt(new THREE.Vector3(cameraData.target[0], cameraData.target[1], cameraData.target[2]));
                    }
                    this.app.cameras['XML Orthogonal'] = camera;
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