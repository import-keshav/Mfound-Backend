/* node server -- routes file
Name:- routes.js
Created On:- 27/08/18
*/
const express = require('express');
const app =express();

const multiparty = require('connect-multiparty'),
	multipartyMiddleware = multiparty();

const authApi = require('../controllers/authController');
const userApi = require('../controllers/userController');
const lostApi = require('../controllers/lostController');
const foundApi = require('../controllers/foundController');
const enquiryApi = require('../controllers/enquiryController');
const docsApi = require('../controllers/docsController');
const donateApi = require('../controllers/donateController');
const commonApi = require('../controllers/commonController');
const categoryApi = require('../controllers/categoryController');
const notificationApi = require('../controllers/notificationController');
const dashboardApi = require('../controllers/dashboardController');
const uploadApi = require('../controllers/uploadController');
//api's routing url  
// auth api's  -- auth controller
app.post('/api/v1/auth/login',authApi.login);
app.post('/api/v1/auth/signup',authApi.signup);
app.post('/api/v1/auth/logout',authApi.userLogout);
app.post('/api/v1/auth/forgetPassword',authApi.forgetPassword);
app.post('/api/v1/auth/updatePassword',authApi.updatePassword);
app.post('/api/v1/auth/changePassword',authApi.changePassword);
app.post('/api/v1/auth/signInWithSocial',authApi.signInWithSocial);
app.get('/api/v1/auth/verifyOTP/:type/:emailphone/:otp',authApi.verifyOTP); 
app.get('/emailVerification/:type/:verification_code',authApi.emailVerification);
app.post('/api/v1/auth/otp/send',authApi.sendOTP);
// user's api's -- user controller
app.get('/api/v1/user/:id',userApi.getUserDetail);
//app.post('/api/v1/user',userApi.updateUserDetail);
//lost 
app.post('/api/v1/lost',lostApi.lost);
//found
app.post('/api/v1/found',foundApi.found);
app.post('/api/v1/found/match', multipartyMiddleware ,  foundApi.foundMatch);

//enquiry
app.post('/api/v1/enquiry',enquiryApi.enquiry);
//docsdocs
app.post('/api/v1/docs',docsApi.docs);
//donate
app.post('/api/v1/donate',donateApi.donate);
//upload
app.post('/api/v1/upload', multipartyMiddleware ,  uploadApi.upload);

//type :-  lost,found,enquiry,docs,donate
//role :- id , user , admin
//id :- id , user_id
app.get('/api/v1/:type/:role/:id',commonApi.getData); 
//category
app.get('/api/v1/category/:type',categoryApi.getCategory); 
//notification
app.get('/api/v1/notification/:userid',notificationApi.getNotification); 
//dashboard
app.post('/api/v1/dashboard',dashboardApi.getDashboardData); 
//search api
app.get('/api/v1/filter/:type/:key',commonApi.searchByKey); 




module.exports = app;