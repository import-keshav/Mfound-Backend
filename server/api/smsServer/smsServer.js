/* node server -- smsServer file
Name:- smsServer.js
Created On:- 07/08/18
*/
const db = require('../../db/db');
const bcrypt = require('bcrypt');
const moment = require('moment');
//const async = require('async');
const config = require('../config/config');
const twilio = require('twilio');
const sms = new twilio(config.twilioAccountSid, config.twilioAuthToken);
module.exports = {
	sendOTPSMS : (object, callback)=>{
		sms.messages.create({
			body : object.msg,
			to : object.to,
			from : config.twilioNumber
		})
		.then( (message)=>{
			console.log(message);
			callback(message)
		})
		.done();
	}
}







