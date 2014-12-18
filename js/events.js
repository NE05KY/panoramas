var startX = 0, startY = 0
	startLon = 0, startLat = 0;

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentTouchStart( event ) {
	isUserInteracting = true;

	startX = event.changedTouches[0].clientX;
	startY = event.changedTouches[0].clientY;

	startLon = lon;
	startLat = lat;
}

function onDocumentTouchMove( event ) {
	if ( isUserInteracting === true ) {
		lon = ( startX - event.changedTouches[0].clientX ) * 0.1 + startLon;
		lat = ( event.changedTouches[0].clientY - startY ) * 0.1 + startLat;
	}
}

function onDocumentTouchEnd( event ) {
	isUserInteracting = false;
}


function onDocumentMouseDown( event ) {
	isUserInteracting = true;

	startX = event.clientX;
	startY = event.clientY;

	startLon = lon;
	startLat = lat;

}

function onDocumentMouseMove( event ) {
	if ( isUserInteracting === true ) {
		lon = ( startX - event.clientX ) * 0.1 + startLon;
		lat = ( event.clientY - startY ) * 0.1 + startLat;
	}
}

function onDocumentMouseUp( event ) {
	isUserInteracting = false;
}

function onDocumentMouseWheel( event ) {
	zoom(event.wheelDeltaY);
}