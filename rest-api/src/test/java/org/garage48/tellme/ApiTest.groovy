package org.garage48.tellme

import static com.jayway.restassured.RestAssured.*
import static com.jayway.restassured.matcher.RestAssuredMatchers.*
import static org.hamcrest.Matchers.*
import static org.junit.Assert.*
import groovy.json.JsonBuilder

import org.junit.AfterClass
import org.junit.BeforeClass
import org.junit.Test

class ApiTest {

	final static HOST = 'http://127.0.0.1:5050'

	@Test
	void testPostQuestion() {
		 def question = [:]
		 question.title = 'Which colour of shoes is gonna be trending in S/S 2014'
		 def request = new JsonBuilder(question).toString()
		 given().content(request).
		 expect().body('id', is(9)).
		 when().post("${HOST}/api/questions/new")
	}

}