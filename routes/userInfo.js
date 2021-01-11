
var express = require('express');
var router = express.Router();
var template = require('../views/template/template.js');
var auth = require('../lib/auth');
var mysql = require('mysql');
var dbConn = require('../lib/dbConn');


var db = dbConn.balsongyeeDb(mysql);


router.get('/sendResult', function(req, res){
  var feedback = '';
  var header = template.header(feedback, auth.statusUI(req,res)); 
  var footer = template.footer(); 
  res.render('sendResult', {
            header: header,
            footer: footer
          });    
})

router.get('/cash', function(req, res){
  if(auth.isOwner(req,res)){
    var feedback = '';
    var header = template.header(feedback, auth.statusUI(req,res)); 
    var footer = template.footer();  
    res.render('cash', {
              header: header,
              footer: footer
            }); 
  }else{
    
    //req.session.flash = {'error':'로그인 후 이용해주세요'} 
    req.flash('error', '로그인 후 이용해주세요')
    res.redirect('/auth/login');
  } 
});


router.post('/processPayment', function(req, res){

  var paidAmount = req.body.paidAmount;
  console.log(paidAmount);
  paidAmount = parseInt(paidAmount);
  
  var id = req.session.userId;
  console.log(id);


  db.query('select cash from user where email = ?', [id], function (err, results, fields) {
    if(err) console.log("err : "+err);
    var currentCash = results[0].cash;
    console.log(currentCash);
    console.log(currentCash+paidAmount);
    db.query('update user set cash= ? where email = ?', [currentCash+paidAmount, id], function(err, results, fields) {
      if(err) console.log("err : "+err);
      res.send('OK');
    })
  });  

  
});





router.get('/address', function(req, res){
  var feedback = '';
  var header = template.header(feedback, auth.statusUI(req,res)); 
  var footer = template.footer(); 
  res.render('address', {
            header: header,
            footer: footer
          });    
})

router.get('/myPage', function(req, res){
  var feedback = '';
  var header = template.header(feedback, auth.statusUI(req,res)); 
  var footer = template.footer(); 
  res.render('myPage', {
            header: header,
            footer: footer
          });    
})






module.exports = router;