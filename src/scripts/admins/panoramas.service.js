'use strict';

function panoramaService( $resource ) {
    return $resource( '/api/index.php/:id', { id: '@id' }, {
        'save': {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
    } );
}

angular.module( 'panoramasManager' ).factory( 'Panorama', panoramaService );