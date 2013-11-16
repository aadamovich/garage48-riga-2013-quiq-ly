import static org.garage48.tellme.DataService.*
import static ratpack.groovy.Groovy.*

import groovy.json.JsonSlurper

import org.garage48.tellme.*

import ratpack.groovy.templating.*

ratpack {

  handlers {
	  	  
	get {
		render "Welcome to Quiq.ly!"
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
		int amount = 5
		def amountString = DataService.getPathId(request.path)
		if (amountString) {
			amount = amountString.toInteger()
		}
		render getRandomQuestions(amount)  
	}

	get("api/questions/random") {
		redirect "random/5"
	}

	post("api/questions/new") {
		def question = new JsonSlurper().parseText(request.text)
		println "Question to insert: ${question}" 
		insertQuestion(question)
		render '{ "response": "OK" }'
	}

	get('api/question/:id') { 
		def idString = DataService.getPathId(request.path)
		response.send('application/json', getQuestion(idString))
	}

	delete('api/question/:id') {
		def id = DataService.getPathId(request.path)
		deleteQuestion(id)
		render '{ "response": "OK" }'
	}

	put('api/question/:id') {
		def id = DataService.getPathId(request.path)
		DataService.updateQuestion(id)
		render '{ "response": "OK" }'
	}

	post("api/answers/new") {
		def answer = new JsonSlurper().parseText(request.text)
		println "Answer to insert: ${answer}"
		insertAnswer(answer)
		render '{ "response": "OK" }'
	}
		
	get("api/image/:id") {
		def id = DataService.getPathId(request.path)
		def file = new File("${FILE_STORAGE}/${id}")
		if (!file.exists()) {
			response.status(404) 	
			render '{ "response": "Not Found" }'
		} else {
		 	render file
		}
    }

	post("api/image/:id") {
		def id = DataService.getPathId(request.path)
		def file = new File("${FILE_STORAGE}/${id}")
		file.withOutputStream { stream ->
			request.writeBodyTo(stream)
		}		
		render '{ "response": "OK" }'
	}

    assets "public"
	
  }
}


