/* node server -- donate controller file
Name:- donateController.js
Created On:- 07/10/18
*/
const db = require('../../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const moment = require('moment');
const logger = require('../logger/logger');
const async = require('async');
const callbacks = require('../callbacks/callbacks');
const request = require('request');


exports.saveCart = (req, res) => {
    let params = {};
    params.product_id = req.body.product_id;
    params.user_id = req.body.user_id;
    params.quantity = req.body.quantity;

    callbacks.commonCallback.insertIntoTable(params, 'cart', (response2) => {
        switch (response2.statusCode) {
            case 200:
                res.status(200).json(callbacks.commonCallback.jsonResponse(200, 'Success', []));
                break;
            case 500:
                res.status(500).json(callbacks.commonCallback.jsonResponse(500, 'Internal Server Error', []));
                logger.error('API - /api/v2/donate', response2);
                break;
            case 503:
                res.status(503).json(callbacks.commonCallback.jsonResponse(503, 'Service Unavailable', []));
                break;
        }
    })



}


exports.placeOrder = (req, res) => {
    let authToken = req.headers.x_auth_token;
        if(!authToken){
                res.status(401).json(callbacks.commonCallback.jsonResponse(401,'Unauthorized Access',[]));
                return false;
        }
        callbacks.commonCallback.validateAuthToken(authToken, 'users' ,  (response)=>{
                switch(response.statusCode){
                        case 200:
                             let params = req.body;

     callbacks.commonCallback.insertIntoTable(params, 'orders', (response2) => {
        switch (response2.statusCode) {
            case 200:



let whatsapobj = {};
whatsapobj['countryCode'] = "+91";
whatsapobj['callbackData'] = "Mfound";
whatsapobj['type'] = "Template";
whatsapobj['template'] = {};
whatsapobj['template']['name'] = 'found_order_place_template';  //'mfound_notification_alert';
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





    
whatsapobj['phoneNumber']= response.result.mobile ? response.result.mobile :  '8851319088';
whatsapobj.template.bodyValues.push('item');

let url =  "https://api.interakt.ai/v1/public/message/"

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
       console.log(error)
       
      }else{
	console.log(responsee)
      }
    });  

                res.status(200).json(callbacks.commonCallback.jsonResponse(200, 'Success', []));
                break;
            case 500:
                res.status(500).json(callbacks.commonCallback.jsonResponse(500, 'Internal Server Error', []));
                logger.error('API - /api/v2/donate', response2);
                break;
            case 503:
                res.status(503).json(callbacks.commonCallback.jsonResponse(503, 'Service Unavailable', []));
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

