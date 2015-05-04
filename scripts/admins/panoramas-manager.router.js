'use strict';

angular.module( 'panoramasManager' ).config( function( $routeProvider ) {
    $routeProvider.
        when( '/panoramas', {
            controller: 'PanoramasCtrl',
            controllerAs: 'panoCtrl'
        } ).
        otherwise( {
            redirectTo: '/panoramas'
        } );
} );