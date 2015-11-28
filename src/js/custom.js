/*!
 * Custom JS for the Airware Makers blog
 */

$(document).ready(function() {

	// Open certain links in new window
	$('a.external').click(function() {
		window.open( $(this).attr('href') );
		return false;
	});

});