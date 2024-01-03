import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';
import { MyPolygon } from './MyPolygon.js'
import { MyTrack } from './MyTrack.js';
import { MyCar } from './MyCar.js';
import { MyTrafficCone } from './MyTrafficCone.js';
import { MyRoadSign } from './MyRoadSign.js';
import { MyShroom } from './MyShroom.js';
import { MyBillboard } from './MyBillboard.js';
import { MyFinishLine } from './MyFinishLine.js';
import { MyRival } from './MyRival.js';
import { MyTimer } from './MyTimer.js';
import { MyClock } from './MyClock.js';
import { MyGarage } from './MyGarage.js';
import { MyHouse } from './MyHouse.js';
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

        this.shrooms = []
        this.signs = []
        this.cones = []
        this.clocks = []

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

        this.timer = new MyTimer(this);
        this.timer.start();

        this.timerElement = document.getElementById('timerDisplay');

        this.lapElement = document.getElementById('lapDisplay');

        this.display = new MyBillboard(35, 3, -30, this.timer, this);
        this.display.init();
        this.app.scene.add(this.display.group);

        this.finish = new MyFinishLine(0, 0, -60, this);
        this.finish.init();
        this.app.scene.add(this.finish.group);

        let track = new MyTrack(this.app, this);
        track.createTrack();

        this.trafficCone = new MyTrafficCone(-21, 2, -1, this);
        this.trafficCone.init();
        this.app.scene.add(this.trafficCone.mesh);

        this.cones.push(this.trafficCone)

        this.trafficCone2 = new MyTrafficCone(-77, 2, 8, this);
        this.trafficCone2.init();
        this.app.scene.add(this.trafficCone2.mesh);

        this.cones.push(this.trafficCone2)

        this.sign = new MyRoadSign(65, 0, -50, this);
        this.sign.init();
        this.sign.mesh.rotation.y = Math.PI / 6;
        this.app.scene.add(this.sign.mesh);

        this.signs.push(this.sign)

        this.sign2 = new MyRoadSign(-82, 0, 30, this);
        this.sign2.init();
        this.app.scene.add(this.sign2.mesh);

        this.signs.push(this.sign2)

        this.shroom = new MyShroom(48, 1.2, -63, this.app.scene);
        this.shroom.init();

        this.shrooms.push(this.shroom)

        this.shroom2 = new MyShroom(-67, 1.2, 47, this.app.scene);
        this.shroom2.init();

        this.shrooms.push(this.shroom2)

        this.clock1 = new MyClock(40, 1.2, 55, this.app.scene);
        this.clock1.init();
        this.clocks.push(this.clock1)

        this.car = new MyCar(this.app, track);

        this.clock = new THREE.Clock();

        this.rival = new MyRival(track.path, this.app.scene);

        this.garage1 = new MyGarage(-90, 0, 120, this.app.scene);
        this.garage1.init();

        this.garage2 = new MyGarage(-90, 0, -120, this.app.scene);
        this.garage2.init();

        this.house = new MyHouse(70, 0, -110, this.app.scene);
        this.house.init();
    }

    /**
     * Called when the scene xml file load is complete
     * @param {MySceneData} data the entire scene data object
     */
    onSceneLoaded(data) {
        console.info("scene data loaded " + data + ". visit MySceneData javascript class to check contents for each data item.")
        this.onAfterSceneLoadedAndBeforeRender(data);
    }

    /**
     * Logs the output of an object with indentation.
     * @param {Object} obj The object to log.
     * @param {number} indent The indentation level for formatting the output.
     */
    output(obj, indent = 0) {
        console.log("" + new Array(indent * 4).join(' ') + " - " + obj.type + " " + (obj.id !== undefined ? "'" + obj.id + "'" : ""))
    }

    /**
     * Called after scene data is loaded but before rendering. Sets up materials, cameras, and traverses the scene graph.
     * @param {MySceneData} data The entire scene data object.
     */
    onAfterSceneLoadedAndBeforeRender(data) {

        this.setupMaterials(data);

        this.setupCameras(data);
        for (var node in data.nodes) {
            if (data.nodes[node].id === "scene") {
                this.traverseNode(data, node, 1);
            }
        }
    }

    /**
     * Traverses each node in the scene graph to build the scene.
     * @param {MySceneData} data The scene data.
     * @param {string} nodeId The current node's ID.
     * @param {number} depth The depth of the node in the scene graph.
     * @param {string} materialId The ID of the material used for rendering the node.
     * @returns {THREE.Group} The group containing all the children of the current node.
     */
    traverseNode(data, nodeId, depth=0, materialId = null) {
        let findLod = false;
        let node = data.nodes[nodeId];
        
        if (!node) return;
        let group = new THREE.Group();
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
            if (node.transformations.length > 0) {
                
                if (node.transformations.length === 1) {
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

            let pri, mesh;
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
                    switch (child.subtype) {
                        case "rectangle":
                            pri = new THREE.PlaneGeometry(child.representations[0].xy2[0] - child.representations[0].xy1[0],
                                child.representations[0].xy2[1] - child.representations[0].xy1[1], child.representations[0].parts_x, child.representations[0].parts_x);                                    
                                    mesh = new THREE.Mesh(pri, this.materials[materialId]);
                                    mesh.position.x += (child.representations[0].xy2[0] + child.representations[0].xy1[0]) / 2;
                                    mesh.position.y += (child.representations[0].xy2[1] + child.representations[0].xy1[1]) / 2;
                                    mesh.castShadow = true
                                    mesh.receiveShadow = true
                                    if (node.loaded) group.add(mesh);
                            break;

                        case "polygon":
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
                            
                                    
                                    mesh = new THREE.Mesh(pri, this.materials[materialId]);
                                    mesh.castShadow = node.castShadows
                                    mesh.receiveShadow = node.receiveShadows
                                    if (node.loaded) group.add(mesh);
                                
                                
                            break;
                        
                        case "box":
                            pri = new THREE.BoxGeometry(child.representations[0].xyz2[0] - child.representations[0].xyz1[0],
                                child.representations[0].xyz2[1] - child.representations[0].xyz1[1],
                                child.representations[0].xyz2[2] - child.representations[0].xyz1[2],
                                child.representations[0].parts_x, child.representations[0].parts_y, child.representations[0].parts_z)
                                    
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
                                    
                                    mesh = new THREE.Mesh(pri, this.materials[materialId]);

                                    mesh.castShadow = true
                                    mesh.receiveShadow = true
                                    if (node.loaded) group.add(mesh);
                            break;
        
                        case "nurbs":
                            pri = new MyNurbsBuilder(this.app);
                                                                                   
                            let controlpoints = [];

                            for (let i = 0; i <  child.representations[0].degree_u + 1; i++) {
                                const points = [];
                                for (let j = 0; j <  child.representations[0].degree_v + 1; j++) {
                                    const point =
                                        child.representations[0].controlpoints[i * ( child.representations[0].degree_v + 1) + j];
                                        points.push([point.xx, point.yy, point.zz, 1]);
                                }
                                controlpoints.push(points);
            }
                            /* for (let i = 0; i < child.representations[0].controlpoints.length; i++) {
                                let points = [child.representations[0].controlpoints[i].xx, 
                                            child.representations[0].controlpoints[i].yy,
                                            child.representations[0].controlpoints[i].zz, 1]
                                controlPoints.push(points)
                            } */

                            let geometry = pri.build(controlpoints, 
                                child.representations[0].degree_u, child.representations[0].degree_v, 
                                child.representations[0].parts_u, child.representations[0].parts_v)

                                if (node.materialIds.length > 0) {                                    
                                    mesh = new THREE.Mesh(geometry, this.materials[materialId]);
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
                        spotLight.target.position.set(child.target[0], child.target[1], child.target[2]);
                        this.app.scene.add(spotLight.target);
                    }
                    this.lights.push(spotLight);
                    break;

                case "directionallight": 
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
                    child.children?.forEach(nodeChildren => {
                        let childLodGroup = new THREE.Group();

                        nodeChildren.node.children.forEach( i => {
                            const childMesh = this.traverseNode(data, nodeChildren.node.id, depth + 1, materialId);
                            childLodGroup.add(childMesh);
                        })
                        lod.addLevel(childLodGroup, nodeChildren.mindist);
                    })
                    
                    group.add(lod);
                    break;   
                
                default:
                    break;
                }
            }                 
        if (depth === 1){
            this.app.scene.add(group);
        }
        return group;
    }

    /**
     * Builds mipmaps for a texture if provided.
     * @param {Object} textureInfo Information about the texture.
     * @param {THREE.Texture} texture The texture to generate mipmaps for.
     */
    buildMipmap(textureInfo, texture) {
    texture.generateMipmaps = true;
    
    if (!textureInfo.mipmaps) {
        let mipmaps = [
            textureInfo.mipmap0, textureInfo.mipmap1, textureInfo.mipmap2,
            textureInfo.mipmap3, textureInfo.mipmap4, textureInfo.mipmap5,
            textureInfo.mipmap6, textureInfo.mipmap7
        ];

        mipmaps.forEach((mipmap, level) => {
            if (mipmap) {
                new THREE.TextureLoader().load(
                    mipmap,
                    function (mipmapTex) {
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');
                        context.scale(1, 1);

                        const img = mipmapTex.image;
                        canvas.width = img.width;
                        canvas.height = img.height;

                        context.drawImage(img, 0, 0);

                        texture.mipmaps[level] = canvas;
                    },
                    undefined,
                    function (error) {
                        console.error(error);
                    });
                }
            });
        }
    }

    /**
     * Sets up materials for the scene using provided data.
     * @param {MySceneData} data The scene data containing materials information.
     */
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

        let skyMaterial = [
            new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(data.skyboxes["default"].up), side: THREE.BackSide}),
            new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(data.skyboxes["default"].down), side: THREE.BackSide}),
            new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(data.skyboxes["default"].left), side: THREE.BackSide}),
            new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(data.skyboxes["default"].right), side: THREE.BackSide}),
            new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(data.skyboxes["default"].front), side: THREE.BackSide}),
            new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(data.skyboxes["default"].back), side: THREE.BackSide}),
        ];

        let skyMesh = new THREE.Mesh(skybox, skyMaterial);

        skyMesh.position.set(data.skyboxes["default"].center[0], data.skyboxes["default"].center[1], data.skyboxes["default"].center[2]);

        this.app.scene.add(skyMesh);

        this.textures = {};

        for (var key in data.textures) {
            let texture = null;
            if(data.textures[key].isVideo) {
                this.createHtmlVideoElement(data.textures[key].id, data.textures[key].filepath);
                const video = document.getElementById(data.textures[key].id);
                texture = new THREE.VideoTexture(video);
                texture.colorSpace = THREE.SRGBColorSpace;
                this.textures[key] = texture;
            } else {
                texture = new THREE.TextureLoader().load(data.textures[key].filepath);
                texture.wrapS = THREE.ClampToEdgeWrapping
                texture.wrapT = THREE.ClampToEdgeWrapping
                this.textures[key] = texture;
            }

            this.buildMipmap(data.textures[key], texture);
        }

        for (var key in data.materials) {
            
            /*let material = new THREE.MeshPhongMaterial({ color: data.materials[key].color, 
                                        emissive: data.materials[key].emissive, 
                                        specular: data.materials[key].specular, 
                                        shininess: data.materials[key].shininess,
                                        map: textures[data.materials[key].textureref] });*/
            let material = new THREE.MeshBasicMaterial({ color: data.materials[key].color, 
                map: this.textures[data.materials[key].textureref] });

            if (material.map) material.map.repeat.set(data.materials[key].texlength_s || 1, data.materials[key].texlength_t || 1);
            if (data.materials[key].twosided) material.side = THREE.DoubleSide;
            if (data.materials[key].wireframe) material.wireframe = data.materials[key].wireframe;
            if (data.materials[key].shading === "flat") material.flatShading = true;
            if (data.materials[key].bumpref) {
                material.bumpMap = this.textures[data.materials[key].bumpref];
            };
            this.materials[data.materials[key].id] = material;
        }
        
    }

    /**
     * Sets up cameras for the scene using provided data.
     * @param {MySceneData} data The scene data containing camera information.
     */
    setupCameras(data) {
 
        for (var key in data.cameras) {
            let cameraData = data.cameras[key];

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

    /**
     * Update function, to be called for updating the state of contents, if necessary.
     */
    update() {
       //this.display.update(); 
       let deltaTime = this.clock.getDelta();
       this.car.checkCollisionWithRival(this.rival);
       if (!this.timer.paused) this.rival.update(deltaTime);
       this.timer.update();
       this.display.update();
       this.trafficCone.update();
       this.trafficCone2.update();

       /*if (this.timerElement) {
        this.timerElement.textContent = this.timer.getFormattedTime();
        }

        if (this.lapElement) {
            this.lapElement.textContent = this.car.passThroughCounter;
            }*/
    }

    /**
     * Creates an HTML video element for textures that are videos.
     * @param {string} id The ID to assign to the video element.
     * @param {string} path The file path of the video.
     */
    createHtmlVideoElement(id, path) {
        const videoElement = document.createElement("video");
        videoElement.style.display = "none";
        videoElement.id = id;
        videoElement.autoplay = true;
        videoElement.muted = true;
        videoElement.loop = true;
        const sourceElement = document.createElement("source");
        sourceElement.src = path;
        videoElement.preload = "auto";
        sourceElement.type = "video/mp4";
        videoElement.appendChild(sourceElement);
        document.body.appendChild(videoElement);
    }
}

export { MyContents };