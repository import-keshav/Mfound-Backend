/* node server -- found controller file
Name:- foundController.js
Created On:- 05/09/18
*/

require('dotenv').config();
const AWS = require('aws-sdk');
AWS.config.update({region:'us-east-2'});
const rekognition = new AWS.Rekognition({apiVersion: '2016-06-27'});
const fs = require('fs');

const db = require('../../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const moment = require('moment');
const logger = require('../logger/logger')
const async = require('async');
const callbacks = require('../callbacks/callbacks')
const multer = require('multer');
const Storage = multer.diskStorage({
	destination: function (req, file, callback) {
		if(file.fieldname == 'lost_image'){
			callback(null, "./public/media/images/lost");			
		}else if(file.fieldname == 'found_image'){
			callback(null, "./public/media/images/found");	
		}	
	},
	filename: function (req, file, callback) {
	callback(null,file.originalname);
	//callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
	}
});
const upload = multer({ storage: Storage }).any();


// api url - /api/v2/found
exports.found = (req,res)=>{
	let authToken = req.headers.x_auth_token;
	if(!authToken){
		res.status(401).json(callbacks.commonCallback.jsonResponse(401,'Unauthorized Access',[]));	
		return false;
	}
	callbacks.commonCallback.validateAuthToken(authToken, 'users' ,  (response)=>{
		switch(response.statusCode){
			case 200:

			let params = {};
			params.user_id = response.result.id;
			switch(req.body.type){
				case 'person':
				params.type = req.body.type ;
				params.gender = req.body.gender ;
				params.category = req.body.category ;
				params.name = req.body.name ;
			//	params.image = req.body.image ;
				params.age = req.body.age ;
				params.date_of_found = req.body.dateOfFound ;
				params.lat_location = req.body.latLocation ;
				params.long_location = req.body.longLocation ;
				params.address_location = req.body.addressLocation ;
				params.birth_mark = req.body.birthMark ;
				params.body_color = req.body.bodyColor ;
				params.clothes_wear = req.body.clothesWear ;
				params.description = req.body.description ;

				break;
				case 'item':
				params.type = req.body.type ;
				params.date_of_found = req.body.dateOfFound;
				params.lat_location = req.body.latLocation ;
				params.long_location = req.body.longLocation ;
				params.address_location = req.body.addressLocation ;
				params.category = req.body.category ;
				params.brand = req.body.brand ;
			//	params.image = req.body.image ;
				params.color = req.body.color ;	
				params.description = req.body.description ;	
				break;
			}
			if(req.files && req.files.length > 0){
				params.image = req.files[0].originalname ;
				params.thumb_image = req.files[1].originalname ;
			}else{
				params.image = "";
				params.thumb_image="";
			}

			let file = req.files.image[0];
			fs.readFile( file.path , function (err, data) {
				if(err){
					res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/found',err);
					return false
				}else{
					let params = {
					  Key: file.name,
					  Body: file
					};
					const s3bucket = new AWS.S3({params: {Bucket: 'www.mfound.in'}});	
					s3bucket.createBucket(function () {
						var params = {
			                Key:  "found/"+file.originalFilename+" " , 
			                Body: data
			            };
			            s3bucket.upload(params, function (err2, data) {
			            	if(err2){
			            		res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/found',err2);
								return false
			            	}else{
			            		callbacks.commonCallback.insertIntoTable(params , 'found' , (response2)=>{
									switch(response2.statusCode){
										case 200:
						    			res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',[]));
						    			break;
						    			case 500:
						    			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/found',response2);
						    			break;
						    			case 503:
						    			res.status(503).json(callbacks.commonCallback.jsonResponse(503,'Service Unavailable',[]));
						    			break;
									}
								})

			            		fs.unlink(file.path, function (err) {
				                    if (err)throw err;
				                    
				                });
							}
						})
					})
				}
			})



			// upload( req,res , (err)=>{
			// 	let params = {};
			// 	params.user_id = response.result.id;
			// 	switch(req.body.type){
			// 		case 'person':
			// 		params.type = req.body.type ;
			// 		params.gender = req.body.gender ;
			// 		params.category = req.body.category ;
			// 		params.name = req.body.name ;
			// 	//	params.image = req.body.image ;
			// 		params.age = req.body.age ;
			// 		params.date_of_found = req.body.dateOfFound ;
			// 		params.lat_location = req.body.latLocation ;
			// 		params.long_location = req.body.longLocation ;
			// 		params.address_location = req.body.addressLocation ;
			// 		params.birth_mark = req.body.birthMark ;
			// 		params.body_color = req.body.bodyColor ;
			// 		params.clothes_wear = req.body.clothesWear ;
			// 		params.description = req.body.description ;

			// 		break;
			// 		case 'item':
			// 		params.type = req.body.type ;
			// 		params.date_of_found = req.body.dateOfFound;
			// 		params.lat_location = req.body.latLocation ;
			// 		params.long_location = req.body.longLocation ;
			// 		params.address_location = req.body.addressLocation ;
			// 		params.category = req.body.category ;
			// 		params.brand = req.body.brand ;
			// 	//	params.image = req.body.image ;
			// 		params.color = req.body.color ;	
			// 		params.description = req.body.description ;	
			// 		break;
			// 	}
			// 	if(req.files && req.files.length > 0){
			// 		params.image = req.files[0].originalname ;
			// 		params.thumb_image = req.files[1].originalname ;
			// 	}else{
			// 		params.image = "";
			// 		params.thumb_image="";
			// 	}
			// 	if(err){
			// 		res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/found',err);
			// 	}else{
			// 		callbacks.commonCallback.insertIntoTable(params , 'found' , (response2)=>{
			// 			switch(response2.statusCode){
			// 				case 200:
			//     			res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',[]));
			//     			break;
			//     			case 500:
			//     			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/found',response2);
			//     			break;
			//     			case 503:
			//     			res.status(503).json(callbacks.commonCallback.jsonResponse(503,'Service Unavailable',[]));
			//     			break;
			// 			}
			// 		})
			// 	}
			// })
			break;
			case 404:
			res.status(404).json(callbacks.commonCallback.jsonResponse(404,'Not Found',[]));
			break;
			case 500:
			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/found',response);
			break;
		}
	})
}





// api url - /api/v1/found/match
exports.foundMatch = (req,res)=>{
	let sourceObj = {}; sourceObj.Bucket = "www.mfound.in";sourceObj.Name = 'found/'+req.body.image+''; 
	let q = "SELECT image FROM uploads";
	db.query(q , (err,rows)=>{
		if(err){
			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/match/found',err);
		}else{
			let arr = []
			async.forEachOf(rows, function (value, key, callbackNew) {
				let targetObj = {}; targetObj.Bucket = "www.mfound.in"; targetObj.Name = "face-match/"+value.image+"";
				const params = {
			  		SimilarityThreshold: 90, 
			  		SourceImage: {
			   			S3Object: sourceObj
			  		}, 
			  		TargetImage: {
			   			S3Object: targetObj
			  		}
			 	};
			 	rekognition.compareFaces(params, function (err, data) {
			 		if (err){
			 			console.log(err)
			 			//res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/match/found',err.stack);
			  		}else{
			  			if(data.FaceMatches){
			  				arr.push(data)
			  			}
					}
			  	});
			  	callbackNew(arr);		
			},(err2)=>{
				console.log(err2);	
			})
			console.log(arr);

		}
	})
	//let files = req.files;
	//console.log(files)
	return false;

	let authToken = req.headers.x_auth_token;
	if(!authToken){
		res.status(401).json(callbacks.commonCallback.jsonResponse(401,'Unauthorized Access',[]));	
		return false;
	}
	callbacks.commonCallback.validateAuthToken(authToken, 'users' ,  (response)=>{
		switch(response.statusCode){
			case 200:

			let files = req.files;
			console.log(files)
			// callbacks.commonCallback.insertIntoTable(params , 'donate' , (response2)=>{
			// 	switch(response2.statusCode){
			// 		case 200:
	  //   			res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',[]));
	  //   			break;
	  //   			case 500:
	  //   			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/donate',response2);
	  //   			break;
	  //   			case 503:
	  //   			res.status(503).json(callbacks.commonCallback.jsonResponse(503,'Service Unavailable',[]));
	  //   			break;
			// 	}
			// })
			break;
			case 404:
			res.status(404).json(callbacks.commonCallback.jsonResponse(404,'Not Found',[]));
			break;
			case 500:
			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/donate',response);
			break;
		}
	})
}