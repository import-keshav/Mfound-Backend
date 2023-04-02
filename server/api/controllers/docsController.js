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
const multer = require('multer');
const Storage = multer.diskStorage({
	destination: function (req, file, callback) {
		if(file.fieldname == 'docs_image'){
			callback(null, "./public/media/images/docs");			
		}else{
			callback(null, "./public/media/images/others");	
		}	
	},
	filename: function (req, file, callback) {
	callback(null,file.originalname);
	//callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
	}
});
const upload = multer({ storage: Storage }).any();


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
				params.mother_name = req.body.motherName ;
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
			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/docs',response);
			break;
		}
	})
}
