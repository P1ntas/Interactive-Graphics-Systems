import * as THREE from 'three';

class MyPicking {
    constructor(app, label) {
        this.app = app;
        this.label = label;
        this.intersectObjs = [];
        this.notPickableObjIds = [];
        this.pickingColor = "0x00ffff";

        this.raycaster = new THREE.Raycaster()
        this.raycaster.near = 1
        this.raycaster.far = 1000

        this.objMeshes = [];

        this.pointer = new THREE.Vector2();

        // register events
        document.addEventListener(
            "pointermove",
            this.onPointerMove.bind(this)
        );

        document.addEventListener(
            "mousedown",
            this.onMouseDown.bind(this)
        );
    }

    init(meshes) {
        console.log("meshes: ", meshes);
        this.intersectObjs = meshes;
    }
    
    /*
    * Update the color of selected object
    *
    */
    updatePickingColor(value) {
        this.pickingColor = value.replace('#', '0x');
    }

    /*
    * Change the color of the first intersected object
    *
    */
    changeColorOfFirstPickedObj(obj) {
        if (this.lastPickedObj != obj) {
            if (this.lastPickedObj)
                this.lastPickedObj.material.color.setHex(this.lastPickedObj.currentHex);
            this.lastPickedObj = obj;
            this.lastPickedObj.currentHex = this.lastPickedObj.material.color.getHex();
            this.lastPickedObj.material.color.setHex(this.pickingColor);
        }
    }

    /*
     * Restore the original color of the intersected object
     *
     */
    restoreColorOfFirstPickedObj() {
        if (this.lastPickedObj)
            this.lastPickedObj.material.color.setHex(this.lastPickedObj.currentHex);
        this.lastPickedObj = null;
    }

    /*
    * Helper to visualize the intersected object
    *
    */
    pickingHelper(intersects) {
        if (intersects.length > 0) {
            const obj = intersects[0].object
            if (this.notPickableObjIds.includes(obj.name)) {
                this.restoreColorOfFirstPickedObj()
                console.log("Object cannot be picked !")
            }
            else
                this.changeColorOfFirstPickedObj(obj)
        } else {
            this.restoreColorOfFirstPickedObj()
        }
    }


    /**
     * Print to console information about the intersected objects
     */
    transverseRaycastProperties(intersects) {
        for (var i = 0; i < intersects.length; i++) {

            //console.log(intersects[i]);

            /*
            An intersection has the following properties :
                - object : intersected object (THREE.Mesh)
                - distance : distance from camera to intersection (number)
                - face : intersected face (THREE.Face3)
                - faceIndex : intersected face index (number)
                - point : intersection point (THREE.Vector3)
                - uv : intersection point in the object's UV coordinates (THREE.Vector2)
            */
        }
    }


    onPointerMove(event) {

        // calculate pointer position in normalized device coordinates
        // (-1 to +1) for both components

        //of the screen is the origin
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        //console.log("Position x: " + this.pointer.x + " y: " + this.pointer.y);

        //2. set the picking ray from the camera position and mouse coordinates
        this.raycaster.setFromCamera(this.pointer, this.app.getActiveCamera());

        //3. compute intersections
        //console.log("this.intersectObjs: ", this.intersectObjs);
        var intersects = this.raycaster.intersectObjects(this.intersectObjs);

        this.pickingHelper(intersects)

        this.transverseRaycastProperties(intersects)
    }

    onMouseDown(event) {
        if (event.button === 0) { // left mouse button clicked
            
            // calculate pointer position in normalized device coordinates
            // (-1 to +1) for both components

            //of the screen is the origin
            this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

            //console.log("Position x: " + this.pointer.x + " y: " + this.pointer.y);

            //2. set the picking ray from the camera position and mouse coordinates
            this.raycaster.setFromCamera(this.pointer, this.app.getActiveCamera());

            this.isClickEvent = true;

            // 3. compute intersections
            if (this.intersectObjs) {
                var intersects = this.raycaster.intersectObjects(this.intersectObjs, true);
                this.handleLeftMouseClick(intersects);
            }
        }
    }

    handleLeftMouseClick(intersects) {
        for (var i = 0; i < intersects.length; i++) {
            var intersect = this.findObject(intersects[i].object);

            console.log("intersect.name: ", intersect.name);
            if (intersect.name.includes(this.label)) {
                switch (this.label) {
                    case "_button":
                        this.processButtonClicked(intersect)
                        break;
                    case "car_rival_":
                        console.log("Rival car! ", intersect);
                        this.processCarClicked(intersect)
                        break;
                    case "car_":
                        console.log("My car! ", intersect);
                        this.processCarClicked(intersect)
                        break;
                }
            }
        }
    }

    findObject(intersect) {
        if (intersect.name.includes(this.label)) {
            return intersect;
        }

        if (intersect.parent) {
            return this.findObject(intersect.parent);
        }

        return null; // Car object not found
    }

    processButtonClicked(intersect) {
        //console.log("processButtonClicked: ", intersect);
        this.app.contents.stateMachine.update(intersect.name);
    }

    processCarClicked(intersect) {
        this.app.contents.stateMachine.update(intersect.name)
    }
}



export { MyPicking }