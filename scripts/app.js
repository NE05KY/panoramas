'use strict';

angular.module( 'app', [] );

angular.module( 'app' ).config(
    [ '$locationProvider',
        function( $locationProvider ) {
            $locationProvider.html5Mode( true );
        }
    ]
);