'use strict';

angular.module( 'panoramasManager' ).factory( 'Panorama', [ '$resource',
    function( $resource ) {
        return $resource( '/api/index.php/:id', { id: '@id' }, {
            'save': {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }
        } );
    } ] );