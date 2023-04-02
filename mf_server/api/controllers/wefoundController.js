/* node server -- wefound controller file
Name:- wefoundController.js
Created On:- 05/01/19
*/
const db = require('../../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const moment = require('moment');
const logger = require('../logger/logger')
const async = require('async');
const callbacks = require('../callbacks/callbacks')

const upload = require('../multer/upload');

// api url - /api/v2/wefound
exports.wefound = (req,res)=>{
	let authToken = req.headers.x_auth_token;
	if(!authToken){
		res.status(401).json(callbacks.commonCallback.jsonResponse(401,'Unauthorized Access',[]));	
		return false;
	}
	callbacks.commonCallback.validateAuthToken(authToken, 'users' ,  (response)=>{
		switch(response.statusCode){
			case 200:

			upload(req,res ,(err)=>{
				console.log(err)
				let params = req.body;
				if(req.files && req.files.length > 0){
					params.image = req.files[0].originalname ;
				}else{
					//params.image = "";
				}	

				if(err){
					res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/wefound',err);
				}else{
					callbacks.commonCallback.insertIntoTable(params , 'wefound' , (response2)=>{console.log(response2)
						switch(response2.statusCode){
							case 200:
			    			res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',[]));
			    			break;
			    			case 500:
			    			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/wefound',response2);
			    			break;
			    			case 503:
			    			res.status(503).json(callbacks.commonCallback.jsonResponse(503,'Service Unavailable',[]));
			    			break;
						}
					})

				}
			})

			

			
			
			break;
			case 404:
			res.status(404).json(callbacks.commonCallback.jsonResponse(404,'Not Found',[]));
			break;
			case 500:
			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/wefound',response);
			break;
		}
	})
}


// api url - /api/v1/common-upload
exports.wefoundOther = (req,res)=>{
	let authToken = req.headers.x_auth_token;
	if(!authToken){
		res.status(401).json(callbacks.commonCallback.jsonResponse(401,'Unauthorized Access',[]));	
		return false;
	}
	callbacks.commonCallback.validateAuthToken(authToken, 'users' ,  (response)=>{
		switch(response.statusCode){
			case 200:

			upload(req,res ,(err)=>{
				console.log(err)
				let params = {};
				//params =  req.body;
				if(req.body.type == 'videos'){
					params.link = req.body.link;
				}
				if(req.files && req.files.length > 0){
					params.image = req.files[0].originalname ;
					
				}else{
					params.image = "";
				}	

				if(err){
					res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/wefound',err);
				}else{
					callbacks.commonCallback.insertIntoTable(params , req.body.type , (response2)=>{console.log(response2)
						switch(response2.statusCode){
							case 200:
			    			res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',[]));
			    			break;
			    			case 500:
			    			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/wefound',response2);
			    			break;
			    			case 503:
			    			res.status(503).json(callbacks.commonCallback.jsonResponse(503,'Service Unavailable',[]));
			    			break;
						}
					})

				}
			})

			

			
			
			break;
			case 404:
			res.status(404).json(callbacks.commonCallback.jsonResponse(404,'Not Found',[]));
			break;
			case 500:
			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/wefound',response);
			break;
		}
	})
}
