import static ratpack.groovy.Groovy.*
import static org.garage48.tellme.DataService.*
import groovy.json.JsonSlurper;

import ratpack.groovy.templating.*
import org.garage48.tellme.*

ratpack {

  handlers {
	  	  
	get {
		render "Tell.me API endpoint."
	}
	  
    get("api/questions/random") {
		render getRandomQuestions(10)  
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
		render '{ "response": "OK" }'
    }

	post("api/image/:id") {
		render '{ "response": "OK" }'
	}

    assets "public"
	
  }
}


