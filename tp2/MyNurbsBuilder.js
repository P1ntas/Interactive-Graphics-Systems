import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { NURBSSurface } from 'three/addons/curves/NURBSSurface.js';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';
/**
 *  This class contains the contents of out application
 */
class MyNurbsBuilder  {
    /**
       constructs the object
       @param {MyApp} app The application object
    */
    constructor(app) {
        this.app = app
    }

    /**
     * Builds a NURBS surface geometry given control points and degrees.
     * @param {Array} controlPoints Array of control points for the NURBS surface.
     * @param {number} degree1 Degree of the surface in the U direction.
     * @param {number} degree2 Degree of the surface in the V direction.
     * @param {number} samples1 Number of samples in the U direction.
     * @param {number} samples2 Number of samples in the V direction.
     * @returns {ParametricGeometry} The generated NURBS surface geometry.
     */
    build(controlPoints, degree1, degree2, samples1, samples2) {
        // Initialize the knot vectors for U and V direction.
        const knots1 = []
        const knots2 = []
        // build knots1 = [ 0, 0, 0, 1, 1, 1 ];
        for (var i = 0; i <= degree1; i++) {
            knots1.push(0)
        }
        for (var i = 0; i <= degree1; i++) {
            knots1.push(1)
        }
        // build knots2 = [ 0, 0, 0, 0, 1, 1, 1, 1 ];
        for (var i = 0; i <= degree2; i++) {
            knots2.push(0)
        }
        for (var i = 0; i <= degree2; i++) {
            knots2.push(1)
        }

        // Convert the control points to THREE.Vector4 objects.
        let stackedPoints = []
        for (var i = 0; i < controlPoints.length; i++) {
            let row = controlPoints[i]
            let newRow = []
            for (var j = 0; j < row.length; j++) {
                let item = row[j]
                newRow.push(new THREE.Vector4(item[0],
                item[1], item[2], item[3]));
            }
            stackedPoints[i] = newRow;
        }

        // Create the NURBS surface.
        const nurbsSurface = new NURBSSurface( degree1, degree2,
                                     knots1, knots2, stackedPoints );
        
        // Create the geometry from the NURBS surface.
        const geometry = new ParametricGeometry( getSurfacePoint,
                                     samples1, samples2 );
        return geometry;
       
        // Function to get surface point for the given u, v parameters.
        function getSurfacePoint( u, v, target ) {
            return nurbsSurface.getPoint( u, v, target );
        }
    }
}
export { MyNurbsBuilder };