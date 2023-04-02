/* node server -- callback functions file
Name:- callback.js
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
       checkAppVersion : (params , callback)=>{
		let q;
		(params.android_version) ? ( q = "SELECT * from app_version WHERE android_version = '"+params.android_version+"'" ) : '';
		(params.ios_version) ? ( q = "SELECT * from app_version WHERE ios_version = '"+params.ios_version+"'" ) : '';
		db.query( q ,(err,rows)=>{
			
			if(err){
				callback(commonFunction.callbackResponse(500,err))
			}else{
				if(rows.length == 1){
					callback(commonFunction.callbackResponse(200,[]))			
				}else{
					callback(commonFunction.callbackResponse(404,[]))			
				}
			}
		})
	},



	getAllDeviceToken : (callback)=>{
		let q = " SELECT notification_tokens.device_notification_id, users.device FROM notification_tokens INNER JOIN users ON users.device_token = notification_tokens.device_token ORDER BY users.id DESC "
		db.query(q , (err,rows)=>{
			if(err){
				callback(commonFunction.callbackResponse(500,err));			
			}else{
				if(rows.length > 0){
					callback(commonFunction.callbackResponse(200,rows));			
				}else{
					callback(commonFunction.callbackResponse(404,[]));						
				}
			}		
		})	
	},

	getDeviceNotificationToken : (user_id,callback)=>{
		if(user_id){
			let q = "SELECT users.device, users.mobile,  users.email as email_found ,  notification_tokens.device_notification_id FROM notification_tokens INNER JOIN users ON users.device_token = notification_tokens.device_token WHERE users.id = "+user_id+" ";
			db.query(q , (err,rows)=>{
				console.log(err)
				if(err){
					callback(commonFunction.callbackResponse(500,err));			
				}else{
					if(rows.length > 0){
						callback(commonFunction.callbackResponse(200,rows[0]));			
					}else{
						callback(commonFunction.callbackResponse(404,[]));						
					}
				}		
			})	
		}else{
			callback(commonFunction.callbackResponse(404,[]));			
		}
	},

	getHomeData : (id , callback)=>{
		let q1,q2,q3,q4,q5,q6;
		let response = {}
		q1 = "SELECT * FROM banners ORDER BY id ASC";
		db.query(q1 , (err1,rows1)=>{
			if(err1){
				callback(commonFunction.callbackResponse(500,err1));		
			}else{
				response.banners = rows1		
				q2 = "SELECT * FROM services  ORDER BY id DESC";
				db.query(q2 , (err2,rows2)=>{
					if(err2){
						callback(commonFunction.callbackResponse(500,err2));		
					}else{
						response.services = rows2		
						q3 = "SELECT * FROM wefound  ORDER BY id DESC";
						db.query(q3 , (err3,rows3)=>{
							if(err3){
								callback(commonFunction.callbackResponse(500,err3));		
							}else{
								response.wefound = rows3		
								q4 = "SELECT * FROM winners  ORDER BY id DESC";
								db.query(q4 , (err4,rows4)=>{
									if(err4){
										callback(commonFunction.callbackResponse(500,err4));		
									}else{
										response.winners = rows4		
										q5 = "SELECT * FROM prizes  ORDER BY id DESC";
										db.query(q5 , (err5,rows5)=>{
											if(err5){
												callback(commonFunction.callbackResponse(500,err5));		
											}else{
												response.prizes = rows5		

												q6 = "SELECT * FROM videos  ORDER BY id ASC";
												db.query(q6 , (err6,rows6)=>{
													if(err6){
														callback(commonFunction.callbackResponse(500,err6));		
													}else{
														response.videos = rows6		
														callback(commonFunction.callbackResponse(200,response));		
													}
												})
											}
										})
									}
								})
							}
						})
					}
				})
			}
		})
	},
	jsonResponse : (code,message,data)=>{
		let response = {};
		response.statusCode = code;
		response.message = message;
		(data.length != 0)?(response.result = data):'';
		return response;
	},
	
	emailVerificationCode : (len)=>{
		let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    	let token = '';
    	for (var i = len; i > 0; --i) {
      		token += chars[Math.round(Math.random() * (chars.length - 1))];
    	}

    	return token;
	},
	orderNoDynamicGenerate : (len)=>{
		let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    	let token = '';
    	for (var i = len; i > 0; --i) {
      		token += chars[Math.round(Math.random() * (chars.length - 1))];
    	}

    	return token;
	},

	selectData : (select, whereCondition ,table,callback)=>{
		let q ,where = "",join="",order="";
		if(table == 'lost'){
			select = ' lost.*, payment.status   '  ; //FROM lost 
			join = ' LEFT JOIN payment ON payment.user_id = lost.id ';order = " ORDER BY lost.id DESC  ";
		}else if(table == 'docs'){
			select = ' docs.*, payment.status   '; //FROM docs 
			join = ' LEFT JOIN payment ON payment.docs_id = docs.id '
		}else if(table == 'cart'){
                select = ' cart.*, cart.id as cart_id , product_category.* '; join = '  LEFT JOIN product_category on product_category.id = cart.product_id '; 
               }
		
		
		//(table == 'users')? where = ' role != \'admin\' ':'';
		
		if(whereCondition){
			Object.keys(whereCondition).map(function(key, index) {
	  	 		where+=(table+'.'+key+' = "'+whereCondition[key]+'"'+(((index+1)<Object.keys(whereCondition).length)?' AND ':''));
			});
		}
		
		(where != '')?where = " WHERE "+where:''; 	
               let orderBy = (table == 'banners' || table == 'videos' || table == 'products'  ) ? ' ORDER BY id   ASC  ' : '  ORDER BY '+table+'.id DESC    '
		q = "SELECT  "+select+" FROM  "+table+"  "+ join +"  "+ where +"  "+ orderBy  +"   ";
              console.log(q);

		

		if(q && q !== ''){
			db.query(q, (err,rows)=>{ console.log(q);console.log(rows);console.log(err);
				if(err){
					callback(commonFunction.callbackResponse(500,err));
				}else{
					if(rows.length > 0){
						callback(commonFunction.callbackResponse(200,rows));	
					}else{
						callback(commonFunction.callbackResponse(404,[]));	
					}
				}
			})
		}
	},
	insertIntoTable : (params,table,callback)=>{
		let q;
		if(table == 'user_addresses'){
			q = "INSERT IGNORE INTO "+table+" set ?";
		}else{
			q = "INSERT INTO "+table+" set ?";
		}
		db.query(q , params , (err,rows)=>{
			if(err){
				callback(commonFunction.callbackResponse(500,err));
			}else{
				if(rows.affectedRows > 0){
					callback(commonFunction.callbackResponse(200,rows));	
				}else{
					callback(commonFunction.callbackResponse(503,[]));	
				}

			}
		})
	},

	deleteFromTable : (whereCondition , table , callback)=>{
		let query2 = "";
		Object.keys(whereCondition).map(function(key, index) {
  	 		query2+=(key+' = "'+whereCondition[key]+'"'+(((index+1)<Object.keys(whereCondition).length)?' AND ':''));
		});
		let q = "DELETE FROM "+table+" WHERE  "+query2+"";
		db.query(q , (err, rows)=>{
			if(err){
				callback(commonFunction.callbackResponse(500,err));
			}else{
				if(rows.affectedRows > 0){
					callback(commonFunction.callbackResponse(200,rows));	
				}else{
					callback(commonFunction.callbackResponse(503,[]));	
				}

			}
		})

	},

	updateTable : (queryString , whereCondition , table , callback)=>{
		
		let query1 = "";
		Object.keys(queryString).map(function(key, index) {
  	 		query1+=(key+' =  "'+queryString[key]+'"'+(((index+1)<Object.keys(queryString).length)?' , ':''));
		});
		let query2 = "";
		Object.keys(whereCondition).map(function(key, index) {
  	 		query2+=(key+' = '+whereCondition[key]+(((index+1)<Object.keys(whereCondition).length)?' AND ':''));
		});
		let q = "UPDATE "+table+" SET  "+query1+" WHERE "+query2+"";
		db.query(q , (err, rows)=>{
			
			if(err){
				callback(commonFunction.callbackResponse(500,err));
			}else{
				if(rows.affectedRows > 0){
					callback(commonFunction.callbackResponse(200,rows));	
				}else{
					callback(commonFunction.callbackResponse(503,[]));	
				}

			}
		})
	},
	validateAuthToken : (token,table,callback)=>{
		let query = "SELECT * FROM  "+table+"  WHERE token = '"+token+"'";
		db.query(query,(err,rows)=>{
			if(err){
				callback(commonFunction.callbackResponse(500,err));		
			}else{
				if(rows.length == 1){
					callback(commonFunction.callbackResponse(200,rows[0])); //user validated
				}else{
					callback(commonFunction.callbackResponse(404,[])); // invalid token
				}
			}	
		})
	},
	searchByKey :(params,callback)=>{
		let q;
		switch(params.role){
			case 'users':
			where = " first_name  LIKE '%"+params.key+"%'  OR last_name  LIKE '%"+params.key+"%'  OR  email  LIKE '%"+params.key+"%'  OR  first_name  LIKE '%"+params.key+"%'  OR  first_name  LIKE '%"+params.key+"%'  OR  first_name  LIKE '%"+params.key+"%'  OR  first_name  LIKE '%"+params.key+"%'  OR  first_name  LIKE '%"+params.key+"%'  OR  "
			break;
			case 'lost':
			break;
			case 'found':
			break;
			case 'docs':
			break;
			case 'enquiry':
			break;
			case 'donate':
			break;

		}
		let query = "SELECT * FROM  "+params.role+"  WHERE token = '"+token+"'";
		db.query(query,(err,rows)=>{
			if(err){
				callback(commonFunction.callbackResponse(500,err));		
			}else{
				if(rows.length == 1){
					callback(commonFunction.callbackResponse(200,rows[0])); //user validated
				}else{
					callback(commonFunction.callbackResponse(404,[])); // invalid token
				}
			}	
		})
	}
}
