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
//face recognition start
//const AWS = require('aws-sdk');
//AWS.config.update({region:'us-east-2'});
//const rekognition = new AWS.Rekognition({apiVersion: '2016-06-27'});





// const params = {
//   SimilarityThreshold: 90, 
//   SourceImage: {
//    S3Object: {
//     Bucket: "www.mfound.in", 
//     Name: "face-match/aamir.jpeg"
//    }
//   }, 
//   TargetImage: {
//    S3Object: {
//     Bucket: "www.mfound.in", 
//     Name: "face-match/aamir.jpeg"
//    }
//   }
//  };

// rekognition.compareFaces(params, function (err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log(data);           // successful response
// });





//end
// configure app and use
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({limit : '50mb', extended: false }))
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(routes);
//app.use(dashRoutes);
//app.use('/static',express.static('public'));
////app.use(cors({origin: 'http://127.0.0.1:3000'}));
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
http.listen(port);
console.log('Node Server Started at '+ port);
