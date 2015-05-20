'use strict';

function panoramaService( $http, $filter, Config ) {
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

    function findByName( name ) {
        return $filter( 'findByName' )( panoramas, name );
    }

    return {
        get: get,
        findByName: findByName,
        query: query
    };
}

angular.module( 'panoramas' ).factory( 'Panoramas', panoramaService );