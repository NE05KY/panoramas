'use strict';

panoramaApp.controller( 'panoramaController',
    [ '$scope', '$location', 'Panoramas', 'Config', 'Events',
        function( $scope, $location, Panoramas, Config, Events ) {
            // get all panoramas from server
            //$scope.panoramas = Panorama.query();

            $scope.$watch( function() {
                    return $location.hash();
                },
                function( id ) {
                    $scope.id = id;
                }
            );

            $scope.$watch( 'id', function( id ) {
                id = parseInt( id );
                if ( isNaN( id ) ) id = Config.defaultId;

                $scope.panorama = Panoramas.get( { id: id }, function() {
                    $scope.panorama.points = JSON.parse( $scope.panorama.points );
                    $scope.panorama.file = Config.img_path + $scope.panorama.file;
                    if ( !$scope.scene ) {
                        $scope.initEngine();
                    } else {
                        $scope.switchPanorama();
                    }
                    console.log( $scope.panorama );
                } );
            } );

            $scope.initEngine = function() {
                var container, mesh;

                container = document.getElementById( 'container' );

                Config.camera.target = new THREE.Vector3( 0, 0, 0 );

                $scope.scene = new THREE.Scene();

                var geometry = new THREE.SphereGeometry( 500, 60, 40 );
                geometry.applyMatrix( new THREE.Matrix4().makeScale( -1, 1, 1 ) );

                var material = new THREE.MeshBasicMaterial( {
                    map: THREE.ImageUtils.loadTexture( $scope.panorama.file )
                } );

                mesh = new THREE.Mesh( geometry, material );

                if ( $scope.scene.children.length > 0 ) {
                    $scope.scene.remove( $scope.scene.children[ 0 ] );
                }

                $scope.scene.add( mesh );

                $scope.loadSprites( $scope.panorama.points );

                Config.renderer.setSize( window.innerWidth, window.innerHeight );
                container.appendChild( Config.renderer.domElement );

                if ( Config.debugStats ) $scope.debugStats( container );

                document.addEventListener( 'mousedown', Events.onDocumentMouseDown, false );
                document.addEventListener( 'mousemove', Events.onDocumentMouseMove, false );
                document.addEventListener( 'mouseup', Events.onDocumentMouseUp, false );

                document.addEventListener( 'touchstart', Events.onDocumentTouchStart, false );
                document.addEventListener( 'touchmove', Events.onDocumentTouchMove, false );
                document.addEventListener( 'touchend', Events.onDocumentTouchEnd, false );

                document.addEventListener( 'mousewheel', Events.onDocumentMouseWheel, false );

                window.addEventListener( 'resize', Events.onWindowResize, false );

                $scope.animate();
            };

            $scope.animate = function() {
                requestAnimationFrame( $scope.animate );
                $scope.update();

                if ( Config.debugStats ) $scope.stats.update();
            };

            $scope.update = function() {
                var vector = new THREE.Vector3( Config.mouse.x, Config.mouse.y, 1 );
                vector.unproject( Config.camera );

                var raycaster = new THREE.Raycaster();
                raycaster.set( Config.camera.position, vector.sub( Config.camera.position ).normalize() );

                var intersects = raycaster.intersectObjects( Config.elements );

                if ( intersects.length > 0 ) {
                    if ( $scope.INTERSECTED != intersects[ 0 ].object ) {
                        if ( $scope.INTERSECTED ) $scope.INTERSECTED.material.map = Config.pointMapHovered;
                        $scope.INTERSECTED = intersects[ 0 ].object;
                        $scope.INTERSECTED.material.map = Config.pointMapHovered;
                    }
                } else {
                    if ( $scope.INTERSECTED ) $scope.INTERSECTED.material.map = Config.pointMap;
                    $scope.INTERSECTED = null;
                }

                if ( !Config.isUserInteracting && Config.sphereRotation ) Config.lon += 0.1;

                Config.lat = Math.max( -85, Math.min( 85, Config.lat ) );
                Config.phi = THREE.Math.degToRad( 90 - Config.lat );
                Config.theta = THREE.Math.degToRad( Config.lon );

                Config.camera.target.x = 500 * Math.sin( Config.phi ) * Math.cos( Config.theta );
                Config.camera.target.y = 500 * Math.cos( Config.phi );
                Config.camera.target.z = 500 * Math.sin( Config.phi ) * Math.sin( Config.theta );

                Config.camera.lookAt( Config.camera.target );
                Config.renderer.render( $scope.scene, Config.camera );
            };

            $scope.debugStats = function( container ) {
                $scope.stats = new Stats();
                $scope.stats.domElement.style.position = 'absolute';
                $scope.stats.domElement.style.top = '0px';
                $scope.stats.domElement.style.zIndex = 100;
                container.appendChild( $scope.stats.domElement );
            };

            $scope.loadSprites = function( points ) {
                // flush sprites array
                Config.elements = [];
                $scope.scene.children.length = 1;

                points.forEach( function( item ) {
                    var sprite = new THREE.Mesh( Config.itemGeometry, new THREE.MeshBasicMaterial( {
                        map: Config.pointMap,
                        transparent: true
                    } ) );

                    sprite.position.x = item.x;
                    sprite.position.y = item.y;
                    sprite.position.z = item.z;
                    sprite.pano_id = item.id;
                    sprite.position.normalize();
                    sprite.position.multiplyScalar( 497 );
                    sprite.lookAt( Config.camera.position );

                    Config.elements.push( sprite );
                    $scope.scene.add( sprite );
                } );
            };

            $scope.switchPanorama = function() {
                $scope.scene.children[ 0 ].material.map = THREE.ImageUtils.loadTexture( $scope.panorama.file );
                $scope.loadSprites( $scope.panorama.points );
            };

            $scope.preLoadTextures = function() {

            };
        }
    ]
);