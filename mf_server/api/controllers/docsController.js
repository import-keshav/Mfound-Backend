/* node server -- docs controller file
Name:- docsController.js
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

// api url - /api/v2/docs
exports.docs = (req,res)=>{
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
				params.father_name = req.body.fatherName ;
				params.father_mobile = req.body.fatherMobile ;
				params.mother_name = req.body.motherName ;
				params.mother_mobile = req.body.motherMobile ;
				params.dob = req.body.dob ;
				params.gender = req.body.gender ;
				params.lat_location = req.body.latLocation ;
				params.long_location = req.body.longLocation ;
				params.address_location = req.body.addressLocation ;
				params.school_name = req.body.schoolName ;
				params.birth_mark = req.body.birthMark ;
				params.body_color = req.body.bodyColor ;
				params.description = req.body.description ;
				params.wear_glass = req.body.wearGlass ;
				params.eye_color = req.body.eyeColor ;
				params.height = req.body.height ;
				//	params.image = req.body.file ;
				if(req.files && req.files.length > 0){
					params.image = req.files[0].originalname ;
					params.thumb_image = req.files[1].originalname ;
				}else{
					params.image = "";
					params.thumb_image = "";
				}
				if(err){
					res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/docs',err);
				}else{
					callbacks.commonCallback.insertIntoTable(params , 'docs' , (response2)=>{
						switch(response2.statusCode){
							case 200:
			    			let resp = {};
							resp.docs_id = response2.result.insertId;
			    			res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',resp));
			    			break;
			    			case 500:
			    			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/docs',response2);
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
			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/docs',response);
			break;
		}
	})
}



// api url - /api/v2/docs/:id
exports.updateDocs = (req,res)=>{
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
				delete params.dob; delete params.status;
				// params.user_id = response.result.id;
				// params.name = req.body.name;
				// params.age = req.body.age;
				// params.father_name = req.body.fatherName ;
				// params.mother_name = req.body.motherName ;
				// params.dob = req.body.dob ;
				// params.gender = req.body.gender ;
				// params.lat_location = req.body.latLocation ;
				// params.long_location = req.body.longLocation ;
				// params.address_location = req.body.addressLocation ;
				// params.school_name = req.body.schoolName ;
				// params.birth_mark = req.body.birthMark ;
				// params.body_color = req.body.bodyColor ;
				// params.description = req.body.description ;
				// params.wear_glass = req.body.wearGlass ;
				// params.eye_color = req.body.eyeColor ;

				//	params.image = req.body.file ;
				if(req.files && req.files.length > 0){
					params.image = req.files[0].originalname ;
					params.thumb_image = req.files[1].originalname ;
				}else{
					//params.image = "";
					//params.thumb_image = "";
				}
				if(err){
					res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/docs',err);
				}else{
					let queryString = params;
					let whereCondition = {};
					whereCondition.id = req.params.id;
					callbacks.commonCallback.updateTable(queryString , whereCondition , 'docs' , (response2)=>{
						switch(response2.statusCode){
							case 200:
			    			res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',[]));
			    			break;
			    			case 500:
			    			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/docs',response2);
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
			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/lost',response);
			break;
		}
	})
}
