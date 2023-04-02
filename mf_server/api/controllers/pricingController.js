/* node server -- pricing controller file
Name:- pricingController.js
Created On:- 02/02/19
*/
const db = require('../../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const moment = require('moment');
const logger = require('../logger/logger')
const async = require('async');
const callbacks = require('../callbacks/callbacks')

// api url - /api/v1/pricing
exports.pricing = (req,res)=>{
	let authToken = req.headers.x_auth_token;
	if(!authToken){
		res.status(401).json(callbacks.commonCallback.jsonResponse(401,'Unauthorized Access',[]));	
		return false;
	}
	callbacks.commonCallback.validateAuthToken(authToken, 'users' ,  (response)=>{
		switch(response.statusCode){
			case 200:
			let params = {};
			params.amount = req.body.amount;
			params.type = req.body.type ;
			if(!params){
				res.status(400).json(callbacks.commonCallback.jsonResponse(400,'Bad Request',[]));				
			}
			callbacks.commonCallback.insertIntoTable(params , 'pricing' , (response2)=>{
				console.log(params);
				console.log(response2);
				switch(response2.statusCode){
					case 200:
	    			res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',[]));
	    			break;
	    			case 500:
	    			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v1/pricing',response2);
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




// api url - /api/v2/pricing/:id
exports.updatePricing = (req,res)=>{
	let authToken = req.headers.x_auth_token;
	if(!authToken){
		res.status(401).json(callbacks.commonCallback.jsonResponse(401,'Unauthorized Access',[]));	
		return false;
	}
	callbacks.commonCallback.validateAuthToken(authToken, 'users' ,  (response)=>{
		switch(response.statusCode){
			case 200:
				let queryString =req.body;
				delete queryString.created_at
				let whereCondition = {};
				whereCondition.id = req.params.id;
				callbacks.commonCallback.updateTable(queryString , whereCondition , 'pricing' , (response2)=>{

					switch(response2.statusCode){
						case 200:
		    			res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',[]));
		    			break;
		    			case 500:
		    			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/pricing',response2);
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
			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/enquiry',response);
			break;
		}
	})
}
