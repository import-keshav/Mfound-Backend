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


const paytm = require('../third_party/paytm/checksum');
const paytm_config = require('../third_party/paytm/paytm_config').paytm_config;

const PaytmChecksum = require('../third_party/paytm/PaytmChecksum');



const http = require('http');
const https = require('https');

const shortid = require("shortid");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: "rzp_live_nIdVWl4E1ul7dk",
  key_secret: "UBihtCtcvCxlkjRJCJjvqHOR",
});


// api url - /api/v1/razor-pay-order-create
exports.razorPayCreateOrder = async (req,res)=>{
	let params = req.body;
    if(!params){
            res.status(400).json(callbacks.commonCallback.jsonResponse(400,'Bad Request',[]));      
            return false;
    }
    const payment_capture = 1;
    const amount = req.body.amount;
    const currency = "INR";

    const options = {
        amount: amount * 100,
        currency,
        receipt: shortid.generate(),
        payment_capture,
    };

    try {
        const response = await razorpay.orders.create(options);
        console.log(response);
        res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',{
        id: response.id,
        currency: response.currency,
        amount: response.amount,
        }));
        
    } catch (error) {
        res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));
    }
}



exports.generateCheckSum = (request,response)=>{
	var paramarray = request.body; console.log(paramarray);
	// paramarray['MID'] = paytm_config.MID  ; //Provided by Paytm
	// paramarray['ORDER_ID'] = 'TEST_'  + new Date().getTime();; //unique OrderId for every request
	// paramarray['CUST_ID'] = 'Customer001';  // unique customer identifier 
	// paramarray['INDUSTRY_TYPE_ID'] = paytm_config.INDUSTRY_TYPE_ID; //Provided by Paytm
	// paramarray['CHANNEL_ID'] = paytm_config.CHANNEL_ID; //Provided by Paytm
	// paramarray['TXN_AMOUNT'] = '1.00'; // transaction amount
	// paramarray['WEBSITE'] = paytm_config.WEBSITE; //Provided by Paytm
	// paramarray['CALLBACK_URL'] = paytm_config.CALLBACK_URL
	//paramarray['EMAIL'] = 'himanshu.roks77@gmail.com'; // customer email id
	//paramarray['MOBILE_NO'] = '9582103620'; // customer 10 digit mobile no.
	paytm.genchecksum(paramarray, paytm_config.MERCHANT_KEY, function (err, checksum) {
		paramarray['CHECKSUMHASH'] = checksum;
		response.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',paramarray));
		return false;

		let txn_url =  paytm_config.TXN_URL; 
		let form_fields = "";
		for(let x in paramarray){
			form_fields += "<input type='hidden' name='"+x+"' value='"+paramarray[x]+"' >";
		}
		form_fields += "<input type='hidden' name='CHECKSUMHASH' value='"+checksum+"' >";
		let html = "<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method='post' action='"+txn_url+"' name='f1'>"+form_fields+"</form><script type='text/javascript'>document.f1.submit();</script></body></html>";
		response.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',html));
	});
}

exports.paytmCallback = (request,response)=>{
	let body = '';
	let html = "";
	let post_data = req.body;
	console.log('Callback Response: ', post_data, "\n");
	html += "<b>Callback Response</b><br>";
	for(let x in post_data){
		html += x + " => " + post_data[x] + "<br/>";
	}
	html += "<br/><br/>";
	let checksumhash = post_data.CHECKSUMHASH;
	let result = paytm.verifychecksum(post_data, paytm_config.MERCHANT_KEY, checksumhash);
	console.log("Checksum Result => ", result, "\n");
	html += "<b>Checksum Result</b> => " + (result? "True" : "False");
	html += "<br/><br/>";
	let params = {"MID": paytm_config.MID, "ORDERID": post_data.ORDER_ID};
	checksum_lib.genchecksum(params, paytm_config.MERCHANT_KEY, function (err, checksum) {
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
		let response = "";
		let post_req = https.request(options, function(post_res) {
			post_res.on('data', function (chunk) {
				response += chunk;
			});

			post_res.on('end', function(){
				console.log('S2S Response: ', response, "\n");
				let _result = JSON.parse(response);
				html += "<b>Status Check Response</b><br>";
				for(let x in _result){
					html += x + " => " + _result[x] + "<br/>";
				}

				response.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',html));

				// res.writeHead(200, {'Content-Type': 'text/html'});
				// res.write(html);
				// res.end();
			});
		});

		// post the data
		// post_req.write(post_data);
		// post_req.end();
	})
}



// api url - /api/v2/pay
exports.pay = (req,res)=>{
	let authToken = req.headers.x_auth_token;
	if(!authToken){
		res.status(401).json(callbacks.commonCallback.jsonResponse(401,'Unauthorized Access',[]));	
		return false;
	}

	let params = req.body;
	if(!params){
		res.status(400).json(callbacks.commonCallback.jsonResponse(400,'Bad Request',[]));	
		return false;
	}
	callbacks.commonCallback.validateAuthToken(authToken, 'users' ,  (response)=>{
		switch(response.statusCode){
			case 200:
			callbacks.commonCallback.insertIntoTable(params , 'payment' , (response2)=>{
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
			res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/pay',response);
			break;
		}
	})
}











// api url - /api/v2/sent-to-wallet
exports.sendToWallet = (req,res)=>{
        let authToken = req.headers.x_auth_token;
        if(!authToken){
                res.status(401).json(callbacks.commonCallback.jsonResponse(401,'Unauthorized Access',[]));      
                return false;
        }

	let params = req.body;
        if(!params){
                res.status(400).json(callbacks.commonCallback.jsonResponse(400,'Bad Request',[]));      
                return false;
        }
	callbacks.commonCallback.validateAuthToken(authToken, 'users' ,  (response)=>{
                switch(response.statusCode){
                        case 200:

                        var paytmParams = {};
paytmParams["comments"]="TEST"
paytmParams["subwalletGuid"]      = paytm_config.GUID; //  "28054249-XXXX-XXXX-af8f-fa163e429e83";
paytmParams["orderId"]            = 'ORDERID_98788' //  'jwh4565124' //  'ORDERID_'  + new Date().getTime();   // "ORDERID_98765";
paytmParams["beneficiaryPhoneNo"] =  '7777777777'   // req.body.beneficiary_mobile  ;
paytmParams["amount"]             = '1' //req.body.amount  ;

var post_data = JSON.stringify(paytmParams);

/*
* Generate checksum by parameters we have in body
* Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
*/
console.log(req.body)
console.log(paytmParams)

let paytmP = {};
paytmP['MID']= paytm_config.MID;
paytmP['ORDERID']=  'ORDERID_98788'


paytm.genchecksumbystring(post_data, paytm_config.MERCHANT_KEY, function (err, checksum) {
console.log(checksum)
console.log(paytm_config)
var x_checksum = checksum;

    var options = {

        /* for Staging */
        hostname: 'staging-dashboard.paytm.com',

        /* for Production */
        // hostname: 'dashboard.paytm.com',

        /* Solutions offered are: food, gift, gratification, loyalty, allowance, communication */ // {solution}
        path: '/bpay/api/v1/disburse/order/wallet/gratification',
        port: 443,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-mid': paytm_config.MID,
            'x-checksum': x_checksum,
          //  'Content-Length': post_data.length
        }
    };

    var response = "";
    var post_req = https.request(options, function(post_res,err) {console.log(err);
        post_res.on('data', function (chunk) {
            response += chunk;console.log(response);
        });

	post_res.on('end', function(){
            console.log('Response: ', response);

           var paytmParams2 = {};

paytmParams2["orderId"] = 'ORDERID_98788'

var post_data2 = JSON.stringify(paytmParams2);

/*
* Generate checksum by parameters we have in body
* Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
*/
PaytmChecksum.generateSignature(post_data2, paytm_config.MERCHANT_KEY).then(function(checksum){


   console.log(checksum)

    var x_mid2      = paytm_config.MID
    var x_checksum2 = checksum  //x_checksum;
   console.log(x_checksum2)
    var options2 = {

        /* for Staging */
        hostname: 'staging-dashboard.paytm.com',

        /* for Production */
        // hostname: 'dashboard.paytm.com', -- status/query -

        path: '/bpay/api/v1/disburse/order/query',
        port: 443,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-mid': x_mid2,
            'x-checksum': x_checksum2,
            'Content-Length': post_data2.length
        }
    };

    var response = "";
    var post_req = https.request(options, function(post_res) {
        post_res.on('data', function (chunk) {
            response += chunk;
        });

        post_res.on('end', function(){
            console.log('Response: ', response);
        });
    });

    post_req.write(post_data2);
    post_req.end();
});



        });
    });

    post_req.write(post_data);
    post_req.end();


})




                   //     callbacks.commonCallback.insertIntoTable(params , 'payment' , (response2)=>{
                    //            console.log(response2)
                     //           switch(response2.statusCode){
                       //                 case 200:
                       //         res.status(200).json(callbacks.commonCallback.jsonResponse(200,'Success',[]));
                       //         break;
                       //         case 500:
                        //        res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/lost',response2);
                        //        break;
                        //        case 503:
                        //        res.status(503).json(callbacks.commonCallback.jsonResponse(503,'Service Unavailable',[]));
                        //        break;
                         //       }
                      //  })

                        break;
                        case 404:
                        res.status(404).json(callbacks.commonCallback.jsonResponse(404,'Not Found',[]));
                        break;
                        case 500:
                        res.status(500).json(callbacks.commonCallback.jsonResponse(500,'Internal Server Error',[]));logger.error('API - /api/v2/pay',response);
                        break;
                }
        })
}



function htmlEscape(str) {
  return String(str)
          .replace(/&/g, '&amp;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
}
