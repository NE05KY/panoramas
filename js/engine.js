var camera, scene, renderer;

var isUserInteracting = false,
	lon = 0, lat = 0,
	phi = 0, theta = 0;

init();
animate();

function init() {
	var container, mesh;

	container = document.getElementById( 'container' );

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
	camera.target = new THREE.Vector3( 0, 0, 0 );

	scene = new THREE.Scene();

	var geometry = new THREE.SphereGeometry( 500, 60, 40 );
	geometry.applyMatrix( new THREE.Matrix4().makeScale( -1, 1, 1 ) );
	
	var material = new THREE.MeshBasicMaterial ( {
		map: THREE.ImageUtils.loadTexture( '/storage/1.jpg' ),
	} );

	img1 = new Image();
		img1.src = "/storage/2.jpg";

	mesh = new THREE.Mesh( geometry, material );

	if (scene.children.length > 0) {
		scene.remove(scene.children[0]);
	}
	
	scene.add( mesh );

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	debugStats()

	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mouseup', onDocumentMouseUp, false );

	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );
	document.addEventListener( 'touchend', onDocumentTouchEnd, false );

	document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );

	document.addEventListener( 'click', transit, false );

	window.addEventListener( 'resize', onWindowResize, false );

		
}