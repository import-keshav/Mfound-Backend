/* node server -- db config file
Name:- db.js
Created On:- 24/08/18
*/
const mysql = require('mysql');
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "MADHAV@92",
  database: "mfoundin_mfoundDB",
  port:3306
});

// const con = mysql.createPool({

//host: "localhost",
  //user: "mfoundin_mfound",
 // password: "MADHAV@92",
 // database: "mfoundin_mfoundDB",
 // port:3306


//         connectionLimit : 100,
//         host: "166.62.28.143",
//         user: "farmease",
//         password: "farmease@123",
//         database: "farmease_db",
//         port:3306
//     });


// con.getConnection(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
// });



module.exports = con;
