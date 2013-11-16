import static ratpack.groovy.Groovy.*

import ratpack.groovy.templating.*

ratpack {

  modules {
    get(TemplatingModule).staticallyCompile = true
  }

  handlers {
	  
    get("api/questions") {
	  render groovyTemplate("questions.json")  
	}

    assets "public"
	
  }
}


