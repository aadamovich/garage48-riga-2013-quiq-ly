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
	
	static getJsonRandomQuestion() {
		produceJson(getRandomQuestion())
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
		enrichRecord(question)		
		db.questions.insert(question)
	}

	static insertAnswer(answer) {
		enrichRecord(answer)
		db.answers.insert(answer)
	}

	static updateQuestion(question) {
		db.questions.update(question)
	}

	static deleteQuestion(String id) {
		db.questions.remove('_id': id)
	}

	static subscribe(subscription) {
		enrichRecord(subscription)
		db.subscriptions.insert(subscription)
	}

	static rate(rate) {
		enrichRecord(rate)
		db.rates.insert(rate)
	}
			
	static enrichRecord(record) {
		record.'_id' = UUID.randomUUID().toString()
		record.'_timestamp' = System.currentTimeMillis()
		record.'_random' = (Integer) (Math.random() * 100)
	}
	
	private static DB getDb() {
		def mongo = new GMongo()
		mongo.getDB('tell-me')
	}
	
	private static produceJson(content) {
		content ? new JsonBuilder(content).toString() : '{ "response": "no-data" }'
	}
	
}
