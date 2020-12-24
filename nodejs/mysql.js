var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  port     : '3308',
  password : 'Ih336449!',
  database : 'balsongyee'
});
 
connection.connect();
 
connection.query('SELECT * from test', function (error, results, fields) {
  if (error) throw error;
  console.log(results);
});
 
connection.end();