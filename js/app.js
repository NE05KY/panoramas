'use strict';

var panoramaApp = angular.module( 'panoramaApp', [ 'ngResource' ] );

panoramaApp.config(
    [ '$locationProvider',
        function( $locationProvider ) {
            $locationProvider.html5Mode( true );
        }
    ]
);