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


router.get('/login', function(req, res){
  var flashMsg = req.flash();
  var feedback = '';
  if(flashMsg.error){
    feedback = '<div style="color:red;margin:10px;"><h5>' + flashMsg.error + '</h5></div>';
  }


  res.render('login');
});

router.get('/logout', function (req, res) {
  req.logout();
  req.session.save(function(){
  res.redirect('/');
  });
});

router.get('/register', function (req, res) {
  var flashMsg = req.flash();
  var feedback = '';
  if(flashMsg.error){
    feedback = '<div style="color:red; margin:10px;"><h5>' + flashMsg.error + '</h5></div>';
  }
  
  res.render('register');
});


router.post('/register_process', function (req, res) {
  var post = req.body;
  var email = post.email;
  var pwd = post.pwd;
  var pwdCheck = post.pwdCheck;


  db.query('select email from user where email = ?', [email], function (error, results, fields) {
    console.log(results)
    if(!(results.length === 0)){
      req.flash('error', '이미 존재하는 아이디입니다')
      res.redirect('/auth/register');
      return false;
    }

    if(pwd === pwdCheck){
      db.query(`INSERT INTO user
       VALUES ('` + email + `','` + pwd + `')`,
        function (error, results, fields) {
        if (error) throw error;
        console.log(results[0]);
      });
      req.login({'email':email, 'pwd':pwd}, function(err) {
        return res.redirect('/');
      });
    }else{
      req.flash('error', '비밀번호가 다릅니다')
      res.redirect('/auth/register');
    }
  });  
});




module.exports = router; 