panoramaApp.factory( "Events", function() {
    var startX = 0, startY = 0,
        startLon = 0, startLat = 0;

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );
    }

    function onDocumentTouchStart( event ) {
        isUserInteracting = true;

        startX = event.changedTouches[ 0 ].clientX;
        startY = event.changedTouches[ 0 ].clientY;

        startLon = lon;
        startLat = lat;
    }

    function onDocumentTouchMove( event ) {
        if ( isUserInteracting === true ) {
            lon = ( startX - event.changedTouches[ 0 ].clientX ) * 0.1 + startLon;
            lat = ( event.changedTouches[ 0 ].clientY - startY ) * 0.1 + startLat;
        }
    }

    function onDocumentTouchEnd( event ) {
        isUserInteracting = false;
    }


    function onDocumentMouseDown( event ) {
        // update the mouse variable
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;

        // find intersections

        // create a Ray with origin at the mouse position
        //   and direction into the scene (camera direction)
        var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
        vector.unproject( camera );
        var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

        // create an array containing all objects in the scene with which the ray intersects
        var intersects = ray.intersectObjects( elements );

        // if there is one (or more) intersections
        if ( intersects.length > 0 ) {
            console.log( intersects[ 0 ] );
            transit( intersects[ 0 ].object.href );
        }

        isUserInteracting = true;

        startX = event.clientX;
        startY = event.clientY;

        startLon = lon;
        startLat = lat;

    }

    function onDocumentMouseMove( event ) {
        if ( isUserInteracting === true ) {
            lon = ( startX - event.clientX ) * 0.1 + startLon;
            lat = ( event.clientY - startY ) * 0.1 + startLat;
        }

        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
    }

    function onDocumentMouseUp( event ) {
        isUserInteracting = false;
    }

    function onDocumentMouseWheel( event ) {
        zoom( event.wheelDeltaY );
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

    }
} );