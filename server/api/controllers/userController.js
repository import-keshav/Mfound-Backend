/* node server -- user controller file
Name:- userController.js
Created On:- 27/08/18
*/
const db = require('../../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const moment = require('moment');
const mailServer = require('../mailServer/mailServer');
const logger = require('../logger/logger')
const callbacks = require('../callbacks/callbacks')
const multer = require('multer');
const Storage = multer.diskStorage({
	destination: function (req, file, callback) {
	callback(null, "./public/media/images/profiles");	
	},
	filename: function (req, file, callback) {
	callback(null,file.originalname);
	//callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
	}
});
const upload = multer({ storage: Storage }).array("image", 1);
// api url - /api/v2/user/:id
exports.getUserDetail = (req,res)=>{
	let authToken = req.headers.x_auth_token;
	if(!authToken){
		res.status(401).json(callbacks.commonCallback.jsonResponse(401,'Unauthorized Access',[]));	
		return false;
	}
	callbacks.commonCallback.validateAuthToken(authToken, 'users' , (response)=>{
		switch(response.statusCode){
			case 200:
			callbacks.userCallback.getUserDetail( req.params.id , (response2)=>{
				switch(response2.statusCode){
					case 200:
					res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',response2.result));		
					break;
					case 404:
					res.status(404).json(callbacks.commonCallback.jsonResponse(404,'Not Found',[]));
					break;
					case 500:
					res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Service Error',[]));logger.error('API GET- /api/v1/user/:id',response2);
					break;
				}	

			})
			break;
			case 404:
			res.status(404).json(callbacks.commonCallback.jsonResponse(404,'Not Found',[]));
			break;
			case 500:
			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Service Error',[]));logger.error('API GET- /api/v1/user/:id',response);
			break;	
		}
	})	
}
// api url - /api/v2/user
exports.updateUserDetail = (req,res)=>{
	let authToken = req.headers.x_auth_token;
	if(!authToken){
		res.status(401).json(callbacks.commonCallback.jsonResponse(401,'Unauthorized Access',[]));	
		return false;
	}
	callbacks.commonCallback.validateAuthToken(authToken, 'users' , (response)=>{
		switch(response.statusCode){
			case 200:
			upload( req,res , (err)=>{
				req.body.first_name = req.body.firstName;delete req.body.firstName;req.body.last_name = req.body.lastName;delete req.body.lastName;
				if(req.files.length > 0 ){
					req.body.image = req.files[0].filename;
				}
				let queryString =  req.body;
				let whereCondition = {};
				whereCondition.id = req.body.id;
				callbacks.commonCallback.updateTable(queryString ,whereCondition, 'users' , (response2)=>{
					switch(response2.statusCode){
						case 200:
						let addressParams = {};
						addressParams.address = req.body.address ;
						addressParams.city =  req.body.city ;
						addressParams.state =  req.body.state ;
						addressParams.zip =  req.body.zip ;
						addressParams.country =  req.body.country;
						if(addressParams){
							callbacks.commonCallback.insertIntoTable(addressParams , 'user_addresses' , (response3)=>{
								switch(response3.statusCode){
									case 200:
									res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',[]));								
									break;
									case 500:
									res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API PUT- /api/v2/user',response3);
									break;
									case 503:
									res.status(503).json(callbacks.commonCallback.jsonResponse(503,'Service Unavailable',[]));								
									break;
								}
							})	
						}
						break;
						case 500:
						res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API PUT- /api/v2/user',response2);
						break;
						case 503:
						res.status(503).json(callbacks.commonCallback.commonCallback.jsonResponse(503,'Service Unavailable',[]));
						break;
					}
				})
			})	
			break;
			case 404:
			res.status(404).json(callbacks.commonCallback.jsonResponse(404,'Not Found',[]));		
			break;
			case 500:
			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API PUT- /api/v2/user',response);
			break;
		}
	})	
}
