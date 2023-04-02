/* farmease server --- bootstrap file
Name :- Server.js
Created On :- 23/08/18
*/

// npm packages 
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
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
//app.use(dashRoutes);
//app.use('/static',express.static('public'));
////app.use(cors({origin: 'http://127.0.0.1:3002'}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(cors({origin: '*'}));
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
const port = process.env.PORT || 3000;
app.get('/', (req,res,next)=>{
	res.send('Node Server Up and Running :-)');
	next();
})
//initiate the express app
http.listen(3000);


const https = require('https');
const fs = require('fs');
const options = {
  key: fs.readFileSync('/home/ec2-user/certs/privkey.pem','utf8').toString(),
  cert: fs.readFileSync('/home/ec2-user/certs/cert.pem','utf8').toString(),
  ca: fs.readFileSync('/home/ec2-user/certs/chain.pem','utf8').toString()
};



https.createServer(options,app, function (req, res) { console.log(`server listening on port 3002`);  }).listen(3002);



console.log('Node Server Started at '+ port);
