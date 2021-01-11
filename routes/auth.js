var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var saltRounds = 12;
var mysql = require('mysql');


var dbConn = require('../lib/dbConn');
var db = dbConn.balsongyeeDb(mysql);



router.get('/login', function(req, res){
  
  var flashMsg = req.flash();
  var feedback = '';
  if(flashMsg.error){
    feedback = '<script>alert("' + flashMsg.error + '")</script>';
  }

  res.render('login', {script:feedback});
});


router.post('/login_process', function (req, res) {
  
  var post = req.body;
  var email = post.email;
  var passwd = post.pwd;

  db.query('select email,pwd from user where email = ?', [email], function (error, results, fields) {

    if(results[0]){
      bcrypt.compare(passwd, results[0].pwd, function(err,result) {
        if(result){
          req.session.is_logined = true;
          req.session.userId = email;
          req.session.save(function(){
            res.redirect(`/`);
          });
        }else{
          req.flash('error', '아이디 혹은 비밀번호가 일치하지 않습니다')
          res.redirect(`/auth/login`);
        };
        });
      }else{
        req.flash('error', '아이디 혹은 비밀번호가 일치하지 않습니다')
        res.redirect(`/auth/login`);
      }
  });
});


router.get('/logout', function (req, res) {
  req.session.destroy(function(err){
    res.clearCookie('connect.sid'); //이 쿠키를 서버의 sessionID와 비교하는 것!!
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
      bcrypt.genSalt(saltRounds, function(err, salt) {
        if(err) return next(err);
        
        bcrypt.hash(pwd, salt, function(err, hash) {
            // Store hash in your password DB.

            db.query(`INSERT INTO user
            VALUES ('` + email + `','` + hash + `')`,
              function (error, results, fields) {
              if (error) throw error;
              console.log(results[0]);
            });
            req.session.is_logined = true;
            req.session.userId = email;
            req.session.save(function(){
              res.redirect(`/`);
            });   
        });
      });
    }else{
      req.flash('error', '비밀번호가 다릅니다')
      res.redirect('/auth/register');
    }
  });  
});




module.exports = router; 