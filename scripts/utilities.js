function maxZoom( callback ) {
    camera.fov -= 2;
    camera.updateProjectionMatrix();

    if ( camera.fov > 1 ) {
        setTimeout( function() {
            maxZoom( callback )
        }, 1 );
    }
    else {
        callback();
    }
}

function minZoom() {
    camera.fov += 2;
    camera.updateProjectionMatrix();

    if ( camera.fov < 75 ) {
        setTimeout( minZoom, 1 )
    }
}