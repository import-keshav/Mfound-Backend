/* node server -- commonCallback functions file
Name:- commonFunction.js
Created On:- 27/08/18
*/
module.exports = {
	callbackResponse : (code,data)=>{
		let callbackResponse = {};
		callbackResponse.statusCode = code;
		callbackResponse.result = data;
		return callbackResponse;	
	},
	checkLatLong : (checkPoint,centerPoint,km = 15)=>{
		let ky = 40000 / 360;
		let kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
		let dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
		let dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
		return Math.sqrt(dx * dx + dy * dy) <= km;
		
	}
}