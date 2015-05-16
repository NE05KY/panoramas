'use strict';

function PanoramasController( $scope, Panorama, FileUploader, previewEngine ) {
    $scope.uploader = new FileUploader( {
        url: '/api/index.php',
        queueLimit: 1
    } );

    $scope.query = function() {
        $scope.panoramas = Panorama.query();
    };

    $scope.query();

    $scope.remove = function( pano ) {
        if ( confirm( 'Delete pano?' ) ) {
            pano.$delete();
            $scope.panoramas.splice( $scope.panoramas.indexOf( pano ), 1 );
        }
    };

    $scope.edit = function( pano ) {
        $scope.isEdit = true;
        $scope.model = pano;

        if ( $scope.uploader.queue.length ) {
            $scope.uploader.queue[ 0 ].remove();
        }

        $( '#editModal' ).foundation( 'reveal', 'open' );

    };

    $scope.new = function() {
        $scope.isEdit = false;
        $scope.model = new Panorama();

        if ( $scope.uploader.queue.length ) {
            $scope.uploader.queue[ 0 ].remove();
        }

        $( '#editModal' ).foundation( 'reveal', 'open' );
    };

    $scope.save = function() {
        if ( $scope.isEdit && $scope.panoForm.$valid && ($scope.model.file || $scope.uploader.queue[ 0 ] ) ) {
            $scope.model.$save( function( data ) {
                if ( $scope.uploader.queue[ 0 ] ) {
                    $scope.uploader.queue[ 0 ].formData = [ { 'id': data.id } ];
                    $scope.uploader.queue[ 0 ].upload();
                }

                $( '#editModal' ).foundation( 'reveal', 'close' );
                $scope.query();
            } );
        }
        else if ( !$scope.isEdit && $scope.panoForm.$valid && $scope.uploader.queue[ 0 ] ) {
            $scope.model.$save( function( data ) {
                $scope.uploader.queue[ 0 ].formData = [ { 'id': data.id } ];
                $scope.uploader.queue[ 0 ].upload();

                $scope.query();
                $( '#editModal' ).foundation( 'reveal', 'close' );
                $scope.model = new Panorama();
            } );
        }
    };

    $scope.cancel = function() {
        $( '#editModal' ).foundation( 'reveal', 'close' );
        delete $scope.model;

        // TODO: destroy 3d-preview
    };

    $scope.removePoint = function( point ) {
        $scope.model.points.splice( $scope.model.points.indexOf( point ), 1 );
    };

    $scope.addPoint = function() {
        $scope.model.points.push( {} );
    };

    $scope.show3D = function() {
        $( '#container' ).show();
        previewEngine.initEngine( $scope.model );

        $scope.$watch( 'model.points', function() {
            previewEngine.loadSprites( $scope.model.points );
        }, true );
    };
}

angular.module( 'panoramasManager' ).controller( 'PanoramasController', PanoramasController );