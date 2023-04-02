/* node server -- upload controller file
Name:- uploadController.js
Created On:- 10/12/18
*/
const db = require('../../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const moment = require('moment');
const logger = require('../logger/logger')
const async = require('async');
const callbacks = require('../callbacks/callbacks')
const fs = require('fs');

const multer = require('multer');
const Storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, "./public/media/images/upload");				
	},
	filename: function (req, file, callback) {
	callback(null,file.originalname);
	//callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
	}
});
const upload = multer({ storage: Storage }).any();



// api url - /api/v2/upload
exports.upload = (req,res)=>{
	upload( req,res , (err)=>{
		console.log(req.files)	
	})
	
	//let files = req.files;
	//console.log(files)
	return false;

	let authToken = req.headers.x_auth_token;
	if(!authToken){
		res.status(401).json(callbacks.commonCallback.jsonResponse(401,'Unauthorized Access',[]));	
		return false;
	}
	callbacks.commonCallback.validateAuthToken(authToken, 'users' ,  (response)=>{
		switch(response.statusCode){
			case 200:

			let files = req.files;
			console.log(files)
			// callbacks.commonCallback.insertIntoTable(params , 'donate' , (response2)=>{
			// 	switch(response2.statusCode){
			// 		case 200:
	  //   			res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',[]));
	  //   			break;
	  //   			case 500:
	  //   			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/donate',response2);
	  //   			break;
	  //   			case 503:
	  //   			res.status(503).json(callbacks.commonCallback.jsonResponse(503,'Service Unavailable',[]));
	  //   			break;
			// 	}
			// })
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
