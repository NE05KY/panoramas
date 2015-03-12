'use strict';

panoramaApp.filter( 'pathPrepend', function( Config ) {
    return function( input ) {
        var i = 0, len = input.length;
        for ( ; i < len; i++ ) {
            input[ i ].file = Config.texturePath + input[ i ].file;
        }
        return input;
    };
} );

panoramaApp.filter( 'getById', function() {
    return function( input, id ) {
        var i = 0, len = input.length;
        for ( ; i < len; i++ ) {
            if ( +input[ i ].id === +id ) {
                return input[ i ];
            }
        }
        return null;
    };
} );