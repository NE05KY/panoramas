'use strict';

function eventsFactory( Config ) {
    var startX = 0, startY = 0,
        startLon = 0, startLat = 0;

    function onWindowResize( renderer ) {
        Config.camera.aspect = window.innerWidth / window.innerHeight;
        Config.camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );
    }

    function onDocumentTouchStart( event ) {
        Config.isUserInteracting = true;

        startX = event.changedTouches[ 0 ].clientX;
        startY = event.changedTouches[ 0 ].clientY;

        startLon = Config.lon;
        startLat = Config.lat;
    }

    function onDocumentTouchMove( event ) {
        if ( Config.isUserInteracting ) {
            Config.lon = ( startX - event.changedTouches[ 0 ].clientX ) * 0.1 + startLon;
            Config.lat = ( event.changedTouches[ 0 ].clientY - startY ) * 0.1 + startLat;
        }
    }

    function onDocumentTouchEnd() {
        Config.isUserInteracting = false;
    }

    function onDocumentMouseDown( event ) {
        // update the mouse variable
        Config.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        Config.mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;

        // find intersections

        // create a Ray with origin at the mouse position
        //   and direction into the scene (Config.camera direction)
        var vector = new THREE.Vector3( Config.mouse.x, Config.mouse.y, 1 );
        vector.unproject( Config.camera );
        var ray = new THREE.Raycaster( Config.camera.position, vector.sub( Config.camera.position ).normalize() );

        // create an array containing all objects in the scene with which the ray intersects
        var intersects = ray.intersectObjects( Config.elements );

        // if there is one (or more) intersections
        if ( intersects.length ) {
            location.hash = intersects[ 0 ].object.panoId;
        }

        Config.isUserInteracting = true;

        startX = event.clientX;
        startY = event.clientY;

        startLon = Config.lon;
        startLat = Config.lat;
    }

    function onDocumentMouseMove( event ) {
        if ( Config.isUserInteracting ) {
            Config.lon = ( startX - event.clientX ) * 0.1 + startLon;
            Config.lat = ( event.clientY - startY ) * 0.1 + startLat;
        }

        Config.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        Config.mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
    }

    function onDocumentMouseUp() {
        Config.isUserInteracting = false;
    }

    function onDocumentMouseWheel( event ) {
        if ( ( Config.camera.fov > Config.minZoom && event.wheelDeltaY > 0) ||
            ( Config.camera.fov < Config.maxZoom && event.wheelDeltaY < 0) ) {
            Config.camera.fov -= event.wheelDeltaY * 0.05;
        }

        Config.camera.updateProjectionMatrix();
    }

    return {
        onDocumentMouseDown: onDocumentMouseDown,
        onDocumentMouseMove: onDocumentMouseMove,
        onDocumentMouseUp: onDocumentMouseUp,
        //
        onDocumentTouchStart: onDocumentTouchStart,
        onDocumentTouchMove: onDocumentTouchMove,
        onDocumentTouchEnd: onDocumentTouchEnd,
        //
        onDocumentMouseWheel: onDocumentMouseWheel,
        //
        onWindowResize: onWindowResize
    };
}

angular.module( 'panoramas' ).factory( 'Events', eventsFactory );