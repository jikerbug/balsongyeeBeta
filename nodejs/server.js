const { response } = require('express');
var bodyParser = require('body-parser');
const express = require('express');
const app = express();


app.use(express.urlencoded({ extended: true }))
// parse application/json
//app.use(express.json())

var mysql = require('mysql');

var db = mysql.createConnection({
  host     : 'localhost',
  port     : '3306',
  user     : 'root',
  password : 'mm55',
  database : 'balsongyee'
});

db.connect();


app.listen(8080, function(){
  console.log("listening on 8080");
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/htmls/index.html');
})

app.post('/process/sendMsgOld', function(req, res){
  if(req.body.passwd == '3456'){
    db.query('insert into test(id) value("' + req.body.msg + '")', function (error, results, fields) {
      if (error) throw error;
      console.log(results[0]);
    });
  }
  console.log(req.body);
  res.sendFile(__dirname + '/htmls/index.html');
})

app.post('/process/sendMsg', function(req, res){
  if(req.body.passwd == '3456'){
    db.query(`INSERT INTO SC_TRAN (TR_SENDDATE, TR_SENDSTAT, TR_MSGTYPE, TR_PHONE, TR_CALLBACK, TR_MSG)
     VALUES (NOW(), '0', '0', '` + req.body.phonenum + `','01071891476','` + req.body.msg + `')`,
      function (error, results, fields) {
      if (error) throw error;
      console.log(results[0]);
    });
  }
  console.log(req.body);
  res.sendFile(__dirname + '/htmls/index.html');
})

app.post('/test', function(req, res){
  console.log(req.body.color);
  res.sendFile(__dirname + '/htmls/sendMsg.html');
})

app.get('/sendMsg', function(req, res){
  res.sendFile(__dirname + '/htmls/sendMsg.html');
})