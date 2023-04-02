/* node server -- push controller file
Name:- pushController.js
Created On:- 27/08/18
*/
const db = require('../../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const moment = require('moment');
const logger = require('../logger/logger')
const async = require('async');
const notify = require('../notifications/pushNotification')
const callbacks = require('../callbacks/callbacks')
// api url - /api/v2/notify/user

exports.sendPushNotificationToUser = (req,res)=>{
	// let authToken = req.headers.x_auth_token;
	// if(!authToken){
	// 	res.status(401).json(callback.jsonResponse(401,'Unauthorized Access',[]));	
	// 	return false;
	// }
	let params = {};
	params.data = {};
	params.data.message = req.body.message;
	params.to =  req.body.device_id;
	if(!params){
		res.status(400).json(callbacks.commonCallback.jsonResponse(400,'Bad Request',[]));	
		return false;
	}	
	notify.sendPushNotificationToUser( params , (response)=>{
		if(response.success && !response.failure){
			res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',[]));		
		}else{
			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));									
			logger.error('API - /api/v2/notify/user',err);
		}
	})
}


//api url - /api/v2/set/notification

exports.setNotificationToken = (req,res)=>{
	let params = {};
	params.device_token = req.body.deviceToken;
	params.device_notification_id = req.body.deviceNotificationId;

	if(!params){
		res.status(400).json(callbacks.commonCallback.jsonResponse(400,'Bad Request',[]));	
	}
	params.updated_at = moment().format('YYYY-MM-DD HH:mm:ss');
	let q = "INSERT INTO notification_tokens(device_token,device_notification_id,updated_at) VALUES( '"+params.device_token+"' , '"+params.device_notification_id+"' , '"+params.updated_at+"' ) ON DUPLICATE KEY UPDATE device_notification_id = '"+params.device_notification_id+"' , updated_at = '"+params.updated_at+"'  ";
	db.query(q , (err,rows)=>{
		if(err){
			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));									
			logger.error('API - /api/v2/set/notification',err);
		}else{
			if(rows.affectedRows > 0){
				res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',[]));
			}else{
				res.status(404).json(callbacks.commonCallback.jsonResponse(404,'Not Found',[]));
			}
		}
	})

}
