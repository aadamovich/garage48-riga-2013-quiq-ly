package org.garage48.tellme

import groovy.json.JsonBuilder

import com.gmongo.GMongo
import com.mongodb.DB

class DataService {

	static getQuestion(String id) {
		produceJson(db.questions.findOne(id: id))
	}

	static getRandomQuestions(limit) {
		def response = [questions: []]
		db.questions.find().each {
			response.questions << it
		}
		produceJson(response)
	}

	static insertQuestion(question) {
		db.questions.insert(question)
	}

	static updateQuestion(question) {
		db.questions.update(question)
	}

	static deleteQuestion(String id) {
		db.questions.remove(id: id)
	}
		
	static DB getDb() {
		def mongo = new GMongo()
		mongo.getDB('tell-me')
	}
	
	static produceJson(content) {
		content ? new JsonBuilder(content).toString() : '{ "response": "no-data" }'
	}
	
}
