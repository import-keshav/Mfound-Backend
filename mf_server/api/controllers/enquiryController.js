/* node server -- enquiry controller file
Name:- enquiryController.js
Created On:- 05/09/18
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



// api url - /api/v2/enquiry
exports.enquiry = (req,res)=>{
	let authToken = req.headers.x_auth_token;
	if(!authToken){
		res.status(401).json(callbacks.commonCallback.jsonResponse(401,'Unauthorized Access',[]));	
		return false;
	}
	callbacks.commonCallback.validateAuthToken(authToken, 'users' ,  (response)=>{
		switch(response.statusCode){
			case 200:
			upload( req,res , (err)=>{
				let params = {};
				params.user_id = response.result.id;
				params.name = req.body.name;
				params.age = req.body.age;
				params.gender = req.body.gender ;
				params.body_organ = req.body.bodyOrgan ;
				params.blood_group = req.body.bloodGroup ;
				params.mobile = req.body.mobile ;
				params.location = req.body.location ;
				//	params.file = req.body.file ;
				if(req.files && req.files.length > 0){
					params.image = req.files[0].originalname ;
				}else{
					params.image = "";
				}
				if(err){
					res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/enquiry',err);
				}else{
					callbacks.commonCallback.insertIntoTable(params , 'enquiry' , (response2)=>{
						switch(response2.statusCode){
							case 200:
			    			res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',[]));
			    			break;
			    			case 500:
			    			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/enquiry',response2);
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
			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/enquiry',response);
			break;
		}
	})
}


// api url - /api/v2/enquiry/:id
exports.updateEnquiry = (req,res)=>{
	let authToken = req.headers.x_auth_token;
	if(!authToken){
		res.status(401).json(callbacks.commonCallback.jsonResponse(401,'Unauthorized Access',[]));	
		return false;
	}

	callbacks.commonCallback.validateAuthToken(authToken, 'users' ,  (response)=>{
		switch(response.statusCode){
			case 200:

			upload( req,res , (err)=>{
				let params = req.body;
				delete params.created_at
				// params.user_id = response.result.id;
				// params.name = req.body.name;
				// params.age = req.body.age;
				// params.gender = req.body.gender ;
				// params.body_organ = req.body.bodyOrgan ;
				// params.blood_group = req.body.bloodGroup ;
				// params.mobile = req.body.mobile ;
				// params.location = req.body.location ;

				//	params.image = req.body.file ;
				if(req.files && req.files.length > 0){
					params.image = req.files[0].originalname ;
				}else{
					//params.image = "";
					//params.thumb_image = "";
				}
				if(err){
					res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/enquiry',err);
				}else{
					let queryString = params;
					let whereCondition = {};
					whereCondition.id = req.params.id;
					callbacks.commonCallback.updateTable(queryString , whereCondition , 'enquiry' , (response2)=>{
						console.log(response2)
						switch(response2.statusCode){
							case 200:
			    			res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',[]));
			    			break;
			    			case 500:
			    			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/enquiry',response2);
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
			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/enquiry',response);
			break;
		}
	})
}
