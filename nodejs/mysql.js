var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  port     : '3306',
  password : 'mm55',
  database : 'balsongyee'
});
 
connection.connect();
 
connection.query('SELECT * from test', function (error, results, fields) {
  if (error) throw error;
  console.log(results);
});
 
connection.end();