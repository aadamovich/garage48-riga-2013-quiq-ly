package org.garage48.tellme

import groovy.json.JsonBuilder

import com.gmongo.GMongo
import com.mongodb.DB

class DataService {

	static final FILE_STORAGE = '/var/lib/tellme/storage'
	
	static getQuestion(String id) {
		produceJson(db.questions.findOne('_id': id))
	}

	static getRandomQuestion() {
		getRandomQuestions(1)
	}
	
	static getPathId(String path) {
		path.split('/').last()
	}		
	
	static getRandomQuestions(limit) {
		def response = [questions: []]
		db.questions.find().limit(limit).sort('_random': 1).each { question ->
			question.remove('_random')
			response.questions << question
			db.answers.group([question_id: true], [:], [count: 0], "function(doc, out) { out.count += 1 }").each { answerStats ->
			  question.answers.each { answer ->
				  if (answerStats.title == answer.title) {
					  answer.value = answerCount.count 
				  }				  
			  }
		    }
		}		
		produceJson(response)
	}

	static insertQuestion(question) {
		question.'_id' = UUID.randomUUID()
		question.'_random' =  (Integer) (Math.random() * 100)
		db.questions.insert(question)
	}

	static insertAnswer(answer) {
		answer.'_id' = UUID.randomUUID()
		db.answers.insert(answer)
	}

	static updateQuestion(question) {
		db.questions.update(question)
	}

	static deleteQuestion(String id) {
		db.questions.remove('_id': id)
	}
		
	private static DB getDb() {
		def mongo = new GMongo()
		mongo.getDB('tell-me')
	}
	
	private static produceJson(content) {
		content ? new JsonBuilder(content).toString() : '{ "response": "no-data" }'
	}
	
}
