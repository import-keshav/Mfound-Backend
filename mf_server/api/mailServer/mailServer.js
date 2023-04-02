/* node server -- mailServer file
Name:- mailServer.js
Created On:- 27/08/18
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
			if(err){
				console.log(err)
				callback(err);
			}else{
				console.log(result)
				callback(result);	
			}
			
		});
	},


        sendFoundEmail : (object,callback)=>{
                client.sendEmail({
                    "From": config.mailFrom , 
                    "To": object.to , 
                    "Subject": "Mfound Notification", 
                   // "HtmlBody": object.mailText,
                   "HtmlBody": `
<html>

<body>
    <div style="margin:0;padding:0;background-color:#ffffff;width:480px;min-width:320px;border:1px solid #dcdcdc;margin:0 auto;">

        <table style="border-collapse:collapse;table-layout:fixed;border-spacing:0;vertical-align:top;min-width:320px;Margin:0 auto;background-color:#ffffff;width:100%" cellpadding="0" cellspacing="0">
            <tbody>
                <tr style="vertical-align:top">
                    <td style="word-break:break-word;border-collapse:collapse!important;vertical-align:top">

                        <div style="background-color:#ffffff;">
                            <div style="Margin:0 auto;min-width:320px;max-width:575px;word-wrap:break-word;word-break:break-word;background-color:transparent">
                                <div style="border-collapse:collapse;display:table;width:100%;background-color:transparent">

                                    <div style="min-width:320px;max-width:575px;display:table-cell;vertical-align:top">
                                        <div style="background-color:transparent;width:100%!important">
                                            <div style="border-top:0px solid transparent;border-left:0px solid transparent;border-bottom:0px solid transparent;border-right:0px solid transparent;padding-top:5px;padding-bottom:5px;padding-right:0px;padding-left:0px">

                                                <div align="center" style="padding-right:15px;padding-left:15px">

                                                    <div style="line-height:20px;font-size:1px"> </div> <img align="center" border="0" src="https://mfound.in/wp-content/uploads/2018/12/60.png" alt="Image" title="Image" style="outline:none;text-decoration:none;clear:both;display:block!important;border:0;height:auto;float:none;width:100%;max-width:80px" width="80">
                                                    <div style="line-height:20px;font-size:1px"> </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div style="background-color:transparent">
                            <div style="Margin:0 auto;min-width:320px;max-width:575px;word-wrap:break-word;word-break:break-word;background-color:transparent">
                                <div style="border-collapse:collapse;display:table;width:100%;background-color:transparent">

                                    <div style="min-width:320px;max-width:575px;display:table-cell;vertical-align:top">
                                        <div style="background-color:transparent;width:100%!important">
                                            <div style="border-top:0px solid transparent;border-left:0px solid transparent;border-bottom:0px solid transparent;border-right:0px solid transparent;padding-top:5px;padding-bottom:5px;padding-right:0px;padding-left:0px">

                                                <div>

                                                    <div style="font-family:&#39;Lato&#39;,Tahoma,Verdana,Segoe,sans-serif;color:#000000;line-height:120%;padding-right:10px;padding-left:10px;padding-top:20px;padding-bottom:20px">
                                                        <div style="line-height:14px;font-family:Lato,Tahoma,Verdana,Segoe,sans-serif;font-size:12px;color:#000000;text-align:left">
                                                            <p style="margin:0;line-height:14px;text-align:center;font-size:12px"><span style="font-size:22px;line-height:26px;color:rgb(128,128,128)"><strong>${object.mailText}</strong></span></p>
                                                        </div>
                                                    </div>

                                                </div>

                                                

                                                <div>

                                                    <div style="font-family:&#39;Lato&#39;,Tahoma,Verdana,Segoe,sans-serif;color:#000000;line-height:120%;padding-right:10px;padding-left:10px;padding-top:20px;padding-bottom:20px">
                                                        <div style="line-height:14px;font-family:Lato,Tahoma,Verdana,Segoe,sans-serif;font-size:12px;color:#000000;text-align:left">
                                                            <p style="margin:0;line-height:14px;text-align:center;font-size:12px"><span style="font-size:22px;line-height:26px;color:rgb(128,128,128)"><strong>THANK YOU</strong></span></p>
                                                        </div>
                                                    </div>

                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div style="background-color:transparent">
                            <div style="Margin:0 auto;min-width:320px;max-width:575px;word-wrap:break-word;word-break:break-word;background-color:transparent">
                                <div style="border-collapse:collapse;display:table;width:100%;background-color:transparent">

                                    <div style="min-width:320px;max-width:575px;display:table-cell;vertical-align:top">
                                        <div style="background-color:transparent;width:100%!important">
                                            <div style="border-top:0px solid transparent;border-left:0px solid transparent;border-bottom:0px solid transparent;border-right:0px solid transparent;padding-top:5px;padding-bottom:5px;padding-right:0px;padding-left:0px">

                                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;table-layout:fixed;border-spacing:0;vertical-align:top;min-width:100%">
                                                    <tbody>
                                                        <tr style="vertical-align:top">
                                                            <td style="word-break:break-word;border-collapse:collapse!important;vertical-align:top;padding-right:10px;padding-left:10px;padding-top:10px;padding-bottom:10px;min-width:100%">
                                                                <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;table-layout:fixed;border-spacing:0;vertical-align:top;border-top:1px solid #cccccc">
                                                                    <tbody>
                                                                        <tr style="vertical-align:top">
                                                                            <td style="word-break:break-word;border-collapse:collapse!important;vertical-align:top;font-size:0px;line-height:0px">
                                                                                <span> </span>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>

                                                <div>

                                                    <div style="font-family:&#39;Lato&#39;,Tahoma,Verdana,Segoe,sans-serif;color:#555555;line-height:120%;padding-right:10px;padding-left:10px;padding-top:10px;padding-bottom:10px">
                                                        <div style="font-size:12px;line-height:14px;font-family:Lato,Tahoma,Verdana,Segoe,sans-serif;color:#555555;text-align:left">
                                                            <p style="margin:0;font-size:14px;line-height:17px;text-align:center"><a style="color:#71777d;font-size:12px" href="https://mfound.in" rel="noopener" target="_blank"><span style="font-size:16px;line-height:19px">Copyright © 2020 </span><span style="color:rgb(255,102,0);font-size:17px;line-height:20px"><span style="font-size:16px;line-height:19px">MFOUND</span></span></a></p>
                                                        </div>
                                                    </div>

                                                </div>

                                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;table-layout:fixed;border-spacing:0;vertical-align:top;min-width:100%">
                                                    <tbody>
                                                        <tr style="vertical-align:top">
                                                            <td style="word-break:break-word;border-collapse:collapse!important;vertical-align:top;padding-right:10px;padding-left:10px;padding-top:10px;padding-bottom:10px;min-width:100%">
                                                                <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;table-layout:fixed;border-spacing:0;vertical-align:top;border-top:1px solid #cccccc">
                                                                    <tbody>
                                                                        <tr style="vertical-align:top">
                                                                            <td style="word-break:break-word;border-collapse:collapse!important;vertical-align:top;font-size:0px;line-height:0px">
                                                                                <span> </span>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>

                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div style="background-color:#ffffff">
                            <div style="Margin:0 auto;min-width:320px;max-width:575px;word-wrap:break-word;word-break:break-word;background-color:transparent">
                                <div style="border-collapse:collapse;display:table;width:100%;background-color:transparent">

                                    <div style="min-width:320px;max-width:575px;display:table-cell;vertical-align:top">
                                        <div style="background-color:transparent;width:100%!important">
                                            <div style="border-top:0px solid transparent;border-left:0px solid transparent;border-bottom:0px solid transparent;border-right:0px solid transparent;padding-top:5px;padding-bottom:5px;padding-right:0px;padding-left:0px">

                                                <div align="center" style="padding-right:0px;padding-left:0px;padding-bottom:0px">
                                                    <div style="display:table;">
                                                        <table align="left" border="0" cellspacing="0" cellpadding="0" width="100" height="32" style="border-collapse:collapse;table-layout:fixed;border-spacing:0;vertical-align:top;Margin-right:5px">
                                                            <tbody>
                                                                <tr style="vertical-align:top">
                                                                    <td align="left" valign="middle" style="word-break:break-word;border-collapse:collapse!important;vertical-align:top">
                                                                        <a href="https://play.google.com/store/apps/details?id=com.mfound.app" title="android" target="_blank">
                                                                            <img src="https://mfound.in/wp-content/uploads/2019/02/google_play-300x87.png" alt="android" title="android" width="100" style="outline:none;text-decoration:none;clear:both;display:block!important;border:none;height:auto;float:none;max-width:100px!important">
                                                                        </a>
                                                                        <div style="line-height:5px;font-size:1px"> </div>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>

                                                        <table align="left" border="0" cellspacing="0" cellpadding="0" width="100" height="32" style="border-collapse:collapse;table-layout:fixed;border-spacing:0;vertical-align:top;Margin-right:0">
                                                            <tbody>
                                                                <tr style="vertical-align:top">
                                                                    <td align="left" valign="middle" style="word-break:break-word;border-collapse:collapse!important;vertical-align:top">
                                                                        <a href="https://apps.apple.com/in/app/mfound/id1455777047" title="ios" target="_blank">
                                                                            <img src="https://mfound.in/wp-content/uploads/2019/02/app_store-300x88.png" alt="ios" title="ios" width="100" style="outline:none;text-decoration:none;clear:both;display:block!important;border:none;height:auto;float:none;max-width:100px!important">
                                                                        </a>
                                                                        <div style="line-height:5px;font-size:1px"> </div>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>

                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </td>
                </tr>
            </tbody>
        </table>

    </div>
</body>

</html>

`
                }, 
                (err, result)=>{
                        if(err){
                                console.log(err)
                                callback(err);
                        }else{
                              	console.log(result)
                                callback(result);       
                        }
                        
                });
        },


	sendSignupEmailRegistered : (object,callback)=>{
		client.sendEmail({
		    "From": config.mailFrom , 
		    "To": object.to , 
		    "Subject": "Registeration Successfully!", 
		    "HtmlBody": "<div style='display: block;width: 59%;border: 1px solid #dcdcdc;margin: 0 auto;padding: 20px;margin-bottom: 0px;'><img src='https://mfound.in/wp-content/uploads/2019/02/Logo-MFOUND-1024x221.png' style='text-align: center;width: 130px;display: block;margin: 0 auto;' /></div><div style='margin-top: 0px;display: block;width: 63%;margin: 0 auto;border: 1px solid #dcdcdc;'><h3 style='text-align: center;'>Registered Successfully.</h3><p style='text-align: center;font-size: 13px;font-family: helvetica;padding: 10px;line-height: 21px;'>Congratulations, Your are now registered with MFound and now can start using MFound services. </p><br><p style='text-align: center;font-size: 12px;'>Thanks</p></div>"
		}, 
		(err, result)=>{
			if(err)callback(err);
			callback(result);
		});
	}
}
