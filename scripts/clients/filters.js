'use strict';

function pathPrepend( Config ) {
    return function( input ) {
        var i = 0, len = input.length;
        for ( ; i < len; i++ ) {
            input[ i ].file = Config.texturePath + input[ i ].file;
        }
        return input;
    };
}

function getById() {
    return function( input, id ) {
        var i = 0, len = input.length;
        for ( ; i < len; i++ ) {
            if ( input[ i ].id === id ) {
                return input[ i ];
            }
        }
        return null;
    };
}

angular.module( 'panoramas' ).filter( 'pathPrepend', pathPrepend );
angular.module( 'panoramas' ).filter( 'getById', getById );