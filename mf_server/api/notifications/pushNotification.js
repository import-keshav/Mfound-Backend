/* node server --push notification file
Name:- pushNotification.js
Created On:- 27/08/18
*/

const request = require('request');
const config = require('../config/config');


module.exports = {
  sendLostNotification : (object,callback)=>{
    let fields = {};
    fields['registration_ids'] = [object.to]
    if(object.data['device'] && object.data['device'].toLowerCase() == 'android'){
      fields['data'] =  { title : 'MFound' , body : object.data['message'] , objectType : object.data['type']  } 
    }else if(object.data['device'] && object.data['device'].toLowerCase() == 'ios'){
      fields['notification']  = {   title : 'MFound' ,  data : { type : object.data['type'] } ,  body : object.data['message'] }
    } console.log(fields);
    request({
      url: 'https://fcm.googleapis.com/fcm/send',
      method: 'POST',
      headers: {
        'Content-Type' :' application/json',
        'Authorization': 'key='+config.FCMServerKey+''  
      },
      body: JSON.stringify(fields)
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
  },

sendFoundNotification : (object,callback)=>{
    let fields = {};
    fields['registration_ids'] = [object.to]
    if(object.data['device'] && object.data['device'].toLowerCase() == 'android'){
      fields['data'] =  { title : 'MFound' , body : object.data['message'] , objectType : object.data['type']  } 
    }else if(object.data['device'] && object.data['device'].toLowerCase() == 'ios'){
      fields['notification']  = {   title : 'MFound' ,  data : { type : object.data['type'] } ,  body : object.data['message'] }
    }
    request({
      url: 'https://fcm.googleapis.com/fcm/send',
      method: 'POST',
      headers: {
        'Content-Type' :' application/json',
        'Authorization': 'key='+config.FCMServerKey+''  
      },
      body: JSON.stringify(fields)
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
  },



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


