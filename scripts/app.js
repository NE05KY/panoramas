'use strict';

var panoramaApp = angular.module( 'panoramaApp', [ 'ngResource' ] );

panoramaApp.config(
    [ '$locationProvider',
        function( $locationProvider ) {
            $locationProvider.html5Mode( true );
        }
    ]
);

// service for RESTful API
//panoramaApp.factory( "Panoramas", function( $resource, Config ) {
//    return $resource( Config.api_link );
//} );

panoramaApp.factory( 'Panoramas', function( $resource, Config ) {
    return $resource( Config.api_link,
        {
            apiKey: Config.api_key,
            fo: true,
            f: { "_id": 0 }
        } );
} );