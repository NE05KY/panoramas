'use strict';

panoramaApp.factory( "Panorama", function( $resource ) {
    return $resource( "/storage/panoramos/:id" );
} );