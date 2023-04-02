/* node server --push notification file
Name:- pushNotification.js
Created On:- 24/08/18
*/
const request = require('request');
const config = require('../config/config');
module.exports = {
  sendPushNotificationToUser :(object,callback)=>{
    request({
      url: 'https://fcm.googleapis.com/fcm/send',
      method: 'POST',
      headers: {
        'Content-Type' :' application/json',
        'Authorization': 'key='+config.FCMServerKey+''  
      },
      body: JSON.stringify(object)
    },(error, response, body)=> {
     // console.error(error, response, body); 
      if (error) {
       //console.log(error)
        callback(error)
      }else{
        //console.log(response)

        callback(body)
      }
    });  
  }
}

