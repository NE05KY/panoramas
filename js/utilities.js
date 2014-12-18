function animate() {
	requestAnimationFrame( animate );
	update();
	
	stats.update();
}

function update() {
	if ( isUserInteracting === false ) {
		lon += 0.1;
	}

	lat = Math.max( - 85, Math.min( 85, lat ) );
	phi = THREE.Math.degToRad( 90 - lat );
	theta = THREE.Math.degToRad( lon );

	camera.target.x = 500 * Math.sin( phi ) * Math.cos( theta );
	camera.target.y = 500 * Math.cos( phi );
	camera.target.z = 500 * Math.sin( phi ) * Math.sin( theta );

	camera.lookAt( camera.target );
	renderer.render( scene, camera );
}

function zoom( ratio ) {
	var minZoom = 45,
	maxZoom = 75;

	if ( ( camera.fov > minZoom && ratio > 0) || 
	 	 ( camera.fov < maxZoom && ratio < 0) ) {
		camera.fov -= event.wheelDeltaY * 0.05;
	}

	camera.updateProjectionMatrix();
}

function maxZoom(callback) {
	camera.fov-=2;
	camera.updateProjectionMatrix();

	if (camera.fov > 1) {
		setTimeout(function() {maxZoom(callback)}, 1);
	}
	else {
		callback();
	}
}

function minZoom() {
	camera.fov+=2;
	camera.updateProjectionMatrix();

	if (camera.fov < 75) {
		setTimeout(minZoom, 1)
	}
}


function debugStats() {
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );
}

function transit(texture) {
	maxZoom(function() {
		minZoom();
		scene.children[0].material.map = THREE.ImageUtils.loadTexture( '/storage/2.jpg' );	
	})
}