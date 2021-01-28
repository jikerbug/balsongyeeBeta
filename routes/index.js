var express = require('express');
var router = express.Router();
var template = require('../views/template/template.js');
var auth = require('../lib/auth');

var mysql = require('mysql2');
var dbConn = require('../lib/dbConn');


var db = dbConn.balsongyeeDb(mysql);



router.get('/', function(req, res){
  var flashMsg = req.flash();
  var feedback = '';
  if(flashMsg.error){
    feedback = '<script>alert("' + flashMsg.error + '")</script>';
  }

  var header = template.header(feedback, auth.statusUI(req,res)); 
  var footer = template.footer(); 

  var userId = req.session.userId;
  if(userId){
    var sidenav = template.sidenav();
    db.query('select cash,name from user where id = ?', [userId], function (err, results, fields) {

      var name = results[0].name;
      var coin = results[0].cash;
      var sms = coin;
      var lms = parseInt(coin/3);
      var mms = parseInt(coin/6);
      console.log(coin);
      var header = template.header(feedback, auth.statusUI(req,res)); 
      var footer = template.footer(); 
      var sidenav = template.sidenav(name, coin,sms,lms,mms);
      res.render('index', {
                header: header,
                footer: footer,
                sidenav: sidenav
      });   
    });
  }else{
    var sidenav = template.loginSidenav();
    res.render('index', {
      header: header,
      footer: footer,
      sidenav: sidenav
  });
  }
  

  
});



router.get('/services', function(req, res){
  var feedback = '';
  var header = template.header(feedback, auth.statusUI(req,res)); 
  var footer = template.footer(); 
  res.render('services', {
            header: header,
            footer: footer
        });
})

router.get('/test', function(req, res){
  res.render('test', {
            title: "<h1>MY HOMEPAGE</h1>",
            length: 5
        });
})



module.exports = router;