'use strict';

panoramaApp.factory( 'Panoramas', function( $http, $filter, Config ) {
    var panoramas;

    function query( callback ) {
        $http.get( Config.api_link ).success( function( data ) {
            panoramas = $filter( 'pathPrepend' )( data );

            callback();
        } );
    }

    function get( id ) {
        id = parseInt( id );
        if ( isNaN( id ) ) id = Config.defaultId;
        return $filter( 'getById' )( panoramas, id );
    }

    return {
        get: get,
        query: query
    };
} );