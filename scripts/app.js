'use strict';

var panoramaApp = angular.module( 'panoramaApp', [] );

panoramaApp.config(
    [ '$locationProvider',
        function( $locationProvider ) {
            $locationProvider.html5Mode( true );
        }
    ]
);