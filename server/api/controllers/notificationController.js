/* node server -- notification controller file
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

//v1/notification/:userid
exports.getNotification = (req,res)=>{
	let authToken = req.headers.x_auth_token;
	if(!authToken){
		res.status(401).json(callbacks.commonCallback.jsonResponse(401,'Unauthorized Access',[]));	
		return false;
	}
	callbacks.commonCallback.validateAuthToken(authToken, 'users' ,  (response)=>{
		switch(response.statusCode){
			case 200:
			let select = '*';
			let where = {};
			where.userid = req.params.userid;
			callbacks.commonCallback.selectData( select , where , 'notification'  , response2=>{
				switch(response2.statusCode){
					case 200:
					res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',response2.result));
					break;
					case 404:
					res.status(404).json(callbacks.commonCallback.jsonResponse(404,'Not Found',[]));
					break;
					case 500:
					res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v1/notification/:type',response2);
					break;
				}
			})
			break;
			case 404:
			res.status(404).json(callbacks.commonCallback.jsonResponse(404,'Not Found',[]));
			break;
			case 500:
			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v1/category/:type',response);
			break;
		}
	})
}