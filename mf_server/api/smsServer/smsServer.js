/* node server -- smsServer file
Name:- smsServer.js
Created On:- 27/08/18
*/
const db = require('../../db/db');
const bcrypt = require('bcrypt');
const moment = require('moment');
//const async = require('async');
const config = require('../config/config');
const twilio = require('twilio');
const request = require('request');
const sms = new twilio(config.twilioAccountSid, config.twilioAuthToken);
module.exports = {
	sendOTPSMS : (object, callback)=>{

let url =  "http://sms.bulksmsind.in/v2/sendSMS?username=MFOUND&message="+object.msg+"&sendername=MFOUND&smstype=TRANS&numbers="+object.to+"&apikey=7e5bdf45-1067-455a-87fd-5074659120b6&peid=1701159231376656667&templateid=12071617951283379671"

request({
      url: url,
      method: 'GET',
    },(error, responsee, body)=> {
      
     // console.error(error, response, body); 
      if (error) { callback(error)
      // console.log(error)
       
      }else{
        callback(responsee)
      }
    });  
		//sms.messages.create({
		//	body : object.msg,
		//	to : object.to,
		//	from : config.twilioNumber
		//})
		//.then( (message)=>{
		//	console.log(message);
		//	callback(message)
		//})
		//.done();
	},
       sendFoundSMS : (object, callback)=>{ console.log(object);


let url =  "http://sms.bulksmsind.in/v2/sendSMS?username=MFOUND&message="+object.msg+"&sendername=MFOUND&smstype=TRANS&numbers="+object.to+"&apikey=7e5bdf45-1067-455a-87fd-5074659120b6&peid=1701159231376656667&templateid=12071617951283379671"

request({
      url: url,
      method: 'GET',
    },(error, responsee, body)=> {
      
     // console.error(error, response, body); 
      if (error) { callback(error)
       console.log(error)
       
      }else{
        callback(responsee)
      }
    });  


                //sms.messages.create({
                 //       body : object.msg,
                  //      to : object.to,
                  //      from : config.twilioNumber
               // })
               // .then( (message)=>{
                //        console.log(message);
                  //      callback(message)
              //  })
              //  .done();
        }
}







