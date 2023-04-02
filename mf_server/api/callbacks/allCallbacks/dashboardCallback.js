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
                         let q = "SELECT  'users' tablename,  COUNT(*) rows FROM users WHERE role != 'admin' UNION SELECT  'pricing' tablename, COUNT(*) rows  FROM pricing  UNION SELECT  'lost' tablename, COUNT(*) rows  FROM lost UNION  SELECT 'found' tablename , COUNT(*) rows  FROM found UNION  SELECT  'donate' tablename , COUNT(*) rows FROM donate UNION SELECT  'enquiry' tablename , COUNT(*) rows  FROM enquiry UNION SELECT 'docs' tablename , COUNT(*) rows  FROM docs  UNION SELECT 'wefound' tablename , COUNT(*) rows  FROM wefound  UNION SELECT 'payment' tablename , COUNT(*) rows  FROM payment UNION SELECT 'banners' tablename , COUNT(*) rows  FROM banners UNION SELECT 'services' tablename , COUNT(*) rows  FROM services UNION SELECT 'prizes' tablename , COUNT(*) rows  FROM prizes UNION SELECT 'winners' tablename , COUNT(*) rows  FROM winners  UNION SELECT 'videos' tablename , COUNT(*) rows  FROM videos  UNION SELECT 'qr_image' tablename , COUNT(*) rows  FROM qr_image UNION SELECT 'products' tablename , COUNT(*) rows  FROM products UNION SELECT 'product_category' tablename , COUNT(*) rows  FROM product_category UNION SELECT 'orders' tablename , COUNT(*) rows  FROM orders UNION SELECT 'qr_codes'  tablename , COUNT(*) rows   FROM qr_codes ";
			//let q = "SELECT  'users' tablename,  COUNT(*) rows FROM users WHERE role != 'admin' UNION SELECT  'pricing' tablename, COUNT(*) rows  FROM pricing  UNION SELECT  'lost' tablename, COUNT(*) rows  FROM lost UNION  SELECT 'found' tablename , COUNT(*) rows  FROM found UNION  SELECT  'donate' tablename , COUNT(*) rows FROM donate UNION SELECT  'enquiry' tablename , COUNT(*) rows  FROM enquiry UNION SELECT 'docs' tablename , COUNT(*) rows  FROM docs  UNION SELECT 'wefound' tablename , COUNT(*) rows  FROM wefound  UNION SELECT 'payment' tablename , COUNT(*) rows  FROM payment UNION SELECT 'banners' tablename , COUNT(*) rows  FROM banners UNION SELECT 'services' tablename , COUNT(*) rows  FROM services UNION SELECT 'prizes' tablename , COUNT(*) rows  FROM prizes UNION SELECT 'winners' tablename , COUNT(*) rows  FROM winners  UNION SELECT 'videos' tablename , COUNT(*) rows  FROM videos  UNION SELECT 'qr_image' tablename , COUNT(*) rows  FROM qr_image UNION SELECT 'products' tablename , COUNT(*) rows  FROM products  ";//UNION SELECT 'product_category' tablename , COUNT(*) rows  FROM product_category
			db.query(q , (err,rows)=>{
				if(err){
					callback(commonFunction.callbackResponse(500,err));		
				}else{
					if(rows && rows.length > 0){
						console.log(rows)
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
