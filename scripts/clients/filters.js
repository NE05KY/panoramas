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

function findByName() {
    return function( input, name ) {
        if (!name) return;

        var i = 0, len = input.length, result = [];
        for ( ; i < len; i++ ) {
            if ( input[ i ].name.toLowerCase().indexOf(name.toLowerCase()) > -1 ) {
                result.push(input[ i ]);
            }

            if ( result.length === 2 ) {
                break;
            }
        }
        return result;
    };
}

angular.module( 'panoramas' ).filter( 'pathPrepend', pathPrepend );
angular.module( 'panoramas' ).filter( 'getById', getById );
angular.module( 'panoramas' ).filter( 'findByName', findByName );