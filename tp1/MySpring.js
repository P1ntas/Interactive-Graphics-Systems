import * as THREE from 'three';

/**
 *  This class contains the contents of out application
 */
class MySpring  {

    /**
     * Constructor for the MySpring class
     * @param {THREE.Scene} scene - The scene in which the spring will be rendered
     */
    constructor(scene) {
        this.scene = scene

        this.group = new THREE.Group()
    }

    /**
     * initializes the contents
     */
    init() {
        const points = [];

        
        const numLevels = 7;
        const numSegmentsPerLevel = 30; 
        const radius = 0.3;
        const heightPerLevel = 0.2;

        // Create points for the spring based on coils and segments
        for (let level = 0; level < numLevels; level++) {
            for (let segment = 0; segment < numSegmentsPerLevel; segment++) {
                const t = (segment / numSegmentsPerLevel) * Math.PI * 2;
                const r = radius
                const x = r * Math.cos(t);
                const y = r * Math.sin(t);
                const z = level * heightPerLevel;
                
                points.push(new THREE.Vector3(x, y, z)); 
            }
        }

        // Create a Catmull-Rom curve using the points
        const curve = new THREE.CatmullRomCurve3(points);

        // Create geometry for the curve
        const curveGeometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(10000)); 
        const curveMaterial = new THREE.LineBasicMaterial({ color: 0x808080 });
 
        // Create a line object to represent the spring
        this.curveObject = new THREE.Line(curveGeometry, curveMaterial);
 
        // Rotate and position the spring object
        this.curveObject.rotateX(Math.PI / 2); // Rotate the spring to stand upright
        this.curveObject.position.set(3.5, 4.56, 0); // Position the spring in the scene
 
        // Add the spring object to the group
        this.group.add(this.curveObject);

    }
}

export { MySpring };