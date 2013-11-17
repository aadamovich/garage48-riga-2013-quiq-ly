jQuery(document).ready(function() { 

	// Navigation
	$('#answer a').click( function() {
			
		var activeSlide = $(this).attr('data-slide');

		if (activeSlide == -1) {

			$(this).attr('data-slide', 0);
			$(this).text('Next Q');
			answerQuestion();			
			slideChart();
			
		} else if (activeSlide == 0) {
			
			$(this).attr('data-slide', -1);					
			$(this).text('Answer');		
			loadQuestion();
			slideQuestion();			
            
		} 
		
		return false;
		
	});

});

function slideChart() {
	$('#content').animate({ left : "-100%" }, 1000, function() { drawChart(getData()); } );	
}

function slideQuestion() {
	$('#content').animate({ left : "0%" }, 1000, function() {});	
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

function loadQuestion() {
  $.getJSON( "/api/questions/random1", function(data) {
	  $('#question_id').val(data._id);
	  $('#qtitle h1').text(data.title);
	  var newAnswers = '<ul class="answers">'
	  for (var i = 0; i < data.answers.length; i++) {
		  var answer = data.answers[i].title
		  var color = data.answers[i].color
		  var value = data.answers[i].value		  
		  newAnswers += '<li><input type="radio" value="' + answer + '" id="' + answer + '" name="select" data-color="' + color + '" data-value="' + value + '"><label for="' + answer + '">' + answer + '</label></li>'
	  }
	  newAnswers += '</ul>' 
       $('.answers').replaceWith(newAnswers) 
  })
}

// Draws a chart.
function drawChart(data) {

  // Get context with jQuery - using jQuery's .get() method.
  var ctx = $("#myChart").get(0).getContext("2d");
  
  // This will get the first returned node in the jQuery collection.
  var myNewChart = new Chart(ctx).Doughnut(data);

}

function getData() {
	var data = []
    $.each( $('.answers li'), function(index, item) {
    	data.push({
            value: parseInt($(item).children('input[type=radio]').attr('data-value')),
            color: $(item).children('input[type=radio]').attr('data-color')    		
    	})
    });	
    return data;
}  
