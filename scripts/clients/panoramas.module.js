'use strict';

angular.module( 'panoramas', [] );

angular.module( 'panoramas' ).config(
    [ '$locationProvider',
        function( $locationProvider ) {
            $locationProvider.html5Mode( true );
        }
    ]
);