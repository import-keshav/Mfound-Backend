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

exports.getData = (req,res)=>{
	let authToken = req.headers.x_auth_token;
	if(!authToken){
		res.status(401).json(callbacks.commonCallback.jsonResponse(401,'Unauthorized Access',[]));	
		return false;
	}
	callbacks.commonCallback.validateAuthToken(authToken, 'users' ,  (response)=>{
		switch(response.statusCode){
			case 200:
			let select = '*' , where = {};
			switch(req.params.role){
				case 'id':
				where.id = req.params.id
				break;
				case 'user':
				where.user_id = req.params.id
				break;
				case 'admin':
				break;
			}
			callbacks.commonCallback.selectData( select , where, req.params.type , response2=>{
				
				switch(response2.statusCode){
					case 200:
					res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',response2.result));
					break;
					case 404:
					res.status(404).json(callbacks.commonCallback.jsonResponse(404,'Not Found',[]));
					break;
					case 500:
					res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/lost',response2);
					break;

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


//api/v1/filter/:type/:key

exports.searchByKey = (req,res)=>{
	let authToken = req.headers.x_auth_token;
	if(!authToken){
		res.status(401).json(callbacks.commonCallback.jsonResponse(401,'Unauthorized Access',[]));	
		return false;
	}
	callbacks.commonCallback.validateAuthToken(authToken, 'users' ,  (response)=>{
		switch(response.statusCode){
			case 200:
			let params = {};
			params.type = req.params.type;
			params.key = req.params.key;
			callbacks.commonCallback.searchByKey( params , response2=>{
				
				switch(response2.statusCode){
					case 200:
					res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',response2.result));
					break;
					case 404:
					res.status(404).json(callbacks.commonCallback.jsonResponse(404,'Not Found',[]));
					break;
					case 500:
					res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/lost',response2);
					break;

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