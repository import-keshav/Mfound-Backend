/* node server -- routes file
Name:- routes.js
Created On:- 27/08/18
*/
const express = require('express');
const app = express();
const authApi = require('../controllers/authController');
const userApi = require('../controllers/userController');
const lostApi = require('../controllers/lostController');
const foundApi = require('../controllers/foundController');
const enquiryApi = require('../controllers/enquiryController');
const docsApi = require('../controllers/docsController');
const donateApi = require('../controllers/donateController');
const wefoundApi = require('../controllers/wefoundController');

const commonApi = require('../controllers/commonController');
const categoryApi = require('../controllers/categoryController');
const notificationApi = require('../controllers/notificationController');
const dashboardApi = require('../controllers/dashboardController');

const paymentApi = require('../controllers/paymentController');

const pricingApi = require('../controllers/pricingController');

const qrCodeApi = require('../controllers/QRController');

const productsApi = require('../controllers/productController');

const cartApi = require('../controllers/cartController');



//api's routing url  
// auth api's  -- auth controller
app.post('/api/v1/auth/login', authApi.login);
app.post('/api/v1/auth/login-via-otp', authApi.loginWithOTP);
app.post('/api/v1/auth/login-verify-otp', authApi.verifyLoginOTP);
app.post('/api/v1/auth/signup', authApi.signup);
app.post('/api/v1/auth/logout', authApi.userLogout);

app.post('/api/v1/connect-call',authApi.connectCall);

app.get('/api/v1/knowlarity/get-mobile/:qr_code_id',authApi.knowlarityMobile);


app.post('/api/v1/auth/forgetPassword', authApi.forgetPassword);
app.post('/api/v1/auth/updatePassword', authApi.updatePassword);
app.post('/api/v1/auth/changePassword', authApi.changePassword);
app.post('/api/v1/auth/signInWithSocial', authApi.signInWithSocial);
app.get('/api/v1/auth/verifyOTP/:id/:mobile/:otp', authApi.verifyOTP);
app.get('/emailVerification/:type/:verification_code', authApi.emailVerification);
app.post('/api/v1/auth/otp/send', authApi.sendOTP);
// user's api's -- user controller
app.get('/api/v1/user/:id', userApi.getUserDetail);
app.put('/api/v1/users/:id', userApi.updateUserId);
app.post('/api/v1/user', userApi.updateUserDetail);

//lost 
app.post('/api/v1/lost', lostApi.lost);
app.put('/api/v1/lost/:id', lostApi.updateLost);
//found
app.post('/api/v1/found', foundApi.found);
app.put('/api/v1/found/:id', foundApi.updateFound);
app.post('/api/v1/found/match', foundApi.foundMatch);
//enquiry
app.post('/api/v1/enquiry', enquiryApi.enquiry);
app.put('/api/v1/enquiry/:id', enquiryApi.updateEnquiry);
//`csdocs
app.post('/api/v1/docs', docsApi.docs);
app.put('/api/v1/docs/:id', docsApi.updateDocs);
//donate
app.post('/api/v1/donate', donateApi.donate);
//wefound
app.post('/api/v1/wefound', wefoundApi.wefound);
app.post('/api/v1/common-upload', wefoundApi.wefoundOther);



//pricing
app.post('/api/v1/pricing', pricingApi.pricing);
app.put('/api/v1/pricing/:id', pricingApi.updatePricing);




//type :-  lost,found,enquiry,docs,donate
//role :- id , user , admin
//id :- id , user_id
app.get('/api/v1/:type/:role/:id', commonApi.getData);
app.delete('/api/v1/:type/:id', commonApi.deleteData);

app.get('/api/v1/home', commonApi.getHomeData);

//category
app.get('/api/v1/category/:type', categoryApi.getCategory);
app.put('/api/v1/category/:id', categoryApi.updateCategory);
//notification

app.post('/api/v1/set/notification', notificationApi.setNotificationToken);
app.get('/api/v1/notification/:userid', notificationApi.getNotification);

app.post('/api/v1/notification/lost', notificationApi.sendLostNotification);

//app.post('/api/v1/notification/qr', notificationApi.sendQRNotification);


app.post('/api/v1/notification/all', notificationApi.sendNotificationAll);

//dashboard
app.post('/api/v1/dashboard', dashboardApi.getDashboardData);
//search api
app.get('/api/v1/filter/:type/:key', commonApi.searchByKey);
//payment api -- paytm
app.post('/api/v1/paytm/generate_checksum', paymentApi.generateCheckSum);
app.post('/api/v1/paytm/callback', paymentApi.paytmCallback);
app.post('/api/v1/pay', paymentApi.pay);

app.post('/api/v1/sent-to-wallet', paymentApi.sendToWallet);

app.post('/api/v1/razor-pay-order-create', paymentApi.razorPayCreateOrder);

//qrcode api
app.post('/api/v1/save_qr_codes', qrCodeApi.saveAllQRCode);
app.post('/api/v1/add_qr_code', qrCodeApi.addQRCode);
app.post('/api/v1/qr_code_status_change', qrCodeApi.changeQRCodeStatus);
app.post('/api/v1/get_qr_code_status', qrCodeApi.getQRCodeStatus);
//products api
app.post('/api/v1/products', productsApi.saveProducts);

app.post('/api/v1/category_based_products', commonApi.getCategoryBasedProducts);

app.post('/api/v1/product_category', productsApi.saveProductCategory);


app.post('/api/v1/save_cart', cartApi.saveCart);
app.post('/api/v1/place_order', cartApi.placeOrder);

// version's api -- app controller
app.post('/api/v1/app_version',commonApi.checkAppVersion);


module.exports = app;
