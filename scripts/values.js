panoramaApp.value( 'Config', {
    /* CONSTANTS */

    api_link: "/storage/panoramas/:id",     // link to RESTful API
    minZoom: 45,                            // zooming limit
    maxZoom: 75,                            //
    sphereRotation: true,                   // permanent sphere rotation
    debugStats: true,                       // showing FPS

    /* VARIABLES */

    isUserInteracting: false,               // mouse or touch move
    elements: [],                           // array for transitions sprites
    mouse: { x: 0, y: 0 },                  // mouse coordinates
    lon: 0, lat: 0,                         // 3d coordinates
    phi: 0, theta: 0,                       //

    /* Three.js basic objects */

    camera: new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 ),
    renderer: new THREE.WebGLRenderer(),
    itemGeometry: new THREE.PlaneBufferGeometry( 35, 35 ),
    // sprite texture
    pointMapHovered: THREE.ImageUtils.loadTexture( "/styles/icon-hover.png" ),
    pointMap: THREE.ImageUtils.loadTexture( "/styles/icon.png" )

} );