jQuery(document).ready(function() { 

	addChoiceHandler();

	$('#rate').focusout(function(){
		rate();
		if($(this).val() == 0) $(this).val("1-10");
	});

	$('#email').click(function(){
		$(this).val("");
	});

	$('#rate').click(function(){
		$(this).val("");
	});

	$('#email').focusout(function(){
		subscribe();
		if($(this).val() == 0) $(this).val("Enter e-mail here!");
	});

	function rate() {
	  $.ajax({
		  type: "POST",
		  url: "/api/rate",
		  data: 
			'{ ' +
			   '"rate": "' + $('#rate').val() + '",' +
			'}',
		  dataType: "json"
		});
	}

	function subscribe() {
	  $.ajax({
		  type: "POST",
		  url: "/api/subscribe",
		  data: 
			'{ ' +
			   '"email": "' + $('#subscribe_email').val() + '",' +
			'}',
		  dataType: "json"
		});
	}
		
	$('#next-question').click(function(){
		$('#content').animate({
		  left : -100 + "%"
		}, 1000, function() {
			loadQuestion();
			$('.result').css('display','none');
			$('#content').css("left", "0%");
			$('#qplace').css("left", "0");
			$('#qgraph').css("left", "50%");
		});
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
				if($("#ask-question").val().length == 0 ) {
					$("#ask-question").css("borderColor","#fc5e5e");
					return false;
					break;
				}
				$('#qtitle h2').html($("#ask-question").val());

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

	$('.answer-field').focus(function(){
		var nextNum = parseInt($(this).attr("name")) + 1;
		if($('.answer-field[name=' + nextNum + ']').length == 0) {
			$('#qask2').append('<input type="text" id="answer' + nextNum + '" class="answer-field" name="' + nextNum + '" />');
			addNewInput();
		}
		
	});
	$("#fileId").change(function() {
		$("#content").html("lol");
	});

	$('#file-upload').click(function(){
		$("#fileId").click(); 
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

function getData() {
    var data = []
    $.each( $('#pick-answer li'), function(index, item) {
        data.push({
        value: parseInt($(item).children('input[type=radio]').attr('data-value')),
        color: $(item).children('input[type=radio]').attr('data-color')                    
        })
    });        
    return data;
}  

function addChoiceHandler() {
	
	$('#pick-answer label').click(function(){
		$('#content').animate({
		  left : -100 + "%"
		}, 1000, function() {
			answerQuestion();
			drawChart(getData());			
			$('.result').fadeIn();
			$('#content').css("left", "0%");
			$('#qplace').css("left", "50%");
			$('#qgraph').css("left", "0");
		});
	});
	
}

function addNewInput() {
	$('.answer-field').focus(function(){
		var nextNum = parseInt($(this).attr("name")) + 1;
		var prevNum = nextNum - 2;
		if($('.answer-field[name=' + nextNum + ']').length == 0 && $(this).prev().val().length != 0 ) {
			$('#qask2').append('<input type="text" id="answer' + nextNum + '" class="answer-field" name="' + nextNum + '" />');
			addNewInput();
		}
	});
}

function preview(input) {
    if (input.files && input.files[0]) {    	
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#preview-uploadd')
                .attr('src', e.target.result)
                .width(100)
                .height(120);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

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
		   '"title": "' + $('#pick-answer input').filter(':checked').val() + '"' + 
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
  $('#answer').href = '/question/random'
}

function subscribe() {
  $.ajax({
	  type: "POST",
	  url: "/api/subscribe",
	  data: 
		'{ ' +
		   '"email": "' + $('#subscribe_email').val() + '",' +
		'}',
	  dataType: "json"
	});
}

function rate() {
  $.ajax({
	  type: "POST",
	  url: "/api/rate",
	  data: 
		'{ ' +
		   '"rate": "' + $('#rate').val() + '",' +
		'}',
	  dataType: "json"
	});
}

function loadQuestion() {
  $.getJSON( "/api/questions/random1", function(data) {
	  $('#question_id').val(data._id);
	  $('#qplace #qtitle h1').text(data.title);
	  $('#participant-count').text(data.total);
	  var newAnswers = '<ul id="pick-answer">'
	  var newLabels = '<div id="result-list"><ul>'
	  for (var i = 0; i < data.answers.length; i++) {
		  var answer = data.answers[i].title
		  var color = data.answers[i].color
		  var value = data.answers[i].value		  
		  newAnswers += '<li id="' + i + '_answer">' + 
		                '<p>' + answer + '</p>' + 
		                '<input type="radio" value="' + answer + '" id="' + i + '_title" name="select" data-color="' + color + '" data-value="' + value + '">' + 
		                '<label for="' + i + '_title"></label></li>'
		  newLabels += '<li id="result' + (i+1) + '" class="result"><h2>' + value + '</h2><span>' + answer + '</span></li>'              
	  }
	  newAnswers += '</ul>'; 
	  newAnswers += '</ul></div>';              
      $('#pick-answer').replaceWith(newAnswers);
      $('#result-list').replaceWith(newLabels);
      addChoiceHandler();       
  })
}
