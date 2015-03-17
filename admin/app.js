'use strict';

var panoramaManager = angular.module( 'panoramaManager', [ 'ngRoute', 'ngResource', 'angularFileUpload' ] );

panoramaManager.config( [ '$routeProvider',
    function( $routeProvider ) {
        $routeProvider.
            when( '/panoramas', {
                controller: 'PanoramasCtrl'
            } ).
            otherwise( {
                redirectTo: '/panoramas'
            } );
    } ] );

panoramaManager.factory( 'Panorama', [ '$resource',
    function( $resource ) {
        return $resource( '/api/index.php/:id', { id: '@id' }, {
            'save': {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }
        } );
    } ] );

panoramaManager.controller( 'PanoramasCtrl', [ '$scope', 'Panorama', 'FileUploader',
    function( $scope, Panorama, FileUploader ) {
        $scope.uploader = new FileUploader( {
            url: '/api/index.php',
            queueLimit: 1
        } );

        $scope.panoramas = Panorama.query();

        $scope.remove = function( pano ) {
            if ( confirm( 'Delete pano?' ) ) {
                pano.$delete();
                $scope.panoramas.splice( $scope.panoramas.indexOf( pano ), 1 );
            }
        };

        $scope.edit = function( pano ) {
            $scope.model = pano;

            $( '#editModal' ).foundation( 'reveal', 'open' );
        };

        $scope.new = function() {
            $scope.model = {};

            $( '#editModal' ).foundation( 'reveal', 'open' );
        };

        $scope.save = function() {
            $scope.uploader.queue[ 0 ].upload();

            //$scope.model.$save();
        };
    } ] );

panoramaManager.directive( 'ngThumb', [ '$window', function( $window ) {
    var helper = {
        support: !!($window.FileReader && $window.CanvasRenderingContext2D),
        isFile: function( item ) {
            return angular.isObject( item ) && item instanceof $window.File;
        },
        isImage: function( file ) {
            var type = '|' + file.type.slice( file.type.lastIndexOf( '/' ) + 1 ) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf( type ) !== -1;
        }
    };

    return {
        restrict: 'A',
        template: '<canvas/>',
        link: function( scope, element, attributes ) {
            if ( !helper.support ) return;

            var params = scope.$eval( attributes.ngThumb );

            if ( !helper.isFile( params.file ) ) return;
            if ( !helper.isImage( params.file ) ) return;

            var canvas = element.find( 'canvas' );
            var reader = new FileReader();

            reader.onload = onLoadFile;
            reader.readAsDataURL( params.file );

            function onLoadFile( event ) {
                var img = new Image();
                img.onload = onLoadImage;
                img.src = event.target.result;
            }

            function onLoadImage() {
                var width = params.width || this.width / this.height * params.height;
                var height = params.height || this.height / this.width * params.width;
                canvas.attr( { width: width, height: height } );
                canvas[ 0 ].getContext( '2d' ).drawImage( this, 0, 0, width, height );
            }
        }
    };
} ] );