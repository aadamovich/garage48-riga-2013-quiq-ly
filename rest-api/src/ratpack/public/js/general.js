jQuery(document).ready(function() { 

	// Navigation
	$('#answer a').click( function() {
			
		var activeSlide = $(this).attr('data-slide');

		if (activeSlide == 0) {
			
			$(this).attr('data-slide', 1);					
			$(this).text('Next Q');			
			slideContent(activeSlide);			
            
		} else if (activeSlide == -1) {

			$(this).attr('data-slide', 0);
			$(this).text('Back');
			answerQuestion();			
			slideContent(activeSlide);
			
		} else {
			
			$(this).attr('data-slide', 2);
			$(this).attr('href', '/question/random');
			return true;
			
		}
		
		return false;
		
	});

});

function slideContent(activeSlide) {
	$('#content').animate({
	  left : (100 * (activeSlide)) + "%"
	}, 1000, function() {
		if (activeSlide == -1) {				
			drawChart(getData());
		}
	});	
}

function answerQuestion() {
  $.ajax({
	  type: "POST",
	  url: "/api/answers/new",
	  data: 
		'{ ' +
		   '"question_id": "' + $('#question_id').val() + '",' +
		   '"title": "' + $('.answers input').filter(':checked').val() + '"' + 
		'}',
	  dataType: "json"
	});
  $('#answer a').href = '/question/random'
}


// Draws a chart.
function drawChart(data) {

  // Get context with jQuery - using jQuery's .get() method.
  var ctx = $("#myChart").get(0).getContext("2d");
  // This will get the first returned node in the jQuery collection.
  var myNewChart = new Chart(ctx).Doughnut(data);

}

