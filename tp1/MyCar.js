import * as THREE from 'three';

/**
 *  This class contains the contents of out application
 */
class MyCar  {

    /**
       constructs the object
       @param {MyCar} app The application object
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
        const startPoint = new THREE.Vector3(0, 1, 0);
        const controlPoint = new THREE.Vector3(0.55, 0.9987, 0); // Adjust the control point coordinates
        const controlPoint_2 = new THREE.Vector3(0.9987, 0.55, 0); // Adjust the control point coordinates
        const endPoint = new THREE.Vector3(1, 0, 0);

        const curve = new THREE.CubicBezierCurve3(startPoint, controlPoint, controlPoint_2, endPoint);
        const curve1 = new THREE.CubicBezierCurve3(startPoint, controlPoint, controlPoint_2, endPoint);

        const curveGeometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(50)); // Adjust the number of points for smoothness
        const curveGeometry1 = new THREE.BufferGeometry().setFromPoints(curve.getPoints(50)); // Adjust the number of points for smoothness
        const curveMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });

        this.curveObject = new THREE.Line(curveGeometry, curveMaterial);
        this.curveObject1 = new THREE.Line(curveGeometry, curveMaterial);
        
        this.curveObject.rotateY(Math.PI / 2)
        this.curveObject1.rotateY(-Math.PI / 2)
        this.curveObject.position.set(-9.6,5.5,-0)
        this.curveObject1.position.set(-9.6,5.5,-0)


        const startPoint2 = new THREE.Vector3(0, 1, 0);
        const controlPoint2 = new THREE.Vector3(0.55, 0.9987, 0); // Adjust the control point2 coordinates
        const controlPoint2_1 = new THREE.Vector3(0.9987, 0.55, 0); // Adjust the control point2 coordinates
        const endPoint2 = new THREE.Vector3(1, 0, 0);

        const curve2 = new THREE.CubicBezierCurve3(startPoint2, controlPoint2, controlPoint2_1, endPoint2);
        const curve2_1 = new THREE.CubicBezierCurve3(startPoint2, controlPoint2, controlPoint2_1, endPoint2);

        const curveGeometry2 = new THREE.BufferGeometry().setFromPoints(curve2.getPoints(50)); // Adjust the number of points for smoothness
        const curveGeometry2_1 = new THREE.BufferGeometry().setFromPoints(curve2_1.getPoints(50)); // Adjust the number of points for smoothness
        const curveMaterial2 = new THREE.LineBasicMaterial({ color: 0xff0000 });

        this.curveObject2 = new THREE.Line(curveGeometry2, curveMaterial2);
        this.curveObject2_1 = new THREE.Line(curveGeometry2_1, curveMaterial);
        
        this.curveObject2.rotateY(Math.PI / 2)
        this.curveObject2_1.rotateY(-Math.PI / 2)
        this.curveObject2.position.set(-9.6,5.5,-5)
        this.curveObject2_1.position.set(-9.6,5.5,-5)

        const startPoint3 = new THREE.Vector3(0.5, 1.4, 0);
        const controlPoint3_1 = new THREE.Vector3(1.2, 1.4, 0); // Adjust the control point2 coordinates
        const controlPoint3_2 = new THREE.Vector3(1.9, 1.2, 0); // Adjust the control point2 coordinates
        const endPoint3 = new THREE.Vector3(2, 0, 0);

        const curve3 = new THREE.CubicBezierCurve3(startPoint3, controlPoint3_1, controlPoint3_2, endPoint3);

        const curveGeometry3 = new THREE.BufferGeometry().setFromPoints(curve3.getPoints(50)); // Adjust the number of points for smoothness
        const curveMaterial3 = new THREE.LineBasicMaterial({ color: 0xff0000 });

        this.curveObject3 = new THREE.Line(curveGeometry3, curveMaterial3);
        
        this.curveObject3.rotateY(Math.PI / 2)
        this.curveObject3.position.set(-9.6,5.5,-4)

        const startPoint4 = new THREE.Vector3(0.3, 1.55, 0);
        const controlPoint4_1 = new THREE.Vector3(1, 1.575, 0); // Adjust the control point2 coordinates
        const controlPoint4_2 = new THREE.Vector3(2.3, 1.3, 0); // Adjust the control point2 coordinates
        const endPoint4 = new THREE.Vector3(2.6, -0.6, 0);

        const curve4 = new THREE.CubicBezierCurve3(startPoint4, controlPoint4_1, controlPoint4_2, endPoint4);

        const curveGeometry4 = new THREE.BufferGeometry().setFromPoints(curve4.getPoints(50)); // Adjust the number of points for smoothness
        const curveMaterial4 = new THREE.LineBasicMaterial({ color: 0xff0000 });

        this.curveObject4 = new THREE.Line(curveGeometry4, curveMaterial4);
        
        this.curveObject4.rotateY(Math.PI / 2)
        this.curveObject4.position.set(-9.6,7.5,-1.9)


        const startPoint5 = new THREE.Vector3(1, 3.55, 0);
        const controlPoint5_1 = new THREE.Vector3(1.3, 1.775*2, 0); // Adjust the control point2 coordinates
        const controlPoint5_2 = new THREE.Vector3(1.9*2, 1.5*2, 0); // Adjust the control point2 coordinates
        const endPoint5 = new THREE.Vector3(2.1*2, 0, 0);

        const curve5 = new THREE.CubicBezierCurve3(startPoint5, controlPoint5_1, controlPoint5_2, endPoint5);

        const curveGeometry5 = new THREE.BufferGeometry().setFromPoints(curve5.getPoints(50)); // Adjust the number of points for smoothness
        const curveMaterial5 = new THREE.LineBasicMaterial({ color: 0xff0000 });

        this.curveObject5 = new THREE.Line(curveGeometry5, curveMaterial5);
        
        this.curveObject5.rotateY(-Math.PI / 2)
        this.curveObject5.position.set(-9.6,5.5,-3.2)


        this.group.add(this.curveObject);
        this.group.add(this.curveObject1);
        this.group.add(this.curveObject2);
        this.group.add(this.curveObject2_1);
        this.group.add(this.curveObject3);
        this.group.add(this.curveObject4);
        this.group.add(this.curveObject5);

    }
}

export { MyCar };