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

const upload = require('../multer/upload');

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
					params.height = req.body.height ;
					params.mobile = req.body.mobile ;
					break;
					case 'item':
                                        params.name = req.body.name ;
					params.type = req.body.type ;
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
					params.mobile = req.body.mobile ;
					break;
					case 'travel':
					params.type = req.body.type ;
					params.travel_date  = req.body.travelDate ;
					params.travel_from = req.body.travelFrom ;
					params.destination = req.body.destination ;
					params.vehicle_no = req.body.vehicleNo ;
					params.vehicle_company = req.body.vehicleCompany ;
					params.vehicle_name = req.body.vehicleName ;
					params.will_reward = req.body.willReward ;
					(req.body.willReward) ? (params.reward = req.body.reward): '';
					params.date_of_lost = req.body.dateOfLost;
					params.lat_location = req.body.latLocation ;
					params.long_location = req.body.longLocation ;
					params.address_location = req.body.addressLocation ;
					params.category = req.body.category ;
					params.brand = req.body.brand ;
					params.mobile = req.body.mobile ;
					break;

				}
				if(req.files && req.files.length > 0){
					params.image = req.files[0].originalname ;
				}else{
					params.image = "";
				}

				if(err == 1 || err == null || typeof err == 'undefined'){
					callbacks.commonCallback.insertIntoTable(params , 'lost' , (response2)=>{
						switch(response2.statusCode){
							case 200:
							let resp = {};
							resp.lost_id = response2.result.insertId;
			    			res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',resp));
			    			break;
			    			case 500:
			    			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/lost',response2);
			    			break;
			    			case 503:
			    			res.status(503).json(callbacks.commonCallback.jsonResponse(503,'Service Unavailable',[]));
			    			break;
						}
					})
				}else{
					res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/lost',err);
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


// api url - /api/v2/lost/:id
exports.updateLost = (req,res)=>{
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
				delete params.status;
				delete params.date_of_missing;
				delete params.date_of_lost;
				delete params.travel_date;
				delete params.created_at
				// req.body.date_of_missing && (req.body.date_of_missing != '0000-00-00 00:00:00') ? params.date_of_missing = req.body.date_of_missing : delete req.body.date_of_missing;
				// req.body.date_of_lost && (req.body.date_of_lost != '0000-00-00 00:00:00') ? params.date_of_lost = req.body.date_of_lost : delete req.body.date_of_lost;


				// params.user_id = response.result.id;
				// switch(req.body.type){
				// 	case 'person':
				// 	params.type = req.body.type ;
				// 	params.gender = req.body.gender ;
				// 	params.category = req.body.category ;
				// 	params.name = req.body.name ;
				// 	params.will_reward = req.body.will_reward ;
				// 	params.reward = req.body.reward;
				// 	params.age = req.body.age ;
				// 	req.body.date_of_missing && (req.body.date_of_missing != '0000-00-00 00:00:00') ? params.date_of_missing = req.body.date_of_missing : delete req.body.date_of_missing;
				// 	params.lat_location = req.body.lat_location ;
				// 	params.long_location = req.body.long_location ;
				// 	params.address_location = req.body.address_location ;
				// 	params.birth_mark = req.body.birth_mark ;
				// 	params.body_color = req.body.body_color ;
				// 	break;
				// 	case 'item':
				// 	params.type = req.body.type ;
				// 	params.will_reward = req.body.will_reward ;
				// 	params.reward = req.body.reward;
				// 	req.body.date_of_lost && (req.body.date_of_lost != '0000-00-00 00:00:00') ? params.date_of_lost = req.body.date_of_lost : delete req.body.date_of_lost;
				// 	params.lat_location = req.body.lat_location ;
				// 	params.long_location = req.body.long_location ;
				// 	params.address_location = req.body.address_location ;
				// 	params.category = req.body.category ;
				// 	params.brand = req.body.brand ;
				// 	params.color = req.body.color ;	
				// 	params.description = req.body.description ;	
				// 	break;
				// }
				if(req.files && req.files.length > 0){
					params.image = req.files[0].originalname ;
				}else{
					//params.image = "";
				}
				if(err){
					console.log(err)
					res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/lost',err);
				}else{
					let queryString = params;
					let whereCondition = {};
					whereCondition.id = req.params.id; 
					callbacks.commonCallback.updateTable(queryString , whereCondition , 'lost' , (response2)=>{
						console.log(response2)
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
