'use strict';

angular.module( 'panoramasManager' ).factory( 'panoramaEngine', [ '$resource',
        function() {
            var vm = this;

            vm.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
            vm.renderer = new THREE.WebGLRenderer();
            vm.itemGeometry = new THREE.PlaneBufferGeometry( 35, 35 );
            vm.pointMapHovered = THREE.ImageUtils.loadTexture( '/styles/icon-hover.png' );
            vm.pointMap = THREE.ImageUtils.loadTexture( '/styles/icon.png' );
            vm.isUserInteracting = false;
            vm.elements = [];
            vm.mouse = { x: 0, y: 0 };
            vm.lon = 0;
            vm.lat = 0;
            vm.phi = 0;
            vm.theta = 0;
            vm.startX = 0;
            vm.startY = 0;
            vm.startLon = 0;
            vm.startLat = 0;

            vm.initEngine = function( panorama ) {
                var container, mesh;

                vm.panorama = panorama;

                container = document.getElementById( 'container' );

                vm.camera.target = new THREE.Vector3( 0, 0, 0 );

                vm.scene = new THREE.Scene();

                var geometry = new THREE.SphereGeometry( 500, 60, 40 );
                geometry.applyMatrix( new THREE.Matrix4().makeScale( -1, 1, 1 ) );

                var material = new THREE.MeshBasicMaterial( {
                    map: THREE.ImageUtils.loadTexture( '/api/textures/' + vm.panorama.file, null )
                } );

                mesh = new THREE.Mesh( geometry, material );

                if ( vm.scene.children.length > 0 ) {
                    vm.scene.remove( vm.scene.children[ 0 ] );
                }

                vm.scene.add( mesh );

                vm.loadSprites( vm.panorama.points );

                vm.renderer.setSize( $( '#container' ).width(), $( '#container' ).height() );
                container.appendChild( vm.renderer.domElement );

                if ( vm.debugStats ) {
                    vm.debugStats( container );
                }

                document.addEventListener( 'mousedown', vm.onDocumentMouseDown, false );
                document.addEventListener( 'mousemove', vm.onDocumentMouseMove, false );
                document.addEventListener( 'mouseup', vm.onDocumentMouseUp, false );
                window.addEventListener( 'resize', vm.onWindowResize, false );

                vm.animate();
            };

            vm.animate = function() {
                requestAnimationFrame( vm.animate );
                vm.update();

                if ( vm.debugStats ) {
                    vm.stats.update();
                }
            };

            vm.update = function() {
                var vector = new THREE.Vector3( vm.mouse.x, vm.mouse.y, 1 );
                vector.unproject( vm.camera );

                var raycaster = new THREE.Raycaster();
                raycaster.set( vm.camera.position, vector.sub( vm.camera.position ).normalize() );

                var intersects = raycaster.intersectObjects( vm.elements );

                if ( intersects.length > 0 ) {
                    if ( vm.INTERSECTED !== intersects[ 0 ].object ) {
                        if ( vm.INTERSECTED ) {
                            vm.INTERSECTED.material.map = vm.pointMapHovered;
                        }
                        vm.INTERSECTED = intersects[ 0 ].object;
                        vm.INTERSECTED.material.map = vm.pointMapHovered;
                    }
                } else {
                    if ( vm.INTERSECTED ) {
                        vm.INTERSECTED.material.map = vm.pointMap;
                    }
                    vm.INTERSECTED = null;
                }

                if ( !vm.isUserInteracting && vm.sphereRotation ) {
                    vm.lon += 0.1;
                }

                vm.lat = Math.max( -85, Math.min( 85, vm.lat ) );
                vm.phi = THREE.Math.degToRad( 90 - vm.lat );
                vm.theta = THREE.Math.degToRad( vm.lon );

                vm.camera.target.x = 500 * Math.sin( vm.phi ) * Math.cos( vm.theta );
                vm.camera.target.y = 500 * Math.cos( vm.phi );
                vm.camera.target.z = 500 * Math.sin( vm.phi ) * Math.sin( vm.theta );

                vm.camera.lookAt( vm.camera.target );
                vm.renderer.render( vm.scene, vm.camera );
            };

            vm.loadSprites = function( sprites ) {
                vm.elements = [];
                vm.scene.children.length = 1;

                if ( sprites ) {
                    sprites.forEach( function( item ) {
                        var sprite = new THREE.Mesh( vm.itemGeometry, new THREE.MeshBasicMaterial( {
                            map: vm.pointMap,
                            transparent: true
                        } ) );

                        sprite.position.x = item.x;
                        sprite.position.y = item.y;
                        sprite.position.z = item.z;
                        sprite.panoId = item.id;
                        sprite.position.normalize();
                        sprite.position.multiplyScalar( 497 );
                        sprite.lookAt( vm.camera.position );

                        vm.elements.push( sprite );
                        vm.scene.add( sprite );
                    } );
                }
            };

            vm.onWindowResize = function() {
                vm.camera.aspect = window.innerWidth / window.innerHeight;
                vm.camera.updateProjectionMatrix();

                vm.renderer.setSize( $( '#container' ).width(), $( '#container' ).height() );
            };

            vm.onDocumentMouseDown = function( event ) {
                vm.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
                vm.mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;

                var vector = new THREE.Vector3( vm.mouse.x, vm.mouse.y, 1 );
                vector.unproject( vm.camera );
                var ray = new THREE.Raycaster( vm.camera.position, vector.sub( vm.camera.position ).normalize() );
                var intersects = ray.intersectObjects( vm.elements );

                if ( intersects.length ) {
                    location.hash = intersects[ 0 ].object.panoId;
                }

                vm.isUserInteracting = true;

                vm.startX = event.clientX;
                vm.startY = event.clientY;

                vm.startLon = vm.lon;
                vm.startLat = vm.lat;
            };

            vm.onDocumentMouseMove = function( event ) {
                if ( vm.isUserInteracting ) {
                    vm.lon = ( vm.startX - event.clientX ) * 0.1 + vm.startLon;
                    vm.lat = ( event.clientY - vm.startY ) * 0.1 + vm.startLat;
                }

                vm.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
                vm.mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
            };

            vm.onDocumentMouseUp = function() {
                vm.isUserInteracting = false;
            };

            return {
                initEngine: vm.initEngine,
                loadSprites: vm.loadSprites
            };

        }
    ]
);