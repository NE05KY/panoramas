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

function transit( texture ) {
    scene.children[ 0 ].material.map = THREE.ImageUtils.loadTexture( texture );

    /*
     temporary disabled animation

     maxZoom(function() {
     minZoom();
     scene.children[0].material.map = THREE.ImageUtils.loadTexture( texture );
     })

     */
}