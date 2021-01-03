
var express = require('express');
var router = express.Router();
var template = require('../views/template/template.js');
var auth = require('../lib/auth');
var mysql = require('mysql');



var db = mysql.createConnection({
  host     : 'localhost',
  port     : '3308',
  user     : 'root',
  password : 'Ih336449!',
  database : 'balsongyee'
});

db.connect();



router.post('/process', function(req, res){
  if(req.body.passwd == '3456'){
    db.query(`INSERT INTO SC_TRAN (TR_SENDDATE, TR_SENDSTAT, TR_MSGTYPE, TR_PHONE, TR_CALLBACK, TR_MSG)
     VALUES (NOW(), '0', '0', '` + req.body.phonenum + `','01071891476','` + req.body.msg + `')`,
      function (error, results, fields) {
      if (error) throw error;
      console.log(results[0]);
    });
  }
  console.log(req.body);
  res.redirect('/');
})

router.get('/', function(req, res){
  var feedback = '';
  var header = template.header(feedback, auth.statusUI(req,res)); 
  res.render('sendMsg', {
            header: header,
            length: 5
          });    
})



router.post('/processOld', function(req, res){
  console.log(req.body);
  console.log("data");

  if(req.body.passwd == '3456'){

    console.log(req.body.passwd);
    console.log(req.body);
    
    res.send("OK"); //꼭 ok로 보내야함

    db.query('insert into test(id) value("' + req.body.msg + '")', function (error, results, fields) {
      if (error) throw error;
      console.log(results[0]);
    });

  }else{
    res.send("잘못된 비밀번호입니다");
  }
  
});

router.post('/processTest', function(req, res){
  if(req.body.passwd == '3456'){
    db.query(`INSERT INTO SC_TRAN (TR_SENDDATE, TR_SENDSTAT, TR_MSGTYPE, TR_PHONE, TR_CALLBACK, TR_MSG)
     VALUES (NOW(), '0', '0', '` + req.body.phonenum + `','01071891476','` + req.body.msg + `')`,
      function (error, results, fields) {
      if (error) throw error;
      console.log(results[0]);
    });
    res.send("OK");
  }else{
    res.send("잘못된 비밀번호입니다");
  }
});



module.exports = router;