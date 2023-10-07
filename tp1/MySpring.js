import * as THREE from 'three';

/**
 *  This class contains the contents of out application
 */
class MySpring  {

    /**
       constructs the object
       @param {MySpring} app The application object
    */ 
    constructor(scene) {
        this.scene = scene

        this.group = new THREE.Group()
    }

    /**
     * initializes the contents
     */
    init() {
        // Define the control points for the Quadratic Bezier Curve
        const points = []; // Initialize an array to store the coordinates of the spiral spring

        // Parameters for the spiral spring
        const numLevels = 7; // Number of levels
        const numSegmentsPerLevel = 30; // Number of segments per level
        const radius = 0.3; // Radius of the spiral
        const heightPerLevel = 0.2; // Height increment per level

        // Loop through the levels and segments to calculate the coordinates
        for (let level = 0; level < numLevels; level++) {
            for (let segment = 0; segment < numSegmentsPerLevel; segment++) {
                const t = (segment / numSegmentsPerLevel) * Math.PI * 2; // Angle parameter
                const r = radius // Decreasing radius for each level
                const x = r * Math.cos(t);
                const y = r * Math.sin(t);
                const z = level * heightPerLevel; // Increase in height for each level
                
                points.push(new THREE.Vector3(x, y, z)); // Add the coordinates to the points array
            }
        }

        const curve = new THREE.CatmullRomCurve3(points);

        const curveGeometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(10000)); // Adjust the number of points for smoothness
        const curveMaterial = new THREE.LineBasicMaterial({ color: 0x808080 });

        this.curveObject = new THREE.Line(curveGeometry, curveMaterial);
        
        this.curveObject.rotateX(Math.PI / 2)
        this.curveObject.position.set(3.5,4.56,0)


        this.group.add(this.curveObject);

    }
}

export { MySpring };