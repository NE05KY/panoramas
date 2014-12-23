var camera, scene, renderer;
var mouse = new THREE.Vector2(), INTERSECTED;

var isUserInteracting = false,
    lon = 0, lat = 0,
    phi = 0, theta = 0;

var elements = [];

var itemGeometry = new THREE.PlaneBufferGeometry( 35, 35 ),
    pointMapHovered = THREE.ImageUtils.loadTexture( "/styles/icon-uh.png" ),
    pointMap = THREE.ImageUtils.loadTexture( "/styles/icon.png" );

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

    var material = new THREE.MeshBasicMaterial( {
        map: THREE.ImageUtils.loadTexture( '/storage/img/1.jpg' )
    } );

    mesh = new THREE.Mesh( geometry, material );

    if ( scene.children.length > 0 ) {
        scene.remove( scene.children[ 0 ] );
    }

    scene.add( mesh );


    // adding sprite
    var sprite = new THREE.Mesh( itemGeometry, new THREE.MeshBasicMaterial( {
        map: pointMap,
        transparent: true
    } ) );

    sprite.position.x = -290;
    sprite.position.y = -120;
    sprite.position.z = 500;
    sprite.href = '/storage/img/2.jpg';
    sprite.position.normalize();
    sprite.position.multiplyScalar( 497 );
    sprite.lookAt( camera.position );

    elements.push( sprite );
    scene.add( sprite );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    debugStats();

    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mouseup', onDocumentMouseUp, false );

    document.addEventListener( 'touchstart', onDocumentTouchStart, false );
    document.addEventListener( 'touchmove', onDocumentTouchMove, false );
    document.addEventListener( 'touchend', onDocumentTouchEnd, false );

    document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );

    window.addEventListener( 'resize', onWindowResize, false );

    window.onload = function() {
        // testing preload function
        img2 = new Image();
        img2.src = "/storage/img/2.jpg";
    }
}