'use strict';

angular.module( 'app' ).factory( 'Panoramas', function( $http, $filter, Config ) {
    var panoramas;

    function query( callback ) {
        $http.get( Config.apiLink ).success( function( data ) {
            panoramas = $filter( 'pathPrepend' )( data );

            callback();
        } );
    }

    function get( id ) {
        if ( id ) {
            return $filter( 'getById' )( panoramas, id );
        } else {
            return panoramas[ 0 ];
        }
    }

    return {
        get: get,
        query: query
    };
} );