/* node server -- callbacks functions file
Name:- callbacks.js
Created On:- 27/08/18
*/
//user callbacks
const authCallback = require('./allCallbacks/authCallback');
const commonCallback = require('./allCallbacks/commonCallback');
const userCallback = require('./allCallbacks/userCallback');
const dashboardCallback = require('./allCallbacks/dashboardCallback');

module.exports =  {authCallback,commonCallback,userCallback,dashboardCallback} ;
