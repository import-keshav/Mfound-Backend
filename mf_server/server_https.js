/* farmease server --- bootstrap file
Name :- Server.js
Created On :- 23/08/18
*/

// npm packages 
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const https = require('https');
//const http = require('http').Server(app);
//const io = require('socket.io')(http);
const morgan = require('morgan');
const routes = require('./api/routes/routes');
//const dashRoutes = require('./api/routes/dashboard/routes');
const cors = require('cors');
//end
// configure app and use
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({limit : '50mb', extended: false }))
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(routes);
app.use('/static',express.static('public'));
//app.use(dashRoutes);
//app.use('/static',express.static('public'));
////app.use(cors({origin: 'http://127.0.0.1:3000'}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(cors({origin: '*'}));

const key = fs.readFileSync('./sslcert/server.key','utf8');
const cert = fs.readFileSync( './sslcert/server.crt' ,'utf8');
const options = {
  key: key,
  cert: cert
};
const httpsserver = https.createServer(options, app);
const io = require('socket.io').listen(httpsserver);
//end
io.on('connection', (socket) => {
	console.log('socket is up');
	socket.on('disconnect', function() {
        console.log('socket is down');
    });
	socket.on('send-notification', (message) => {
		console.log(message);
		socket.broadcast.emit('get-notification', { type: 'new-message', message: message });
    });
});
//port
const port = process.env.PORT || 3001;
app.get('/', (req,res,next)=>{
	res.send('Node Server Up and Running :-)');
	next();
})
//initiate the express app
httpsserver.listen(3001, function () {
  console.log('Node Express server Started '+ port);
});
//http.listen(port);
//console.log('Node Server Started at '+ port);