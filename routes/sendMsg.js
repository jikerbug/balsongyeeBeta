
var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
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
  if (!auth.isOwner(req, res)) {

    req.flash('info', 'login required');
    res.redirect('/');
    return false;
  }
  var form = template.form();
  var html = template.html(form, auth.statusUI(req,res)); 
  res.send(html);
})



router.post('/processOld', function(req, res){
  if(req.body.passwd == '3456'){
    db.query('insert into test(id) value("' + req.body.msg + '")', function (error, results, fields) {
      if (error) throw error;
      console.log(results[0]);
    });
  }
  console.log(req.body);
  res.redirect('/');
})



module.exports = router;