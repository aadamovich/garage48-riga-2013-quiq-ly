jQuery(document).ready(function() { 

	// Open Statistics
	$('#device-display a').click(function(){
		$('#device-display a').removeClass('selected');
		$(this).addClass('selected');
		$('#content').animate({
			left: "300px"
		}, 900);
		$('#main-nav').animate({
			left: "0px"
		}, 900);

		return false;
	});

 });

