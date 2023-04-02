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

const upload = require('../multer/upload');


//v1/qr_code_status_change
exports.changeQRCodeStatus = (req,res)=>{
	let authToken = req.headers.x_auth_token;
	if(!authToken){
		res.status(401).json(callbacks.commonCallback.jsonResponse(401,'Unauthorized Access',[]));	
		return false;
	}
	callbacks.commonCallback.validateAuthToken(authToken, 'users' ,  (response)=>{
		switch(response.statusCode){
			case 200:
				let whereCondition = {};whereCondition.user_id=req.body.user_id;whereCondition.qr_code = "'"+req.body.qr_code+"'";
				let queryString = {};queryString.status = req.body.status; console.log(whereCondition);console.log(queryString);
				callbacks.commonCallback.updateTable(queryString ,whereCondition , 'qr_codes' , (response2)=>{console.log(response2);
					switch(response2.statusCode){
						case 200:
					res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',[]));
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
			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/lost',response);
			break;	
		}
	})
	
	
}




//v1/get_qr_code_status/:qr_code
exports.getQRCodeStatus = (req,res)=>{
      let select = " qr_codes.* ";
                                let whereCondition = {};whereCondition.qr_code = req.body.qr_code;
                                callbacks.commonCallback.selectData(select ,whereCondition , 'qr_codes' , (response2)=>{ console.log(response2);
                                        switch(response2.statusCode){
                                                case 200:
                                        res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',response2.result[0]));
                                        break;
                                        case 500:
                                        res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/docs',response2);
                                        break;
                                        case 404:
                                        res.status(404).json(callbacks.commonCallback.jsonResponse(404,'Not Found',[]));
                                        break;
                                        }
                                })

}
















//v1/add_qr_code
exports.addQRCode = (req,res)=>{
	let authToken = req.headers.x_auth_token;
	if(!authToken){
		res.status(401).json(callbacks.commonCallback.jsonResponse(401,'Unauthorized Access',[]));	
		return false;
	}
	callbacks.commonCallback.validateAuthToken(authToken, 'users' ,  (response)=>{
		switch(response.statusCode){
			case 200:
				upload( req,res , (err)=>{
					let params = req.body; console.log(params); console.log(req.files);
					if(req.files && req.files.length > 0){
params.image = '';
async.forEachOf(req.files, function (value, key, callbackNew) {
params.image +=    value.originalname+',' ;
callbackNew();	
}, function (err2) {
if (err2){
							    	params.image = '';

res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));

}else{

params.image = params.image.replace(/,\s*$/, "");

//params.image = req.body.image;

 callbacks.commonCallback.insertIntoTable(params , 'qr_codes' , (response2)=>{
                                                        switch(response2.statusCode){
                                                                case 200:
                                                        res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',[]));
                                                        break;
                                                        case 500:
                                                        res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));
                                                        break;
                                                        case 503:
                                                        res.status(503).json(callbacks.commonCallback.jsonResponse(503,'Service Unavailable',[]));
                                                        break;
                                                        }
                                                })


}

})


					//	params.image = req.body.image   //req.files[0].originalname
					}else{
					//	params.image = '';
						res.status(400).json(callbacks.commonCallback.jsonResponse(400,'Bad Request',[]));	
					}

					//if(err){
					//	res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/docs',err);
					//}else{
					//	callbacks.commonCallback.insertIntoTable(params , 'qr_codes' , (response2)=>{
					//		switch(response2.statusCode){
					//			case 200:
					//		res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',[]));
					//		break;
					//		case 500:
					//		res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/docs',response2);
					//		break;
					//		case 503:
					//		res.status(503).json(callbacks.commonCallback.jsonResponse(503,'Service Unavailable',[]));
					//		break;
					//		}
					//	})
					//}

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


//v1/save_qr_codes
exports.saveAllQRCode = (req,res)=>{
	upload( req,res , (err)=>{
		let params = req.body;
		if(req.files && req.files.length > 0){
			params.image = req.files[0].originalname
		}else{
			params.image = '';
			res.status(400).json(callbacks.commonCallback.jsonResponse(400,'Bad Request',[]));	
		}

		if(err){
			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/docs',err);
		}else{
			callbacks.commonCallback.insertIntoTable(params , 'qr_image' , (response2)=>{
				switch(response2.statusCode){
					case 200:
	    			res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',[]));
	    			break;
	    			case 500:
	    			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/docs',response2);
	    			break;
	    			case 503:
	    			res.status(503).json(callbacks.commonCallback.jsonResponse(503,'Service Unavailable',[]));
	    			break;
				}
			})
		}

	})
	
}
