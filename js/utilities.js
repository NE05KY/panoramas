function zoom( ratio ) {
    var minZoom = 45,
        maxZoom = 75;

    if ( ( camera.fov > minZoom && ratio > 0) ||
        ( camera.fov < maxZoom && ratio < 0) ) {
        camera.fov -= event.wheelDeltaY * 0.05;
    }

    camera.updateProjectionMatrix();
}

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


function debugStats() {
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.zIndex = 100;
    container.appendChild( stats.domElement );
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