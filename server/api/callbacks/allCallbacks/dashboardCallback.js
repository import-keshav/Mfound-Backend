/* node server -- dashboard callback functions file
Name:- callback.js
Created On:- 27/10/18
*/
const db = require('../../../db/db');
const bcrypt = require('bcrypt');
const moment = require('moment');
//const async = require('async');
const mailServer = require('../../mailServer/mailServer');
const notify = require('../../notifications/pushNotification');
const commonFunction = require('./commonFunction');
module.exports = {
	getDashboardData : (params,callback)=>{
		switch(params.role){
			case 'admin':
			let q = "SELECT  'users' tablename,  COUNT(*) rows FROM users WHERE role != 'admin' UNION SELECT  'lost' tablename, COUNT(*) rows  FROM lost UNION  SELECT 'found' tablename , COUNT(*) rows  FROM found UNION  SELECT  'donate' tablename , COUNT(*) rows FROM donate UNION SELECT  'enquiry' tablename , COUNT(*) rows  FROM enquiry UNION SELECT 'docs' tablename , COUNT(*) rows  FROM docs ";
			db.query(q , (err,rows)=>{
				if(err){
					callback(commonFunction.callbackResponse(500,err));		
				}else{
					if(rows && rows.length > 0){
						callback(commonFunction.callbackResponse(200,rows)); 
					}else{
						callback(commonFunction.callbackResponse(404,[])); 
					}
				}
				
			})

			break;
		}
	}
}