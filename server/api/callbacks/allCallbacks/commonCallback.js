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
		let q ,where = "";
		(table == 'users')? where = ' role <> \'admin\' ':'';
		if(whereCondition && whereCondition.length > 0){
			Object.keys(whereCondition).map(function(key, index) {
	  	 		where+=(key+' = "'+whereCondition[key]+'"'+(((index+1)<Object.keys(whereCondition).length)?' AND ':''));
			});
		}
		(where != '')?where = " WHERE "+where:''; 	
		q = "SELECT  "+select+" FROM  "+table+" "+ where +" ORDER BY id DESC  ";
		if(q && q !== ''){
			db.query(q, (err,rows)=>{
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