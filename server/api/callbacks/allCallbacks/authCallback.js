/* node server -- callback functions file
Name:- callback.js
Created On:- 24/08/18
*/
const db = require('../../../db/db');
const bcrypt = require('bcrypt');
const moment = require('moment');
//const async = require('async');
const mailServer = require('../../mailServer/mailServer');
const smsServer = require('../../smsServer/smsServer')
const notify = require('../../notifications/pushNotification');
const commonFunction = require('./commonFunction');
module.exports = {
	checkUserCallback : (validParams,callback)=>{
		let q = "SELECT * FROM users WHERE email = '"+validParams.email+"' AND role = '"+validParams.role+"'  ";
		db.query(q,(err,rows)=>{
			if(err){
				callback(commonFunction.callbackResponse(500,err));		
			}else{
				if(rows.length == 1){
					switch(validParams.method){
						case 'signup':
							callback(commonFunction.callbackResponse(200,rows[0])); //user exists
						break;
						case 'login':
							if(!rows[0].is_email_verified){
								callback(commonFunction.callbackResponse(403,[]));
							}else{
							    if(bcrypt.compareSync(validParams.password,rows[0].password)){
									callback(commonFunction.callbackResponse(200,rows[0])); //user exists
								}else{
								 	callback(commonFunction.callbackResponse(401,[]));
								}	
							}
						break;
						case 'changePassword':
							if(bcrypt.compareSync(validParams.password,rows[0].password)){
								callback(commonFunction.callbackResponse(200,rows)); //user exists
							}else{
							 	callback(commonFunction.callbackResponse(401,[]));
							}
						break;
						case 'forgetPassword':
							if(!rows[0].is_email_verified){
								callback(commonFunction.callbackResponse(403,[]));
							}else{
								callback(commonFunction.callbackResponse(200,rows[0])); 	
							}
							
						break;
					}
				}else{
					callback(commonFunction.callbackResponse(404,[]));		
				}
			}
		})
	},
	sendEmailOTP : (mailParams , callback)=>{
		mailServer.sendForgetEmail(mailParams, (mailResponse)=>{
			if(mailResponse && mailResponse.ErrorCode == 0){
				callback(commonFunction.callbackResponse(200,[]));			
			}else{
				callback(commonFunction.callbackResponse(503,[]));			
			}
		})
	},
	sendSignupEmail  : (mailParams , callback)=>{
		mailServer.sendSignupEmail(mailParams, (mailResponse)=>{
		    console.log(mailResponse);
		    
			if(mailResponse && typeof mailResponse.ErrorCode !== 'undefined' && mailResponse.ErrorCode == 0){
				callback(commonFunction.callbackResponse(200,[]));
				
			}else{
			    callback(commonFunction.callbackResponse(503,[]));				
			}
		})
	},
	sendSignupEmailRegistered : (mailParams , callback)=>{
		mailServer.sendSignupEmailRegistered(mailParams, (mailResponse)=>{
			if(mailResponse && mailResponse.ErrorCode == 0){
				callback(commonFunction.callbackResponse(200,[]));			
			}else{
				callback(commonFunction.callbackResponse(503,[]));			
			}
		})
	},

	sendOTPSMS : (smsparams , callback)=>{
		smsServer.sendOTPSMS(smsparams,(smsResponse)=>{
			if(smsResponse.sid){
				callback(commonFunction.callbackResponse(200,[]));			
			}else{
				callback(commonFunction.callbackResponse(503,[]));			
			}
		})
	},

	checkVerificationEmail : (email,type,callback)=>{
		if(email && type){
			let q = "select * from verification_code where email = '"+email+"' and verification_type = '"+type+"' ORDER BY id DESC LIMIT 1";
			db.query(q, (err,rows)=>{
				if(err){
					callback(commonFunction.callbackResponse(500,err));		
				}else{
					if(rows.length == 1){
						let curDate = moment().format('YYYY-MM-DD HH:mm:ss');
						if(curDate >= moment(rows[0].created_at).format('YYYY-MM-DD HH:mm:ss') && curDate <= moment(rows[0].expiry_date).format('YYYY-MM-DD HH:mm:ss')){
							callback(commonFunction.callbackResponse(200,rows[0]));		
						}else{
							callback(commonFunction.callbackResponse(403,rows[0]));	 // email exists and expired verification link	
						}
					}else{
						callback(commonFunction.callbackResponse(404,[]));		
					}
				}
			})
		}
	},
	verifyOTP : (otp,emailphone,callback)=>{
		let query = "SELECT * FROM verification_code WHERE email = '"+emailphone+"' OR mobile = '"+emailphone+"' ORDER BY id DESC LIMIT 1";
		db.query(query,(err,rows)=>{
			if(err){
				callback(commonFunction.callbackResponse(500,err));		
			}else{
				if(rows.length == 1){
					let curDate = moment().format('YYYY-MM-DD HH:mm:ss');
					if(otp == rows[0].verification_code && curDate >= moment(rows[0].created_at).format('YYYY-MM-DD HH:mm:ss') && curDate <= moment(rows[0].expiry_date).format('YYYY-MM-DD HH:mm:ss')){
						callback(commonFunction.callbackResponse(200,rows[0]));	
					}else{
						callback(commonFunction.callbackResponse(403,[]));	
					}
				}else{
					callback(commonFunction.callbackResponse(404,[])); // invalid token
				}
			}	
		})
	},
	updatePassword : (params,callback)=>{
		let query = "SELECT * FROM verification_code WHERE email = '"+emailphone+"' OR mobile = '"+emailphone+"' ORDER BY id DESC LIMIT 1";
		db.query(query,(err,rows)=>{
			if(err){
				callback(commonFunction.callbackResponse(500,err));		
			}else{
				if(rows.length == 1){
					let curDate = moment().format('YYYY-MM-DD HH:mm:ss');
					if(otp == rows[0].verification_code && curDate >= moment(rows[0].created_at).format('YYYY-MM-DD HH:mm:ss') && curDate <= moment(rows[0].expiry_date).format('YYYY-MM-DD HH:mm:ss')){
						callback(commonFunction.callbackResponse(200,rows[0]));	
					}else{
						callback(commonFunction.callbackResponse(403,[]));	
					}
				}else{
					callback(commonFunction.callbackResponse(404,[])); // invalid token
				}
			}	
		})
	},
	verifyEmailLink : (verification_code , callback)=>{
		let query = "SELECT id,user_id,email,verification_code,verification_type,expires_in,expiry_date,created_at FROM verification_code WHERE verification_code = '"+verification_code+"' AND status = 0 ORDER BY id DESC LIMIT 1";
		db.query(query, (err,rows)=>{
			if(err){
				callback(commonFunction.callbackResponse(500,err));		
			}else{
				if(rows.length == 1){
					callback(commonFunction.callbackResponse(200,rows[0]));		
				}else{
					callback(commonFunction.callbackResponse(404,[]));		
				}
			}
		})		
	},

	checkSocialUser : (params , callback)=>{
		let q;
		switch(params.mode){
			case 'facebook':
			if(params.email && params.fb_id){
				q = "select * from users where  email = '"+params.email+"' and fb_id = '"+params.fb_id+"'";	
			}else{
				q = "select * from users where   fb_id = '"+params.fb_id+"'";	
			}	
			break;
			case 'gmail':
				q = "select * from users where  email = '"+params.email+"'";
			break;
		}
		db.query(q,(err,rows)=>{
			if(err){
				callback(commonFunction.callbackResponse(500,err));		
			}else{
				if(rows.length == 1){
					callback(commonFunction.callbackResponse(200,rows[0]));	
				}else{
					callback(commonFunction.callbackResponse(404,[]));	
				}
			}
		})
	}
}