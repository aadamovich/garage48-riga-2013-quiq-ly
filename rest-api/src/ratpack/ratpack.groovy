import static ratpack.groovy.Groovy.*
import static org.garage48.tellme.DataService.*

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

	get('api/questions/:id') { 
		response.send('application/json', getQuestion(request.queryParams.id))
	}

	delete('api/questions/:id') {
		deleteQuestion(request.queryParams.id)
	}

	post("api/questions/new") {		
		updateQuestion(delegate)
	}

	put('api/questions/:id') {
		DataService.updateQuestion(request.queryParams.id)
		response.status(200, 'OK').send()
	}
	
	get("api/images/:id") {
	
    }

	post("api/images/:id") {
	
	}

    assets "public"
	
  }
}


