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
		
	$('#back a').click(function(){
		var activeSlide = $(this).attr('data-slide');

		switch (activeSlide) {
			case "1":
				$(this).attr('data-slide', 0);
				$("#next a").attr('data-slide', 1);

				$(".hrline1").removeClass("active");
				$(".bubble2").removeClass("active");
				break;

			case "2":
				$(this).attr('data-slide', 1);
				$("#next a").attr('data-slide', 2);

				$(".hrline2").removeClass("active");
				$(".bubble3").removeClass("active");
				$("#next a").html("NEXT");
				$("#preview").css("display","none");
				$(this).parent().css("width","50%");
				break;
		}

		$('#content').animate({
		  left : "-" + ((activeSlide-1)*100) + "%"
		}, 1000);

		if(activeSlide != 0) return false;	
	});

	$('#next a').click(function(){
		activeSlide = $(this).attr('data-slide');

		switch (activeSlide) {
			case "1":
				$("#back a").attr('data-slide', 1);
				$(this).attr('data-slide', 2);

				$(".hrline1").addClass("active");
				$(".bubble2").addClass("active");
				break;

			case "2":
				$("#back a").attr('data-slide', 2);
				$(this).attr('data-slide', 3);

				$(".hrline2").addClass("active");
				$(".bubble3").addClass("active");
				$("#preview").css("display","block");
				$("#next a").html("complete");
				$("#back").css("width","25%");
				break;
		}
		$('#content').animate({
		  left : "-" + (activeSlide*100) + "%"
		}, 1000);

		if(activeSlide != 3) return false;
	});

	$('#file-upload').click(function(){
		$("#fileId").click(); 
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

function createQuestion() {
  $.ajax({
	  type: "POST",
	  url: "/api/questions/new",
	  data: 
		'{ ' +
		   '"title": "' + $('#question_title').val() + '",' +
		   // '"image": "' + $('#question_image').val() + '",' +
		   '"answers": " [' +  
		   		'{ title: "' + $('#answer_title').val() + '" },' +
		   ']' + 
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
