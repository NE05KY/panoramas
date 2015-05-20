'use strict';


function PanoramaController( $scope, $location, Panoramas, Config, Events ) {
    var vm = this;

    vm.header = '';

    $scope.$watch( function() {
            return $location.hash();
        },
        function( id ) {
            $scope.id = id;
        }
    );

    $scope.$watch( 'id', function( id ) {
        if ( !vm.scene ) {
            Panoramas.query( vm.initEngine );
        } else {
            vm.panorama = Panoramas.get( id );
            vm.switchPanorama();
            vm.header = vm.panorama.name;
        }
    } );

    vm.initEngine = function() {
        var container, mesh;

        vm.panorama = Panoramas.get( $scope.id );
        vm.header = vm.panorama.name;

        container = document.getElementById( 'container' );

        Config.camera.target = new THREE.Vector3( 0, 0, 0 );

        vm.scene = new THREE.Scene();

        var geometry = new THREE.SphereGeometry( 500, 60, 40 );
        geometry.applyMatrix( new THREE.Matrix4().makeScale( -1, 1, 1 ) );

        var material = new THREE.MeshBasicMaterial( {
            map: THREE.ImageUtils.loadTexture( vm.panorama.file, null, vm.hideSpinner )
        } );

        mesh = new THREE.Mesh( geometry, material );

        if ( vm.scene.children.length > 0 ) {
            vm.scene.remove( vm.scene.children[ 0 ] );
        }

        vm.scene.add( mesh );

        vm.loadSprites();

        Config.renderer.setSize( window.innerWidth, window.innerHeight );
        container.appendChild( Config.renderer.domElement );

        if ( Config.debugStats ) {
            vm.debugStats( container );
        }

        document.addEventListener( 'mousedown', Events.onDocumentMouseDown, false );
        document.addEventListener( 'mousemove', Events.onDocumentMouseMove, false );
        document.addEventListener( 'mouseup', Events.onDocumentMouseUp, false );

        document.addEventListener( 'touchstart', Events.onDocumentTouchStart, false );
        document.addEventListener( 'touchmove', Events.onDocumentTouchMove, false );
        document.addEventListener( 'touchend', Events.onDocumentTouchEnd, false );

        document.addEventListener( 'mousewheel', Events.onDocumentMouseWheel, false );

        window.addEventListener( 'resize', Events.onWindowResize, false );

        vm.animate();
    };

    vm.animate = function() {
        requestAnimationFrame( vm.animate );
        vm.update();

        if ( Config.debugStats ) {
            vm.stats.update();
        }
    };

    vm.update = function() {
        var vector = new THREE.Vector3( Config.mouse.x, Config.mouse.y, 1 );
        vector.unproject( Config.camera );

        var raycaster = new THREE.Raycaster();
        raycaster.set( Config.camera.position, vector.sub( Config.camera.position ).normalize() );

        var intersects = raycaster.intersectObjects( Config.elements );

        if ( intersects.length > 0 ) {
            if ( vm.INTERSECTED !== intersects[ 0 ].object ) {
                if ( vm.INTERSECTED ) {
                    vm.INTERSECTED.material.map = Config.pointMapHovered;
                }
                vm.INTERSECTED = intersects[ 0 ].object;
                vm.INTERSECTED.material.map = Config.pointMapHovered;
            }
        } else {
            if ( vm.INTERSECTED ) {
                vm.INTERSECTED.material.map = Config.pointMap;
            }
            vm.INTERSECTED = null;
        }

        if ( !Config.isUserInteracting && Config.sphereRotation ) {
            Config.lon += 0.1;
        }

        Config.lat = Math.max( -85, Math.min( 85, Config.lat ) );
        Config.phi = THREE.Math.degToRad( 90 - Config.lat );
        Config.theta = THREE.Math.degToRad( Config.lon );

        Config.camera.target.x = 500 * Math.sin( Config.phi ) * Math.cos( Config.theta );
        Config.camera.target.y = 500 * Math.cos( Config.phi );
        Config.camera.target.z = 500 * Math.sin( Config.phi ) * Math.sin( Config.theta );

        Config.camera.lookAt( Config.camera.target );
        Config.renderer.render( vm.scene, Config.camera );
    };

    vm.debugStats = function( container ) {
        vm.stats = new Stats();
        vm.stats.domElement.style.position = 'absolute';
        vm.stats.domElement.style.top = '0px';
        vm.stats.domElement.style.zIndex = 100;
        container.appendChild( vm.stats.domElement );
    };

    vm.loadSprites = function() {
        // flush sprites array
        Config.elements = [];
        vm.scene.children.length = 1;

        if ( vm.panorama.points ) {
            vm.panorama.points.forEach( function( item ) {
                var sprite = new THREE.Mesh( Config.itemGeometry, new THREE.MeshBasicMaterial( {
                    map: Config.pointMap,
                    transparent: true
                } ) );

                sprite.position.x = item.x;
                sprite.position.y = item.y;
                sprite.position.z = item.z;
                sprite.panoId = item.id;
                sprite.position.normalize();
                sprite.position.multiplyScalar( 497 );
                sprite.lookAt( Config.camera.position );

                Config.elements.push( sprite );
                vm.scene.add( sprite );
            } );
        }
    };

    vm.switchPanorama = function() {
        vm.scene.children[ 0 ].material.map = THREE.ImageUtils.loadTexture( vm.panorama.file, null, vm.preLoadTextures() );
        vm.loadSprites();
    };

    vm.preLoadTextures = function() {
        if ( vm.panorama.points ) {
            vm.panorama.points.forEach( function( item ) {
                var siblingPano = Panoramas.get( item.id );
                if ( siblingPano.file ) {
                    new Image().src = siblingPano.file;
                }
            } );
        }
    };

    vm.hideSpinner = function() {
        document.getElementById( 'container' ).style.display = 'block';
        document.getElementById( 'spinner' ).style.display = 'none';

        vm.preLoadTextures();
        vm.generateList();
    };

    vm.generateList = function( ) {
        console.log(vm.searchQuery);
        vm.panoramas = Panoramas.findByName( vm.searchQuery );
        console.log(vm.panoramas);
    }
}

angular.module( 'panoramas' ).controller( 'PanoramaController', PanoramaController );