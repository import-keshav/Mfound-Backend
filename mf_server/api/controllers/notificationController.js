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
const pushNotification = require('../notifications/pushNotification')

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
			
		}else{
			if(rows.affectedRows > 0){
				res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',[]));
			}else{
				res.status(404).json(callbacks.commonCallback.jsonResponse(404,'Not Found',[]));
			}
		}
	})

}


//v1/notification/:userid
exports.sendLostNotification = (req,res)=>{
	let authToken = req.headers.x_auth_token;
	if(!authToken){
		res.status(401).json(callbacks.commonCallback.jsonResponse(401,'Unauthorized Access',[]));	
		return false;
	}
	callbacks.commonCallback.validateAuthToken(authToken, 'users' ,  (response)=>{
		switch(response.statusCode){
			case 200:
			let queryParams = {};
			queryParams.user_id = req.body.userId;
			queryParams.notifyText = req.body.notifyText;
			queryParams.notifyAmount = req.body.notifyAmount;
			queryParams.lost_id = req.body.lost_id;

			callbacks.commonCallback.insertIntoTable(queryParams , 'push_notifications' , (response2)=>{
				switch(response2.statusCode){
					case 200:
					callbacks.commonCallback.getDeviceNotificationToken(queryParams.user_id , notifyResponse=>{
						switch(notifyResponse.statusCode){
							case 200:
							let obj = {};
							obj.to = notifyResponse.result.device_notification_id;
							obj.data = {};
							obj.data['device'] = notifyResponse.result.device;
							obj.data['message'] = queryParams.notifyText;
							obj.data['type'] = 'type';console.log(obj);
							res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',[]));
							pushNotification.sendLostNotification(obj , pushNotificationResponse=>{
								console.log(pushNotificationResponse)
							})		
							break;
							case 500:
							res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v1/category/:type',notifyResponse);
							break;
							case 404:
							res.status(404).json(callbacks.commonCallback.jsonResponse(404,'Not Found',[]));
							break;
						}
					})	
					break;
	    			case 500:
	    			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/docs',response2);
	    			break;
	    			case 503:
	    			res.status(503).json(callbacks.commonCallback.jsonResponse(503,'Service Unavailable',[]));
	    			break;
				}
			})
			break;
			case 404:
			res.status(404).json(callbacks.commonCallback.jsonResponse(404,'Not Found',[]));
			break;
			case 500:
			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v1/category/:type',notifyResponse);
			break;
		}
	})
}



//v1/notification/all
exports.sendNotificationAll = (req,res)=>{
	let authToken = req.headers.x_auth_token;
	if(!authToken){
		res.status(401).json(callbacks.commonCallback.jsonResponse(401,'Unauthorized Access',[]));	
		return false;
	}
	callbacks.commonCallback.validateAuthToken(authToken, 'users' ,  (response)=>{
		switch(response.statusCode){
			case 200:

			callbacks.commonCallback.getAllDeviceToken( response2=>{
				switch(response2.statusCode){
					case 200:
					res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',[]));
					let pending =  response2.result.length;

					for(let i in response2.result){
						let obj = {};
						obj.to = response2.result[i].device_notification_id;
						obj.data = {};
						obj.data['device'] = response2.result[i].device;
						obj.data['message'] = req.body.notify_text;
						obj.data['type'] = 'update';
						pushNotification.sendLostNotification(obj , pushNotificationResponse=>{
							console.log(pushNotificationResponse)
						})			
					}
					break;
					case 500:
					res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v1/category/:type',notifyResponse);
					break;
					case 404:
					res.status(404).json(callbacks.commonCallback.jsonResponse(404,'Not Found',[]));
					break;
				}
			})


			// let queryParams = {};
			// queryParams.user_id = req.body.userId;
			// queryParams.notifyText = req.body.notifyText;
			// queryParams.notifyAmount = req.body.notifyAmount;
			// queryParams.lost_id = req.body.lost_id;

			// callbacks.commonCallback.insertIntoTable(queryParams , 'push_notifications' , (response2)=>{
			// 	switch(response2.statusCode){
			// 		case 200:
			// 		callbacks.commonCallback.getDeviceNotificationToken(queryParams.user_id , notifyResponse=>{
			// 			switch(notifyResponse.statusCode){
			// 				case 200:
			// 				let obj = {};
			// 				obj.to = notifyResponse.result.device_notification_id;
			// 				obj.data = {};
			// 				obj.data['device'] = req.body.device;
			// 				obj.data['message'] = queryParams.notifyText;
			// 				obj.data['type'] = 'update';
			// 				//res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',[]));
			// 				pushNotification.sendLostNotification(obj , pushNotificationResponse=>{
			// 					console.log(pushNotificationResponse)
			// 				})		
			// 				break;
			// 				case 500:
			// 				//res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v1/category/:type',notifyResponse);
			// 				break;
			// 				case 404:
			// 				//res.status(404).json(callbacks.commonCallback.jsonResponse(404,'Not Found',[]));
			// 				break;
			// 			}
			// 		})	
			// 		break;
	  //   			case 500:
	  //   			//res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/docs',response2);
	  //   			break;
	  //   			case 503:
	  //   			//res.status(503).json(callbacks.commonCallback.jsonResponse(503,'Service Unavailable',[]));
	  //   			break;
			// 	}
			// })
			break;
			case 404:
			res.status(404).json(callbacks.commonCallback.jsonResponse(404,'Not Found',[]));
			break;
			case 500:
			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v1/category/:type',notifyResponse);
			break;
		}
	})
}















//v1/notification/lost
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
			where.user_id = req.params.userid;
			callbacks.commonCallback.selectData( select , where , 'push_notifications'  , response2=>{
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
