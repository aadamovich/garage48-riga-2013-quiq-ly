package org.garage48.tellme

import groovy.json.JsonBuilder

import com.gmongo.GMongo
import com.mongodb.DB

class DataService {

	static final FILE_STORAGE = '/var/lib/tellme/storage'
	static final Random RNG = new Random() 

	static getPathId(String path) {
		path.split('/').last()
	}

	static getQuestion(String id) {
		def question = db.questions.findOne('_id': id)
		enrichQuestion(question)
		question
	}

	static getJsonQuestion(String id) {
		produceJson(getQuestion(id))
	}
	
	static getJsonRandomQuestions(limit) {
		def response = [questions: []]
		db.questions.find().limit(limit).each { question ->		
			enrichQuestion(question)				
			response.questions << question
		}		
		produceJson(response)
	}

	static getRandomQuestion() {		  
		int questionCount = db.questions.count()
		def question = null
		db.questions.find().limit(1).skip(RNG.nextInt(questionCount)).each {
		  question = it
		  enrichQuestion(question)
		}
		question
	}	

	static private enrichQuestion(question) {
		def colors = [ "#F7464A", "#E2EAE9", "#D4CCC5", "#949FB1", "#4D5360" ]
		def colorCounter = 0
		question.remove('_random')
		db.answers.aggregate(
			[
			  $project : [ title: 1, question_id: 1 ]
			],
			[
			  $match : [ question_id: question._id ]
			],
			[
			  $group: [ _id : [ question_id: '$question_id', title: '$title'], count: [ $sum: 1 ] ]
			]
		  ).results().each { answerStats ->		    
			question.answers.each { answer ->
				if (answerStats._id.title == answer.title) {
					answer.value = answerStats.count
					answer.color = colors[(colorCounter++) % colors.size()]
				}
			}
		  }
		  question.answers.each { answer ->
			  if (!answer.value) {
				 answer.value = 0
			  }
		  }
	}

	static insertQuestion(question) {
		question.'_id' = UUID.randomUUID().toString()
		question.'_random' = (Integer) (Math.random() * 100)
		db.questions.insert(question)
	}

	static insertAnswer(answer) {
		answer.'_id' = UUID.randomUUID().toString()
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
