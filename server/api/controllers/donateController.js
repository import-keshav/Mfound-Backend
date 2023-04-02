/* node server -- donate controller file
Name:- donateController.js
Created On:- 07/10/18
*/
const db = require('../../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const moment = require('moment');
const logger = require('../logger/logger')
const async = require('async');
const callbacks = require('../callbacks/callbacks')

// api url - /api/v2/donate
exports.donate = (req,res)=>{
	let authToken = req.headers.x_auth_token;
	if(!authToken){
		res.status(401).json(callbacks.commonCallback.jsonResponse(401,'Unauthorized Access',[]));	
		return false;
	}
	callbacks.commonCallback.validateAuthToken(authToken, 'users' ,  (response)=>{
		switch(response.statusCode){
			case 200:
			let params = {};
			params.user_id = response.result.id;
			params.type = req.body.type ;
			params.gender = req.body.gender ;
			params.name = req.body.name ;
			params.age = req.body.age ;
			params.mobile = req.body.mobile ;
			params.location = req.body.location ;
			switch(req.body.type){ // blood or organ
				case 'blood':
				params.blood_type = req.body.bloodType ; // blood category
				break;
				case 'organ':
				params.body_organ = req.body.bodyOrgan ; 
				break;
			}

			if(!params){
				res.status(400).json(callbacks.commonCallback.jsonResponse(400,'Bad Request',[]));				
			}
			callbacks.commonCallback.insertIntoTable(params , 'donate' , (response2)=>{
				switch(response2.statusCode){
					case 200:
	    			res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',[]));
	    			break;
	    			case 500:
	    			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/donate',response2);
	    			break;
	    			case 503:
	    			res.status(503).json(callbacks.commonCallback.jsonResponse(503,'Service Unavailable',[]));
	    			break;
				}
			})
			break;
			case 404:
			res.status(404).json(callbacks.commonCallback.jsonResponse(404,'Not Found',[]));
			break;
			case 500:
			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/donate',response);
			break;
		}
	})
}
