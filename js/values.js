panoramaApp.value( 'Config', {
    //
    isUserInteracting: false,
    // Array for transitions sprite
    elements: [],
    //
    mouse: { x: 0, y: 0 },  // .x .y ??

    // Three.js objects
    camera: undefined,
    renderer: undefined,
    itemGeometry: undefined,
    // sprite texture
    pointMapHovered: THREE.ImageUtils.loadTexture( "/styles/icon-uh.png" ),
    pointMap: THREE.ImageUtils.loadTexture( "/styles/icon.png" ),

    //
    lon: 0, lat: 0,
    phi: 0, theta: 0
} );