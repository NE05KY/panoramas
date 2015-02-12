'use strict';

var panoramaManager = angular.module( 'panoramaManager', [ 'ngRoute', 'ngResource' ] );

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
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }
        } );
    } ] );

panoramaManager.controller( 'PanoramasCtrl', [ '$scope', 'Panorama',
    function( $scope, Panorama ) {
        $scope.panoramas = Panorama.query();

        $scope.remove = function() {
            $( '#editModal' ).foundation( 'reveal', 'close' );

            $scope.model.$delete();

            $scope.panoramas.splice( $scope.panoramas.indexOf( $scope.model ), 1 );
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
            $scope.model.$save();
        }
    } ] );