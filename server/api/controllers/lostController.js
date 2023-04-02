/* node server -- lost controller file
Name:- lostController.js
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
		if(file.fieldname == 'lost_image'){
			callback(null, "./public/media/images/lost");			
		}else if(file.fieldname == 'found_image'){
			callback(null, "./public/media/images/found");	
		}	
	},
	filename: function (req, file, callback) {
	callback(null,file.originalname);
	//callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
	}
});

const upload = multer({ storage: Storage }).any();


// api url - /api/v2/lost
exports.lost = (req,res)=>{
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
				switch(req.body.type){
					case 'person':
					params.type = req.body.type ;
					params.gender = req.body.gender ;
					params.category = req.body.category ;
					params.name = req.body.name ;
				//	params.image = req.body.image ;
					params.will_reward = req.body.willReward ;
					(req.body.willReward) ? (params.reward = req.body.reward): '';
					params.age = req.body.age ;
					params.date_of_missing = req.body.dateOfMissing ;
					params.lat_location = req.body.latLocation ;
					params.long_location = req.body.longLocation ;
					params.address_location = req.body.addressLocation ;
					params.birth_mark = req.body.birthMark ;
					params.body_color = req.body.bodyColor ;
					break;
					case 'item':
					params.type = req.body.type ;
					params.name = req.body.name ;
					params.will_reward = req.body.willReward ;
					(req.body.willReward) ? (params.reward = req.body.reward): '';
					params.date_of_lost = req.body.dateOfLost;
					params.lat_location = req.body.latLocation ;
					params.long_location = req.body.longLocation ;
					params.address_location = req.body.addressLocation ;
					params.category = req.body.category ;
					params.brand = req.body.brand ;
				//	params.image = req.body.image ;
					params.color = req.body.color ;	
					params.description = req.body.description ;	
					break;
				}
				console.log(req.files);
				if(req.files && req.files.length > 0){
					params.image = req.files[0].originalname ;
				}else{
					params.image = "";
				}
				if(err){
					res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/lost',err);
				}else{
					callbacks.commonCallback.insertIntoTable(params , 'lost' , (response2)=>{
						switch(response2.statusCode){
							case 200:
			    			res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',[]));
			    			break;
			    			case 500:
			    			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/lost',response2);
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
