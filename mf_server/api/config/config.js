/* node server -- config file
Name:- config.js
Created On:- 27/08/18
*/
const config = {
	secret : "982@#(asuhAAND",
	mailFrom : "dev@mfound.in",  //'infomfound@gmail.com',   //"dev@mfound.in",
	postmarkSecret : "95af7862-dc08-42e6-b65e-b0ef53e5d954",
	emailExpiryTime : 30,
	emailVerificationLik : "http://mfound.in:3000/emailVerification",

         //emailVerificationLik : "http://ec2-18-188-138-130.us-east-2.compute.amazonaws.com:3000/emailVerification",
	mediaImageUrlForBanner : "http://mfound.in:49155/media/images/banners/",
	mediaImageUrlForProfile : "http://mfound.in:49155/media/images/profiles/",
	FCMServerKey :  "AIzaSyAJ0TCy-4QkIREfAzZVgZQBlZUI6UWIdqA",   // "AIzaSyDJn4Kxx7rd9KcPqwWrKzRV-tg1rJNADLo", ////////////
	TextLocalAPI : "351ce35cd6979381b6269dbc0de7af279080b024e83290fa475f15081c34d6cc", /////////
	twilioAccountSid : "AC50b4dad667930947c4f0b98eb3a01124", /////////
	twilioAuthToken : "451539963afa0c298795e78ac6e4fcca", ///////
	twilioNumber : '+19727871865', ////////
	sandBoxStripeKey : 'sk_test_PEKkZKlKiAeu1yW9v5xGt71i' //////
};
module.exports = config;


