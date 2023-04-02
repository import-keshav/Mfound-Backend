/* node server -- found controller file
Name:- foundController.js
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
const request = require('request');
const upload = require('../multer/upload');
const pushNotification = require('../notifications/pushNotification')


const AWS = require('aws-sdk');
AWS.config.update({region:'us-east-2'});
const rekognition = new AWS.Rekognition({apiVersion: '2016-06-27'});


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
			
			upload( req,res , (err)=>{

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
					params.mobile = req.body.mobile ;
					params.height = req.body.height ;
					break;
					case 'item':
                                        case 'itemQR':
                                       params.name = req.body.name;
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
					params.mobile = req.body.mobile ;params.qr_code = req.body.qr_code;
					break;
				} 
				if(req.files && req.files.length > 0){
					params.image = req.files[0].originalname ;
					(req.body.type == 'person') ? (params.thumb_image = req.files.length > 1 ?  req.files[1].originalname: ''  ) : '' ;
				}else{
					params.image = "";
					params.thumb_image="";
				}
				console.log(params)
				if(err){
					console.log(err)
					res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/found',err);
				}else{
					callbacks.commonCallback.insertIntoTable(params , 'found' , (response2)=>{
						console.log(response2)
						switch(response2.statusCode){
							case 200:

if(params.type == 'person'){
 res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',[]));
return false;
}
if(params.qr_code && params.qr_code != ''){ 
callbacks.commonCallback.selectData( "  id , user_id",{ qr_code : params.qr_code },'qr_codes', response3=>{
console.log(response3);
if(response3.statusCode == 200){ 
//let qr_code_url =response3.result && response3.result[0] && response3.result[0].qr_code ? response3.result[0].qr_code  : ''; 
let qr_code_id = response3.result && response3.result[0] && response3.result[0].id ? response3.result[0].id  : '';
let user_id = response3.result && response3.result[0] && response3.result[0].user_id ? response3.result[0].user_id  : '';

callbacks.commonCallback.insertIntoTable({user_id : user_id , notifyText : 'Congratulations!!! We have found your '+params.name+' . Click to find the details.',qr_code_id : qr_code_id}, 'push_notifications',response4=>{
console.log(response4);
if(response4.statusCode == 200){

callbacks.commonCallback.getDeviceNotificationToken(user_id , notifyResponse=>{ console.log(notifyResponse);
						switch(notifyResponse.statusCode){
							case 200:
							let obj = {};
							obj.to = notifyResponse.result.device_notification_id;
							obj.data = {};
							obj.data['device'] = notifyResponse.result.device;
							obj.data['message'] = 'Congratulations!!! We have found your '+params.name+'.Click to find the details.';
							obj.data['type'] = 'type';
							
							pushNotification.sendFoundNotification(obj , pushNotificationResponse=>{
								console.log(pushNotificationResponse)


let whatsapobj = {};
whatsapobj['countryCode'] = "+91";
whatsapobj['callbackData'] = "Mfound";
whatsapobj['type'] = "Template";
whatsapobj['template'] = {};
whatsapobj['template']['name'] = 'mfound_notification_alert';
whatsapobj['template']['languageCode'] = 'en';
whatsapobj['template']['bodyValues'] = [];

//let whatsapobj = {
//    "countryCode": "+91",
 //   "callbackData": "Mfound",
 //   "type": "Template",
 //   "template": {
 //       "name": "mfound_notification_alert",
 //       "languageCode": "en",
 //       "bodyValues": []
 //   }
//};
whatsapobj['phoneNumber']= notifyResponse.result.mobile ? notifyResponse.result.mobile:'8851319088';
whatsapobj.template.bodyValues.push(params.name);
console.log(whatsapobj);
let url =  "https://api.interakt.ai/v1/public/message/";

request({
      url: url,
      method: 'POST',
     headers:{
      'Authorization': 'Basic RnBBMWxYbDg3RUZVQmtvaWlrT2xNWmpYOVl5bUl5MlY2U0V2cUF1Nk5kMDo=',
      'Content-Type': 'application/json'
     },
     body : JSON.stringify(whatsapobj)
    },(error, responsee, body)=> {
      
     // console.error(error, response, body); 
      if (error) {
console.log('inkart error'); 
       console.log(error)
       
      }else{
console.log('inkart success');
        console.log(responsee)
      }
    });  









let mailParams = {};
							
							mailParams.from = config.mailFrom;
							mailParams.to = notifyResponse.result.email_found;
							mailParams.mailText = 'Yippee! We have found your '+params.name+'. Click to find the details- <a href="https://mfound.in/lost&found/5oneU6Zi9T2Fyo5W">https://mfound.in/lost&found/5oneU6Zi9T2Fyo5W</a>';
							callbacks.authCallback.sendFoundEmail(mailParams, (mailresponse2)=>{
								console.log(mailresponse2);
								
	
let smsparams = {};
let qr_url = 'https://mfound.in/lost%26found/5oneU6Zi9T2Fyo5W' 
smsparams.to = notifyResponse.result.mobile ? '+91'+notifyResponse.result.mobile:'';
smsparams.msg = "Yippee! We have found your "+params.name+" Click to find details - "+qr_url+" \nregards MFound";

callbacks.authCallback.sendFoundSMS(smsparams,(smsResponse)=>{
    switch(smsResponse.statusCode){
        case 200:
        res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',[]));
        break;
        case 503:
            res.status(503).json(callbacks.commonCallback.jsonResponse(503,'Service Unavailable',[]));		
        break;
    }
})

							})






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


}

else{
//send error
res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/found',response2);
}

})


}else{ 
//send error
res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));
}

})
}else{
res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));

}


			    			break;
			    			case 500:
			    			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/found',response2);
			    			break;
			    			case 503:
			    			res.status(503).json(callbacks.commonCallback.jsonResponse(503,'Service Unavailable',[]));
			    			break;
						}
					})
				}
			})
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


// api url - /api/v2/found/:id
exports.updateFound = (req,res)=>{
	let authToken = req.headers.x_auth_token;
	if(!authToken){
		res.status(401).json(callbacks.commonCallback.jsonResponse(401,'Unauthorized Access',[]));	
		return false;
	}

	callbacks.commonCallback.validateAuthToken(authToken, 'users' ,  (response)=>{
		switch(response.statusCode){
			case 200:


			upload( req,res , (err)=>{
				let params = req.body;
				params.reward = params.reward ? params.reward : 0;
				req.body.date_of_found && req.body.date_of_found != '0000-00-00 00:00:00' ? params.date_of_found = req.body.date_of_found : delete params.date_of_found;
				delete params.created_at

				// params.user_id = response.result.id;
				// switch(req.body.type){
				// 	case 'person':
				// 	params.type = req.body.type ;
				// 	params.gender = req.body.gender ;
				// 	params.category = req.body.category ;
				// 	params.name = req.body.name ;
				
				// 	params.age = req.body.age ;
				// 	params.date_of_found = req.body.dateOfFound ;
				// 	params.lat_location = req.body.latLocation ;
				// 	params.long_location = req.body.longLocation ;
				// 	params.address_location = req.body.addressLocation ;
				// 	params.birth_mark = req.body.birthMark ;
				// 	params.body_color = req.body.bodyColor ;
				// 	params.clothes_wear = req.body.clothesWear ;
				// 	params.description = req.body.description ;

				// 	break;
				// 	case 'item':
				// 	params.type = req.body.type ;
				// 	params.date_of_found = req.body.dateOfFound;
				// 	params.lat_location = req.body.latLocation ;
				// 	params.long_location = req.body.longLocation ;
				// 	params.address_location = req.body.addressLocation ;
				// 	params.category = req.body.category ;
				// 	params.brand = req.body.brand ;
				
				// 	params.color = req.body.color ;	
				// 	params.description = req.body.description ;	
				// 	break;
				// }
				if(req.files && req.files.length > 0){
					params.image = req.files[0].originalname ;
					params.thumb_image = req.files[1].originalname ;
				}else{
					//params.image = "";
					//params.thumb_image="";
				}
				if(err){
					res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/found',err);
				}else{
					let queryString = params;
					let whereCondition = {};
					whereCondition.id = req.params.id; 
					callbacks.commonCallback.updateTable(queryString , whereCondition , 'found' , (response2)=>{
						console.log(response2)
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
				}
			})
			break;
			case 404:
			res.status(404).json(callbacks.commonCallback.jsonResponse(404,'Not Found',[]));
			break;
			case 500:
			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/lost',response);
			break;
		}
	})
}


// api url - /api/v1/found/match
exports.foundMatch = async (req,res)=>{
	let sourceObj = {}; sourceObj.Bucket = "www.mfound.in";sourceObj.Name = 'found/'+req.body.image; 
	let type = req.body.type;
	let q = "SELECT * FROM  lost where type='person'  ";
	db.query(q , async  (err,rows)=>{ console.log(rows.length);
		if(err){
			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/match/found',err);
		}else{
			if(rows.length > 0){
				let pending = rows.length;var isExec = 0;  let resp = [];	
				for(let i in rows){ 
					let targetObj = {}; targetObj.Bucket = "www.mfound.in"; targetObj.Name =  type+'/'+rows[i].image;
					let params = {
				  		SimilarityThreshold: 90, 
				  		SourceImage: {
				   			S3Object: sourceObj
				  		}, 
				  		TargetImage: {
				   			S3Object: targetObj
				  		}
				 	}; if(isExec== 1 || i == 0 ){isExec = 1;
				 	 rekognition.compareFaces(params,  function (err, data) { console.log(err);console.log(data);isExec = 1;
				 		if(data && data.FaceMatches && data.FaceMatches.length > 0){
				 			data.FaceMatches[0].rowSelected = rows[i]
				 			resp.push(data.FaceMatches); 
				 			//res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',resp));		
				 			 if( 0 === --pending ) {
				 			 	res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',resp));		
				 			 }	
						}else{
							if( 0 === --pending && resp.length == 0 ) {
				 				res.status(404).json(callbacks.commonCallback.jsonResponse(404,'Not Found',[]));		
				 			}
						}
				 	}); }
				}
			}else{
				res.status(404).json(callbacks.commonCallback.jsonResponse(404,'Not Found',[]));	
			}
		}

	})


}



// api url - /api/v1/found/match
exports.foundMatch_old = (req,res)=>{
	let sourceObj = {}; sourceObj.Bucket = "www.mfound.in";sourceObj.Name = 'found/'+req.body.image; 
	let q = "SELECT * FROM lost";
	db.query(q , (err,rows)=>{
		if(err){
			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/match/found',err);
		}else{
			let resp = []
			async.forEachOf(rows, function (value, key, callbackNew) {
					
				
					let targetObj = {}; targetObj.Bucket = "www.mfound.in"; targetObj.Name = "lost/"+value.image;
					let params = {
				  		SimilarityThreshold: 90, 
				  		SourceImage: {
				   			S3Object: sourceObj
				  		}, 
				  		TargetImage: {
				   			S3Object: targetObj
				  		}
				 	};
				 	rekognition.compareFaces(params, function (err, data) {
				 		if(data && data.FaceMatches && data.FaceMatches.length > 0){
				 			data.FaceMatches[0].rowSelected = value
				 			resp.push(data.FaceMatches); 
				 		}
				 		
						callbackNew();				
				 	// 	if (err){
				 	// 		//console.log(err)
				 	// 	}else{
						// 	if(data.FaceMatches){
				  // 				resp.push(data)
						// 		callbackNew();				
				  // 			}
						// }
				  	});	
					
				
				
			},(err2)=>{
				console.log(resp);	
				if(err2){
					//res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/match/found',err2);
				}else{
					if(resp){
						res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',resp));	
					}else{
						res.status(200).json(callbacks.commonCallback.jsonResponse(404,'Not Found',[]));	
					}
				}
			})
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
