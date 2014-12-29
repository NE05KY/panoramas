'use strict';

panoramaApp.controller( 'panoramaController',
    [ '$scope', '$location', 'Panorama', 'Config',
        function( $scope, $location, Panorama, Config ) {
            // creating Three.js objects
            $scope.itemGeometry = new THREE.PlaneBufferGeometry( 35, 35 );
            $scope.pointMapHovered = THREE.ImageUtils.loadTexture( "/styles/icon-uh.png" );
            $scope.pointMap = THREE.ImageUtils.loadTexture( "/styles/icon.png" );
            $scope.mouse = new THREE.Vector2();

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
                if ( id ) {
                    $scope.panorama = Panorama.get( { id: id } );
                } else {
                    $scope.panorama = Panorama.get( { id: 1 } );
                }
            } );


            $scope.initEngine = function() {
                var container, mesh;

                container = document.getElementById( 'container' );

                $scope.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
                $scope.camera.target = new THREE.Vector3( 0, 0, 0 );

                $scope.scene = new THREE.Scene();

                var geometry = new THREE.SphereGeometry( 500, 60, 40 );
                geometry.applyMatrix( new THREE.Matrix4().makeScale( -1, 1, 1 ) );

                var material = new THREE.MeshBasicMaterial( {
                    map: THREE.ImageUtils.loadTexture( '/storage/img/1.jpg' )
                } );

                mesh = new THREE.Mesh( geometry, material );

                if ( $scope.scene.children.length > 0 ) {
                    $scope.scene.remove( $scope.scene.children[ 0 ] );
                }

                $scope.scene.add( mesh );


                // adding sprite
                var sprite = new THREE.Mesh( $scope.itemGeometry, new THREE.MeshBasicMaterial( {
                    map: $scope.pointMap,
                    transparent: true
                } ) );

                sprite.position.x = -290;
                sprite.position.y = -120;
                sprite.position.z = 500;
                sprite.href = '/storage/img/2.jpg';
                sprite.position.normalize();
                sprite.position.multiplyScalar( 497 );
                sprite.lookAt( $scope.camera.position );

                Config.elements.push( sprite );
                $scope.scene.add( sprite );

                $scope.renderer = new THREE.WebGLRenderer();
                $scope.renderer.setSize( window.innerWidth, window.innerHeight );
                container.appendChild( $scope.renderer.domElement );

                // TODO: enable debug stats
                //debugStats();

                // TODO: fix events
                //document.addEventListener( 'mousedown', Events.onDocumentMouseDown, false );
                //document.addEventListener( 'mousemove', Events.onDocumentMouseMove, false );
                //document.addEventListener( 'mouseup', Events.onDocumentMouseUp, false );
                //
                //document.addEventListener( 'touchstart', Events.onDocumentTouchStart, false );
                //document.addEventListener( 'touchmove', Events.onDocumentTouchMove, false );
                //document.addEventListener( 'touchend', Events.onDocumentTouchEnd, false );
                //
                //document.addEventListener( 'mousewheel', Events.onDocumentMouseWheel, false );
                //
                //window.addEventListener( 'resize', Events.onWindowResize, false );
            };

            $scope.animate = function() {
                requestAnimationFrame( $scope.animate );
                $scope.update();

                //stats.update();
            };

            $scope.update = function() {
                var vector = new THREE.Vector3( $scope.mouse.x, $scope.mouse.y, 1 );
                vector.unproject( $scope.camera );

                var raycaster = new THREE.Raycaster();
                raycaster.set( $scope.camera.position, vector.sub( $scope.camera.position ).normalize() );

                var intersects = raycaster.intersectObjects( Config.elements );

                if ( intersects.length > 0 ) {
                    if ( $scope.INTERSECTED != intersects[ 0 ].object ) {
                        if ( $scope.INTERSECTED ) $scope.INTERSECTED.material.map = pointMapHovered;
                        $scope.INTERSECTED = intersects[ 0 ].object;
                        $scope.INTERSECTED.material.map = pointMapHovered;
                    }
                } else {
                    if ( $scope.INTERSECTED ) $scope.INTERSECTED.material.map = pointMap;
                    $scope.INTERSECTED = null;
                }

                // TODO: move to switch
                if ( !Config.isUserInteracting ) Config.lon += 0.1;

                Config.lat = Math.max( -85, Math.min( 85, Config.lat ) );
                Config.phi = THREE.Math.degToRad( 90 - Config.lat );
                Config.theta = THREE.Math.degToRad( Config.lon );

                $scope.camera.target.x = 500 * Math.sin( Config.phi ) * Math.cos( Config.theta );
                $scope.camera.target.y = 500 * Math.cos( Config.phi );
                $scope.camera.target.z = 500 * Math.sin( Config.phi ) * Math.sin( Config.theta );

                $scope.camera.lookAt( $scope.camera.target );
                $scope.renderer.render( $scope.scene, $scope.camera );
            };

            $scope.initEngine();
            $scope.animate();



        }
    ]
);