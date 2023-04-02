/* node server -- auth controller file
Name:- authController.js
Created On:- 27/08/18
*/
const db = require('../../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const moment = require('moment');
const logger = require('../logger/logger')
const callbacks = require('../callbacks/callbacks')
// api url - /api/v2/auth/signup
exports.signup = (req,res)=>{
	let params = {};

	params.first_name = req.body.firstName
	params.last_name = req.body.lastName
	params.password = req.body.password
	params.email = req.body.email
	params.mobile = req.body.mobile
	params.dob = req.body.dob
	params.gender = req.body.gender
	params.address = req.body.address
	params.city = req.body.city
	params.state = req.body.state
	params.zip = req.body.zip
	params.country = req.body.country
	params.role = (req.body.role) ? req.body.role : '';  // users , admin
	if(params.role != 'admin'){
		params.device = req.body.device
		params.device_token = req.body.deviceToken
	}
	if(!params){
		res.status(400).json(callbacks.commonCallback.jsonResponse(400,'Bad Request',[]));	
		return false;
	}
	let validParams = {};validParams.email = params.email;validParams.method = 'signup';validParams.role = params.role;
	callbacks.authCallback.checkUserCallback(validParams, (response)=>{
		switch(response.statusCode){
			case 200:
				res.status(409).json(callbacks.commonCallback.jsonResponse(409,'Already Exists',[]));	
			break;
			case 404:
			params.password = bcrypt.hashSync(params.password,10);
			callbacks.commonCallback.insertIntoTable(params , 'users' , (response4)=>{
				switch(response4.statusCode){
					case 200:
					let verifyParams = {};
					verifyParams.user_id = response4.result.insertId;
					verifyParams.email = params.email;
					verifyParams.verification_code = callbacks.commonCallback.emailVerificationCode(16);
					verifyParams.verification_type = "SignUp Verification";
					verifyParams.expires_in = config.emailExpiryTime;
					verifyParams.expiry_date = moment().add(config.emailExpiryTime, 'm').format('YYYY-MM-DD HH:mm:ss');
					callbacks.commonCallback.insertIntoTable(verifyParams, 'verification_code' , (response3)=>{
						switch(response3.statusCode){
							case 200:
							let mailParams = {};
							mailParams.type=((params.role == 'admin')? 'admin':'users');
							mailParams.from = config.mailFrom;
							mailParams.to = params.email;
							mailParams.verification_code = verifyParams.verification_code;
							callbacks.authCallback.sendSignupEmail(mailParams, (response2)=>{
								switch(response2.statusCode){
									case 200:
									res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',[]));
									break;
									case 503:
										res.status(503).json(callbacks.commonCallback.jsonResponse(503,'Service Unavailable',[]));		
									break;
								}
							})
							break;
							case 500:
							res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/auth/signup',response3);		
							break;
							case 503:
							res.status(503).json(callbacks.commonCallback.jsonResponse(503,'Service Unavailable',[]));		
							break;
						}
					})
					break;
					case 500:
					res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/auth/signup',response4);							
					break;
					case 503:
					res.status(503).json(callbacks.commonCallback.jsonResponse(503,'Service Unavailable',[]));		
					break;
				}
			})
			break;
			case 500:
			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/auth/signup',response);							
			break;
		}
	})
}
// api url - /api/v2/auth/login
exports.login = (req,res)=>{
	let params = {};
	params.email = req.body.email;
	params.password = req.body.password;
	params.role = (req.body.role) ? req.body.role : '';  
	if(!params.email || !params.password){
		res.status(400).json(callbacks.commonCallback.jsonResponse(400,'Bad Request',[]));	
		return false;
	}
	params.method = 'login';
	callbacks.authCallback.checkUserCallback(params,(response)=>{
		switch(response.statusCode){
			case 200: 
				let token = jwt.sign(
					{email : params.email},
					config.secret,
					{expiresIn:86400} 
				);
				let queryString =  {};
				queryString.is_active = 1;
				queryString.token =    token;
				let whereCondition = {};
				whereCondition.id = response.result.id;
				callbacks.commonCallback.updateTable( queryString , whereCondition  , 'users' , (response2)=>{
					switch(response2.statusCode){
						case 200:
						let loginResponseData = {};
						loginResponseData.token = token;
						loginResponseData.id = response.result.id;
						loginResponseData.role = response.result.role;
						res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',loginResponseData));
						break;
						case 500:
						res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/auth/login',response2);
						break;
						case 503:
						res.status(503).json(callbacks.commonCallback.jsonResponse(503,'Service Unavailable',[]));
						break;
					}
				})
			break;
			case 403:
				callbacks.authCallback.checkVerificationEmail(params.email,'SignUp Verificaiton' , (response3)=>{
					switch(response3.statusCode){
						case 200 : 
						res.status(403).json(callbacks.commonCallback.jsonResponse(403,'Forbidden',[]));		
						break;
						case 403 : 
						let verifyParams = {};
						verifyParams.user_id = response3.result.user_id;
						verifyParams.email = response3.result.email;
						verifyParams.verification_code = callbacks.commonCallback.emailVerificationCode(16);
						verifyParams.verification_type = "SignUp Verificaiton";
						verifyParams.expires_in = config.emailExpiryTime;
						verifyParams.expiry_date = moment().add(config.emailExpiryTime, 'm').format('YYYY-MM-DD HH:mm:ss');
						callbacks.commonCallback.insertIntoTable(verifyParams, 'verification_code' , (response4)=>{
							switch(response4.statusCode){
								case 200:
								let mailParams = {};
								mailParams.type=((params.role == 'admin')? 'admin':'users');
								mailParams.from = config.mailFrom;
								mailParams.to = params.email;
								mailParams.verification_code = verifyParams.verification_code;
								callbacks.authCallback.sendEmailOTP(mailParams, (response5)=>{
									switch(response5.statusCode){
										case 200:
										res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',[]));
										break;
										case 503:
											res.status(503).json(callbacks.commonCallback.jsonResponse(503,'Service Unavailable',[]));		
										break;
									}
								})
								break;
								case 500:
								res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/auth/signup',response4);		
								break;
								case 503:
								res.status(503).json(callbacks.commonCallback.jsonResponse(503,'Service Unavailable',[]));		
								break;
							}
						})
						break;
						case 500:
						res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/auth/login',response2);	
						break;
						case 404:
						res.status(404).json(callbacks.commonCallback.jsonResponse(404,'Not Found',[]));		
						break;
						default:
						res.status(503).json(callbacks.commonCallback.jsonResponse(503,'Service Unavailable',[]));		
						break;
					}
				})
			break;
			case 401: 
				res.status(401).json(callbacks.commonCallback.jsonResponse(401,'Unauthorized Access',[]));
			break;
			case 404:
				res.status(404).json(callbacks.commonCallback.jsonResponse(404,'Not Found',[]));
			break;
			case 500:
				res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/auth/login',response);
			break;
			default:
				res.status(503).json(callbacks.commonCallback.jsonResponse(503,'Service Unavailable',[]));
		}
	}) 
}
// api url - /api/v2/auth/forgetPassword
exports.forgetPassword = (req,res)=>{
	let params = {};
	params.email = req.body.email;
	if(!params){
		res.status(400).json(callbacks.commonCallback.jsonResponse(400,'Bad Request',[]));	
		return false;
	}
	params.role = (req.body.role) ? req.body.role : '';
	params.method = 'forgetPassword'; 
	callbacks.authCallback.checkUserCallback(params,(response)=>{
		switch(response.statusCode){
			case 200: 
			let verifyParams = {};
			verifyParams.user_id = response.result.id;
			verifyParams.email = params.email;
			verifyParams.verification_code = Math.floor(100000 + Math.random() * 900000);
			verifyParams.verification_type = "Forget Password";
			verifyParams.expires_in = config.emailExpiryTime;
			verifyParams.expiry_date = moment().add(config.emailExpiryTime, 'm').format('YYYY-MM-DD HH:mm:ss');
			callbacks.commonCallback.insertIntoTable(verifyParams, 'verification_code' , (response4)=>{
				switch(response4.statusCode){
					case 200:
					let mailParams = {};
					mailParams.type=((params.role == 'admin')? 'admin':'users');
					mailParams.from = config.mailFrom;
					mailParams.to = params.email;
					mailParams.otp = verifyParams.verification_code;
					callbacks.authCallback.sendEmailOTP(mailParams, (response5)=>{
						switch(response5.statusCode){
							case 200:
							res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',[]));
							break;
							case 503:
								res.status(503).json(callbacks.commonCallback.jsonResponse(503,'Service Unavailable',[]));		
							break;
						}
					})
					break;
					case 500:
					res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/auth/signup',response4);		
					break;
					case 503:
					res.status(503).json(callbacks.commonCallback.jsonResponse(503,'Service Unavailable',[]));		
					break;
				}
			})
			break;
			case 403:
				res.status(403).json(callbacks.commonCallback.jsonResponse(403,'Forbidden',[]));
			break;	
			case 404:
				res.status(404).json(callbacks.commonCallback.jsonResponse(404,'Not Found',[]));	
			break;
			case 500:
				res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/auth/forgetPassword',response);		
			break;
			default: // service unavailable
				res.status(503).json(callbacks.commonCallback.jsonResponse(503,'Service Unavailable',[]));
		}
	})
}
// api url - /api/v2/auth/verifyOTP:/:type/:emailphone/:otp
exports.verifyOTP = (req,res)=>{
	callbacks.authCallback.verifyOTP(req.params.otp ,req.params.emailphone , (response)=>{
		switch(response.statusCode){
			case 200:
			switch(req.params.type){
				case 'email':
				res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',[]));		
				break;
				case 'mobile':
				let queryString =  {};
				queryString.is_mobile_verified = 1 ;
				queryString.mobile = req.params.emailphone;
				let whereCondition = {};
				whereCondition.id =   response.result.user_id;
				callbacks.commonCallback.updateTable( queryString , whereCondition  , 'users' , (response2)=>{
					switch(response2.statusCode){
						case 200:
						res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',[]));				
						break;
						case 500:
						res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/auth/verifyOTP',response2);		
						break;
						case 503:
						res.status(503).json(callbacks.commonCallback.jsonResponse(503,'Service Unavailable',[]));		
						break;
					}
				})

				break;
			}
			break;
			case 403:
			res.status(403).json(callbacks.commonCallback.jsonResponse(403,'Forbidden',[]));		
			break;
			case 404:
			res.status(404).json(callbacks.commonCallback.jsonResponse(404,'Not Found',[]));
			break;
			case 500:
			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/auth/verifyOTP',response);
			break;
		}
	})
}
// api url - /api/v2/auth/updatePassword
exports.updatePassword = (req,res)=>{
	let params = {};
	params.password = req.body.password;
	params.email = req.body.email;
	params.otp = req.body.otp;
	if(!params){
		res.status(400).json(callbacks.commonCallback.jsonResponse(400,'Bad Request',[]));	
		return false;
	}
	params.role = (req.body.role) ? req.body.role : '';
	callbacks.authCallback.verifyOTP(params.otp , params.email , (response)=>{
		switch(response.statusCode){
			case 200:
			params.password = bcrypt.hashSync(params.password,10);
			let queryString =  {};
			queryString.password = params.password ;
			let whereCondition = {};
			whereCondition.email = "'"+params.email+"'" ;
			callbacks.commonCallback.updateTable( queryString , whereCondition  , 'users' , (response2)=>{
				switch(response2.statusCode){
					case 200:
					res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',[]));		
					break;
					case 500:
					res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/auth/updatePassword',response);
					break;
					case 503:
					res.status(503).json(callbacks.commonCallback.jsonResponse(503,'Service Unavailable',[]));		
					break;
				}
			})
			break;
			case 403:
			res.status(403).json(callbacks.commonCallback.jsonResponse(403,'Forbidden',[]));		
			break;
			case 404:
			res.status(404).json(callbacks.commonCallback.jsonResponse(404,'Not Found',[]));
			break;
			case 500:
			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/auth/updatePassword',response);
			break;
		}
	})
}
// api url - /api/v2/auth/changePassword
exports.changePassword = (req,res)=>{
	let authToken = req.headers.x_auth_token;
	if(!authToken){
		res.status(401).json(callbacks.commonCallback.jsonResponse(401,'Unauthorized Access',[]));	
		return false;
	}
	let params = {};
	params.password = req.body.password;
	params.email = req.body.email;
	params.newPassword = req.body.newPassword;
	if(!params){
		res.status(400).json(callbacks.commonCallback.jsonResponse(400,'Bad Request',[]));	
		return false;
	}
	params.role = (req.body.role) ? req.body.role : '';
	callbacks.commonCallback.validateAuthToken(authToken, 'users' , (response)=>{
		switch(response.statusCode){
			case 200:
			params.method = "changePassword";
			callbacks.authCallback.checkUserCallback(params, (response2)=>{
				switch(response2.statusCode){
					case 200:
					params.newPassword = bcrypt.hashSync(params.newPassword,10);
					let queryString =  {};
					queryString.password = "'"+params.newPassword+"'" ;
					let whereCondition = {};
					whereCondition.id = response.result.id;
					callbacks.commonCallback.updateTable( queryString , whereCondition  , ((params.role == 'admin')? 'admin':'users') , (response2)=>{
						switch(response3.statusCode){
							case 200:
							res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',[]));		
							break;
							case 500:
							res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/auth/changePassword',response3);
							break;
							case 503:
							res.status(503).json(callbacks.commonCallback.jsonResponse(503,'Service Unavailable',[]));		
							break;
						}
					})
					break;
					case 401:
					res.status(401).json(callbacks.commonCallback.jsonResponse(401,'Unauthorized Access',[]));		
					break;
					case 404:
					res.status(404).json(callbacks.commonCallback.jsonResponse(404,'Not Found',[]));		
					break;
					case 500:
					res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/auth/changePassword',response2);
					break;
				}
			})
			break;
			case 404:
			res.status(404).json(callbacks.commonCallback.jsonResponse(404,'Not Found',[]));		
			break;
			case 500:
			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/auth/changePassword',response);
			break;
		}
	})
}
// api url - /api/v2/auth/logout
exports.userLogout = (req,res)=>{
	let authToken = req.headers.x_auth_token;
	if(!authToken){
		res.status(401).json(callbacks.commonCallback.jsonResponse(401,'Unauthorized Access',[]));	
		return false;
	}
	let params = {};
	params.role = (req.body.role) ? req.body.role : '';
	if(!params){
		res.status(400).json(callbacks.commonCallback.jsonResponse(400,'Bad Request',[]));	
		return false;
	}
	callbacks.commonCallback.validateAuthToken(authToken, 'users' ,  (response)=>{
		switch(response.statusCode){
			case 200:
			let queryString =  {};
			queryString.is_active = 0;
			queryString.token = null;
			let whereCondition = {};
			whereCondition.id = response.result.id;
			callbacks.commonCallback.updateTable( queryString , whereCondition  , ((params.role == 'admin')? 'admin':'users') , (response2)=>{
				switch(response2.statusCode){
					case 200:
					res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',[]));		
					break;
					case 500:
					res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/auth/changePassword',response2);
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
			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/auth/logout',response);
			break;
		}
	})
}
// api url - /emailVerification/:type/:verification_code
exports.emailVerification = (req,res)=>{
	callbacks.authCallback.verifyEmailLink(req.params.verification_code , (response)=>{
		switch(response.statusCode){
			case 200:
			let curDate = moment().format('YYYY-MM-DD HH:mm:ss');
			if(curDate >= moment(response.result.created_at).format('YYYY-MM-DD HH:mm:ss') && curDate <= moment(response.result.expiry_date).format('YYYY-MM-DD HH:mm:ss')){
				let queryString =  {};
				queryString.is_email_verified = 1;
				let whereCondition = {};
				whereCondition.id = response.result.user_id;
				callbacks.commonCallback.updateTable( queryString , whereCondition  , req.params.type , (response2)=>{
					switch(response2.statusCode){
						case 200:
						let queryString =  {};
						queryString.status = 1;
						let whereCondition = {};
						whereCondition.id = response.result.id;
						callbacks.commonCallback.updateTable( queryString , whereCondition  , 'verification_code' , (response3)=>{
							switch(response3.statusCode){
								case 200:
								let mailParams = {};
								mailParams.from = config.mailFrom;
								mailParams.to = response.result.email;
								callbacks.authCallback.sendSignupEmailRegistered(mailParams, (response5)=>{
									switch(response5.statusCode){
										case 200:
										res.set('Content-Type', 'text/html');res.send(new Buffer('<h2 class="text-center">Email Verified Successfully!</h2>'));
										break;
										case 503:
										res.set('Content-Type', 'text/html');res.send(new Buffer('<h2 class="text-center">Email Verified Successfully!</h2>'));
										break;
									}
								})
								break;
								case 500:
								res.set('Content-Type', 'text/html');res.send(new Buffer('<h2 class="text-center">Sorry, Email Not Verified!</h2>'));
								break;
								case 503:
								res.set('Content-Type', 'text/html');res.send(new Buffer('<h2 class="text-center">Sorry, Email Not Verified!</h2>'));
								break;
							}
						})
						break;
						case 500:
						res.set('Content-Type', 'text/html');res.send(new Buffer('<h2 class="text-center">Sorry, Email Not Verified!</h2>'));logger.error('API - /api/v2/auth/emailVerification',response);		
						break;
						case 503:
						res.set('Content-Type', 'text/html');res.send(new Buffer('<h2 class="text-center">Sorry, Email Not Verified!</h2>'));
						break;
					}
				})	
			}else{
				res.set('Content-Type', 'text/html');res.send(new Buffer('<h2 class="text-center">Email Link Expired!</h2>'));
			}
			break;
			case 404:
			res.set('Content-Type', 'text/html');res.send(new Buffer('<h2 class="text-center">Sorry, Email Not Verified!</h2>'));
			break;
			case 500:
			res.set('Content-Type', 'text/html');res.send(new Buffer('<h2 class="text-center">Sorry, Email Not Verified!</h2>'));logger.error('API - /api/v2/auth/emailVerification',response);		
			break;
		}
	})
}
// api url - /api/v2/auth/signInWithSocial
exports.signInWithSocial = (req,res)=>{
	let params = {};
	params.mode = req.body.mode;
	switch(params.mode){
		case 'facebook':
		params.fb_id = req.body.fb_id;
		(req.body.email)? (params.email = req.body.email) : '';
		break;
		case 'gmail':
		params.email = req.body.email;
		break;
	}
	if(!params){
		res.status(400).json(callbacks.commonCallback.jsonResponse(400,'Bad Request',[]));	
		return false;
	}
	callbacks.authCallback.checkSocialUser(params , (response)=>{
		switch(response.statusCode){
			case 500:
			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/auth/signInWithFB',response);		
			break;
			case 200: 
			let token = jwt.sign(
				{email : (params.email) ? params.email : params.fb_id   },
				config.secret,
				{expiresIn:86400} 
			);
			let queryString =  {};
			queryString.is_active = 1;
			queryString.token = token;
			let whereCondition = {};
			whereCondition.id = response.result.id;
			callbacks.commonCallback.updateTable( queryString , whereCondition  , 'users' , (response2)=>{
				switch(response2.statusCode){
					case 200:
					let loginResponseData = {};
					loginResponseData.token = token;
					loginResponseData.id = response.result.id;
					loginResponseData.role = response.result.role;
					res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',loginResponseData));								
					break;
					case 500:
					res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/auth/signInWithFB',response2);
					break;
					case 503:
					res.status(503).json(callbacks.commonCallback.jsonResponse(503,'Service Unavailable',[]));		
					break;
				}
			})	
			break; 
			case 404:// user not registered , signup and login the user directly
			(params.email) ? (params.is_email_verified == 1) : (params.is_email_verified == 0);
			delete params.mode;
			callbacks.commonCallback.insertIntoTable(params, 'users' , (response4)=>{
				switch(response4.statusCode){
					case 200:
					let token0 = jwt.sign(
						{email : (params.email) ? params.email : params.fb_id   },
						config.secret,
						{expiresIn:86400} 
					);
					let queryString =  {};
					queryString.is_active = 1;
					queryString.token = token0;
					let whereCondition = {};
					whereCondition.id = response4.result.insertId;
					callbacks.commonCallback.updateTable( queryString , whereCondition  , 'users' , (response5)=>{
						switch(response5.statusCode){
							case 200:
							let loginResponseData = {};
							loginResponseData.token = token0;
							loginResponseData.id = response.result.id;
							loginResponseData.role = response.result.role;
							res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',loginResponseData));								
							break;
							case 500:
							res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/auth/signInWithFB',response5);
							break;
							case 503:
							res.status(503).json(callbacks.commonCallback.jsonResponse(503,'Service Unavailable',[]));		
							break;
						}
					})	
					break;
					case 500:
					res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/auth/signup',response4);		
					break;
					case 503:
					res.status(503).json(callbacks.commonCallback.jsonResponse(503,'Service Unavailable',[]));		
					break;
				}
			})
			break;
			default:
				res.status(503).json(callbacks.commonCallback.jsonResponse(503,'Service Unavailable',[]));
			break;
		}
	})
}
// api url - /api/v2/auth/otp/send --- for verifying phone number
exports.sendOTP = (req,res)=>{
	let authToken = req.headers.x_auth_token;
	if(!authToken){
		res.status(401).json(callbacks.commonCallback.jsonResponse(401,'Unauthorized Access',[]));	
		return false;
	}
	let params = {};
	params.mobile = req.body.mobile;
	params.id = req.body.id;
	if(!params){
		res.status(400).json(callbacks.commonCallback.jsonResponse(400,'Bad Request',[]));	
		return false;
	}
	callbacks.commonCallback.validateAuthToken(authToken, 'users', (response)=>{
		switch(response.statusCode){
			case 200:
			let verifyParams = {};
			verifyParams.user_id = params.id;
			verifyParams.verification_code = Math.floor(100000 + Math.random() * 900000);
			verifyParams.mobile = params.mobile;
			verifyParams.verification_type = "Verify Mobile";
			verifyParams.expires_in = config.emailExpiryTime;
			verifyParams.expiry_date = moment().add(config.emailExpiryTime, 'm').format('YYYY-MM-DD HH:mm:ss');
			callbacks.commonCallback.insertIntoTable(verifyParams, 'verification_code' , (response3)=>{
				switch(response3.statusCode){
					case 200:
					let smsparams = {};
					smsparams.to = '+91'+params.mobile;
					smsparams.msg = verifyParams.verification_code;
					
					callbacks.authCallback.sendOTPSMS(smsparams,(smsResponse)=>{
						switch(smsResponse.statusCode){
							case 200:
							res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',[]));
							break;
							case 503:
								res.status(503).json(callbacks.commonCallback.jsonResponse(503,'Service Unavailable',[]));		
							break;
						}
					})
					break;
					case 500:
					res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/auth/signup',response3);		
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
			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/auth/changePassword',response);
			break;
		}
	})
}








						