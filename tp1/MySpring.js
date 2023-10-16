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
        const points = [];

        
        const numLevels = 7;
        const numSegmentsPerLevel = 30; 
        const radius = 0.3;
        const heightPerLevel = 0.2;

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

        const curve = new THREE.CatmullRomCurve3(points);

        const curveGeometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(10000)); 
        const curveMaterial = new THREE.LineBasicMaterial({ color: 0x808080 });

        this.curveObject = new THREE.Line(curveGeometry, curveMaterial);
        
        this.curveObject.rotateX(Math.PI / 2)
        this.curveObject.position.set(3.5,4.56,0)


        this.group.add(this.curveObject);

    }
}

export { MySpring };