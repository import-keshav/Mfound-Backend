/* node server -- user controller file
Name:- userController.js
Created On:- 27/08/18
*/
const db = require('../../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const moment = require('moment');
const mailServer = require('../mailServer/mailServer');
const logger = require('../logger/logger')
const callbacks = require('../callbacks/callbacks')

const upload = require('../multer/upload');

// const multer = require('multer');
// const Storage = multer.diskStorage({
// 	destination: function (req, file, callback) {
// 	callback(null, "./public/media/images/profiles");	
// 	},
// 	filename: function (req, file, callback) {
// 	callback(null,file.originalname);
// 	//callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
// 	}
// });
// const upload = multer({ storage: Storage }).array("image", 1);
// api url - /api/v2/user/:id
exports.getUserDetail = (req,res)=>{
	 callbacks.userCallback.getUserDetail( req.params.id , (response2)=>{
                                switch(response2.statusCode){
                                        case 200:
                                        res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',response2.result));
                                        break;
                                        case 404:
                                        res.status(404).json(callbacks.commonCallback.jsonResponse(404,'Not Found',[]));
                                        break;
                                        case 500:
                                        res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Service Error',[]));logger.error('API GET- /api/v1/user/:id',response2);
                                        break;
                                }

                        })
return false



        let authToken = req.headers.x_auth_token;
	if(!authToken){
		res.status(401).json(callbacks.commonCallback.jsonResponse(401,'Unauthorized Access',[]));	
		return false;
	}
	callbacks.commonCallback.validateAuthToken(authToken, 'users' , (response)=>{
		switch(response.statusCode){
			case 200:
			callbacks.userCallback.getUserDetail( req.params.id , (response2)=>{
				switch(response2.statusCode){
					case 200:
					res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',response2.result));		
					break;
					case 404:
					res.status(404).json(callbacks.commonCallback.jsonResponse(404,'Not Found',[]));
					break;
					case 500:
					res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Service Error',[]));logger.error('API GET- /api/v1/user/:id',response2);
					break;
				}	

			})
			break;
			case 404:
			res.status(404).json(callbacks.commonCallback.jsonResponse(404,'Not Found',[]));
			break;
			case 500:
			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Service Error',[]));logger.error('API GET- /api/v1/user/:id',response);
			break;	
		}
	})	
}


//update by id

exports.updateUserId = (req,res)=>{
        let authToken = req.headers.x_auth_token;
        if(!authToken){
                res.status(401).json(callbacks.commonCallback.jsonResponse(401,'Unauthorized Access',[]));
                return false;
        }

        callbacks.commonCallback.validateAuthToken(authToken, 'users' ,  (response)=>{
                switch(response.statusCode){
                        case 200:
                           let queryString = {}; queryString.wallet =  req.body.wallet ?  req.body.wallet : '' ;
                                        let whereCondition = {};
                                        whereCondition.id = req.params.id;
                                        callbacks.commonCallback.updateTable(queryString , whereCondition , 'users' , (response2)=>{
                                                console.log(response2)
                                                switch(response2.statusCode){
                                                        case 200:
                                                res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',[]));
                                                break;
                                                case 500:
                                                res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/lost',response2);
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
                        res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));
                        break;
                }
        })
}


// api url - /api/v2/user
exports.updateUserDetail = (req,res)=>{
	let authToken = req.headers.x_auth_token;
	if(!authToken){
		res.status(401).json(callbacks.commonCallback.jsonResponse(401,'Unauthorized Access',[]));	
		return false;
	}
	callbacks.commonCallback.validateAuthToken(authToken, 'users' , (response)=>{
		console.log(response);
		switch(response.statusCode){
			case 200:
			upload( req,res , (err)=>{
				req.body.first_name = req.body.firstName;delete req.body.firstName;req.body.last_name = req.body.lastName;delete req.body.lastName;
				if(req.files && req.files.length > 0 ){
					req.body.image = req.files[0].originalname;
				}
				let queryString =  req.body;
				let whereCondition = {};
				whereCondition.id = req.body.id;
				callbacks.commonCallback.updateTable(queryString ,whereCondition, 'users' , (response2)=>{
					console.log(response2)
					switch(response2.statusCode){
						case 200:
						res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',req.body));								
						break;
						case 500:
						res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API PUT- /api/v2/user',response2);
						break;
						case 503:
						res.status(503).json(callbacks.commonCallback.jsonResponse(503,'Service Unavailable',[]));
						break;
					}
				})
			})	
			break;
			case 404:
			res.status(404).json(callbacks.commonCallback.jsonResponse(404,'Not Found',[]));		
			break;
			case 500:
			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API PUT- /api/v2/user',response);
			break;
		}
	})	
}


const qs = require('querystring');
const paytm = require('../third_party/paytm/checksum');
const https = require('https');


exports.generateCheckSum = (req,res)=>{
	var paramarray = {};
	paramarray['MID'] = 'VyDQJK40111971950567'; //Provided by Paytm
	paramarray['ORDER_ID'] = 'ORDascascascasc4@,-,_,.9541227@@@@@@'; //unique OrderId for every request
	paramarray['CUST_ID'] = 'CUST4@,-,_,.954ascascascasc1227123@@@@@@';  // unique customer identifier 
	paramarray['INDUSTRY_TYPE_ID'] = 'Retail'; //Provided by Paytm
	paramarray['CHANNEL_ID'] = 'WAP'; //Provided by Paytm
	paramarray['TXN_AMOUNT'] = '1.00'; // transaction amount
	paramarray['WEBSITE'] = 'www.mfound.in'; //Provided by Paytm
	paramarray['CALLBACK_URL'] = 'http://ec2-18-188-138-130.us-east-2.compute.amazonaws.com:3000/api/v1/paytm/callback';//Provided by Paytm
	paramarray['EMAIL'] = 'himanshu.roks77@gmail.com'; // customer email id
	paramarray['MOBILE_NO'] = '9582103620'; // customer 10 digit mobile no.
	paytm.genchecksum(paramarray, 'K3Su382iP2Nje7hn', function (err, checksum) {
			
		if(checksum){
			// let responseparams = {};
			// responseparams['CHECKSUMHASH'] = checksum; // customer 10 digit mobile no.
			paramarray['CHECKSUMHASH'] = checksum; // customer 10 digit mobile no.
			res.status(200).json(callbacks.commonCallback.jsonResponse(200 , 'success', paramarray));	
		}

		return false
		var txn_url = "https://securegw-stage.paytm.in/theia/processTransaction"; // for staging
		// var txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production
		
		var form_fields = "";
		for(var x in paramarray){
			form_fields += "<input type='hidden' name='"+x+"' value='"+paramarray[x]+"' >";
		}
		form_fields += "<input type='hidden' name='CHECKSUMHASH' value='"+checksum+"' >";

		let html = "<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method='post' action='"+txn_url+"' name='f1'>"+form_fields+"</form><script type='text/javascript'>document.f1.submit();</script></body></html>"; 
		//res.setHeader('Content-Type', 'text/html');
		res.status(200).json(callbacks.commonCallback.jsonResponse(200 , 'success', html));


		// res.writeHead(200, {'Content-Type': 'text/html'});
		// res.write('<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method="post" action="'+txn_url+'" name="f1">'+form_fields+'</form><script type="text/javascript">document.f1.submit();</script></body></html>');
		// res.end();
		});
}



exports.paytmCallbacks = (req,res)=>{
	let post_data = req.body;
	let html;
	html += "<b>Callback Response</b><br>";
	for(var x in post_data){
		html += x + " => " + post_data[x] + "<br/>";
	}
	html += "<br/><br/>";
	var checksumhash =  post_data.CHECKSUMHASH;
	console.log(checksumhash);
	var result = paytm.verifychecksum(post_data, 'K3Su382iP2Nje7hn', checksumhash);
	console.log("Checksum Result => ", result, "\n");
	html += "<b>Checksum Result</b> => " + (result? "True" : "False");
	html += "<br/><br/>";
	var params = {"MID": 'VyDQJK40111971950567', "ORDERID": post_data.ORDER_ID};
	paytm.genchecksum(params, 'K3Su382iP2Nje7hn', function (err, checksum) {
		console.log(err)
		console.log(checksum)

		params.CHECKSUMHASH = checksum;
		post_data = 'JsonData='+JSON.stringify(params);
		var options = {
			hostname: 'securegw-stage.paytm.in', // for staging
			// hostname: 'securegw.paytm.in', // for production
			port: 443,
			path: '/merchant-status/getTxnStatus',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': post_data.length
			}
		};

		var response = "";
					var post_req = https.request(options, function(post_res) {
						post_res.on('data', function (chunk) {
							response += chunk;
						});

						post_res.on('end', function(){
							console.log('S2S Response: ', response, "\n");

							var _result = JSON.parse(response);
							html += "<b>Status Check Response</b><br>";
							for(var x in _result){
								html += x + " => " + _result[x] + "<br/>";
							}

							res.writeHead(200, {'Content-Type': 'text/html'});
							res.write(html);
							res.end();
						});
					});

					// post the data
					post_req.write(post_data);
					post_req.end();


	})

	return false
	var body = '';
	        
	        req.on('data', function (data) {
	            body += data;
	        });

	        req.on('end', function () {
				var html = "";
				var post_data = qs.parse(body);


				// received params in callback
				console.log('Callback Response: ', post_data, "\n");
				html += "<b>Callback Response</b><br>";
				for(var x in post_data){
					html += x + " => " + post_data[x] + "<br/>";
				}
				html += "<br/><br/>";


				// verify the checksum
				var checksumhash =  post_data.CHECKSUMHASH;
				// delete post_data.CHECKSUMHASH;
				var result = paytm.verifychecksum(post_data, 'i4!2QhdVrYe&BwPS', checksumhash);
				console.log("Checksum Result => ", result, "\n");
				html += "<b>Checksum Result</b> => " + (result? "True" : "False");
				html += "<br/><br/>";



				// Send Server-to-Server request to verify Order Status
				var params = {"MID": 'JCSIgF92631277091784', "ORDERID": post_data.ORDERID};

				paytm.genchecksum(params, 'i4!2QhdVrYe&BwPS', function (err, checksum) {

					params.CHECKSUMHASH = checksum;
					post_data = 'JsonData='+JSON.stringify(params);

					var options = {
						hostname: 'securegw-stage.paytm.in', // for staging
						// hostname: 'securegw.paytm.in', // for production
						port: 443,
						path: '/merchant-status/getTxnStatus',
						method: 'POST',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Content-Length': post_data.length
						}
					};


					// Set up the request
					var response = "";
					var post_req = https.request(options, function(post_res) {
						post_res.on('data', function (chunk) {
							response += chunk;
						});

						post_res.on('end', function(){
							console.log('S2S Response: ', response, "\n");

							var _result = JSON.parse(response);
							html += "<b>Status Check Response</b><br>";
							for(var x in _result){
								html += x + " => " + _result[x] + "<br/>";
							}

							res.writeHead(200, {'Content-Type': 'text/html'});
							res.write(html);
							res.end();
						});
					});

					// post the data
					post_req.write(post_data);
					post_req.end();
				});
	        });
},


exports.verifychecksum = (request,response)=>{

	var fullBody = '';
	request.on('data', function(chunk) {
		fullBody += chunk.toString();
	});
	request.on('end', function() {
		var decodedBody = querystring.parse(fullBody);
		response.writeHead(200, {'Content-type' : 'text/html','Cache-Control': 'no-cache'});
		if(paytm.verifychecksum(decodedBody, 'i4!2QhdVrYe&BwPS')) {
			console.log("true");
		}else{
			console.log("false");
		}
		 // if checksum is validated Kindly verify the amount and status 
		 // if transaction is successful 
		// kindly call Paytm Transaction Status API and verify the transaction amount and status.
		// If everything is fine then mark that transaction as successful into your DB.			
		
		response.end();
	});


}



