jQuery(document).ready(function() { 

	// Navigation
	$('#answer a').click(function(){
		var activeSlide = $(this).attr('data-slide');

		if(activeSlide == 0) {
			$(this).attr('data-slide', -1);
		} else {
			$(this).attr('data-slide', 0);
		}

		$('#content').animate({
		  left : (100*(activeSlide)) + "%"
		}, 1000, function() {
			if(activeSlide == -1) {				
				drawChart(getData());
			}
		});

		return false;
	});

 });

// Draws a chart.
function drawChart(data) {

  // Get context with jQuery - using jQuery's .get() method.
  var ctx = $("#myChart").get(0).getContext("2d");
  // This will get the first returned node in the jQuery collection.
  var myNewChart = new Chart(ctx).Doughnut(data);

}

