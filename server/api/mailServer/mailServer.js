/* node server -- mailServer file
Name:- mailServer.js
Created On:- 24/08/18
*/
const db = require('../../db/db');
const bcrypt = require('bcrypt');
const moment = require('moment');
//const async = require('async');
const config = require('../config/config');
const postmark = require("postmark");
const client = new postmark.Client(config.postmarkSecret);

module.exports = {
	sendForgetEmail : (object,callback)=>{
		client.sendEmail({
		    "From": config.mailFrom , 
		    "To": object.to , 
		    "Subject": "Forget Password", 
		    "TextBody": "otp : "+object.otp
		}, 
		(err, result)=>{
			if(err)callback(err);
			callback(result);
		});
	},


	sendSignupEmail : (object,callback)=>{
		client.sendEmail({
		    "From": config.mailFrom , 
		    "To": object.to , 
		    "Subject": "SignUp Verification", 
		    "HtmlBody": "Click <a href= '"+config.emailVerificationLik+"/"+object.type+"/"+object.verification_code+"'> here </a> to verify your email account."
		}, 
		(err, result)=>{
			if(err)callback(err);
			callback(result);
		});
	},

	sendSignupEmailRegistered : (object,callback)=>{
		client.sendEmail({
		    "From": config.mailFrom , 
		    "To": object.to , 
		    "Subject": "Registeration Successfully!", 
		    "HtmlBody": "<div style='display: block;width: 59%;border: 1px solid #dcdcdc;margin: 0 auto;padding: 20px;margin-bottom: 0px;'><img src='https://www.fieldking.com/images/logo.png' style='text-align: center;width: 130px;display: block;margin: 0 auto;' /></div><div style='margin-top: 0px;display: block;width: 63%;margin: 0 auto;border: 1px solid #dcdcdc;'><h3 style='text-align: center;'>Registered Successfully.</h3><p style='text-align: center;font-size: 13px;font-family: helvetica;padding: 10px;line-height: 21px;'>Congratulations, Your are now registered with Farmease and now can start renting and buying any fieldking product. </p><br><p style='text-align: center;font-size: 12px;'>Thanks</p></div>"
		}, 
		(err, result)=>{
			if(err)callback(err);
			callback(result);
		});
	}

}