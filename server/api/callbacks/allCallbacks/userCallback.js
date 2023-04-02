/* node server -- userCcallback  file
Name:- userCallback.js
Created On:- 27/08/18
*/
const db = require('../../../db/db');
const bcrypt = require('bcrypt');
const moment = require('moment');
//const async = require('async');
const mailServer = require('../../mailServer/mailServer');
const notify = require('../../notifications/pushNotification');
const commonFunction = require('./commonFunction');
module.exports = {
	getUserDetail : (id , callback)=>{
		let q = "SELECT first_name , last_name , middle_name , email , mobile , gender , dob , address , city , state , zip , country , image , is_email_verified , is_mobile_verified , is_active FROM users WHERE  id =  "+id+" ";
		db.query(q , (err,rows)=>{
			if(err){
				callback(commonFunction.callbackResponse(500,err));		
			}else{
				if(rows.length === 1){
					callback(commonFunction.callbackResponse(200,rows[0])); 
				}else{
					callback(commonFunction.callbackResponse(404,[]));
				}
			}
		})
	},

	getAllUsers : (callback)=>{
		let q = "select * from users";
		db.query(q,(err,rows)=>{
			if(err){
				callback(commonFunction.callbackResponse(500,err));		
			}else{
				if(rows.length > 0){
					callback(commonFunction.callbackResponse(200,rows)); //user validated
				}else{
					callback(commonFunction.callbackResponse(404,[])); // invalid token
				}
			}	
		})
	},

	getUserAllAddresses : (user_id , callback)=>{
		let q = "select id, user_id, address,city,state,zip,country from user_addresses where user_id ="+user_id;
		db.query(q,(err,rows)=>{
			if(err){
				callback(commonFunction.callbackResponse(500,err));		
			}else{
				if(rows.length > 0){
					callback(commonFunction.callbackResponse(200,rows)); //user validated
				}else{
					callback(commonFunction.callbackResponse(404,[])); // invalid token
				}
			}	
		})
	}	

}
