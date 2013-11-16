import static org.garage48.tellme.DataService.*
import static ratpack.groovy.Groovy.*

import groovy.json.JsonSlurper

import org.garage48.tellme.*

import ratpack.groovy.templating.*

ratpack {

  handlers {
	  	  
	get {
		render "Tell.me API endpoint."
	}

	//////////////////////////////////////////////
	// Web interface
	//////////////////////////////////////////////
	
	get("question/random") {
		render groovyTemplate('question.html', question: getRandomQuestion())
	}		
		  
	//////////////////////////////////////////////
	// API 
	//////////////////////////////////////////////

    get("api/questions/random/:amount") {
		render getRandomQuestions(request.queryParams.amount)  
	}

	get("api/questions/random1") {
		render getRandomQuestion()
	}

	post("api/questions/new") {
		def question = new JsonSlurper().parseText(request.text)
		println "Question to insert: ${question}" 
		insertQuestion(question)
		render '{ "response": "OK" }'
	}

	get('api/question/:id') { 
		response.send('application/json', getQuestion(request.queryParams.id))
	}

	delete('api/question/:id') {
		deleteQuestion(request.queryParams.id)
		render '{ "response": "OK" }'
	}

	put('api/question/:id') {
		DataService.updateQuestion(request.queryParams.id)
		render '{ "response": "OK" }'
	}
	
	get("api/image/:id") {
		def file = new File("${FILE_STORAGE}/${request.queryParams.id}")
		if (!file.exists()) {
			response.status(404) 	
			render '{ "response": "Not Found" }'
		} else {
		 	render file
		}
    }

	post("api/image/:id") {
		def file = new File("${FILE_STORAGE}/${request.queryParams.id}")
		file.withOutputStream { stream ->
			request.writeBodyTo(stream)
		}		
		render '{ "response": "OK" }'
	}

    assets "public"
	
  }
}


