'use strict';

angular.module( 'panoramasManager' ).config( [ '$routeProvider',
    function( $routeProvider ) {
        $routeProvider.
            when( '/panoramas', {
                controller: 'PanoramasCtrl'
            } ).
            otherwise( {
                redirectTo: '/panoramas'
            } );
    } ] );