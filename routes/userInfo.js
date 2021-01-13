
var express = require('express');
var router = express.Router();
var template = require('../views/template/template.js');
var auth = require('../lib/auth');
var mysql = require('mysql');
var dbConn = require('../lib/dbConn');
const { sendResult } = require('../views/template/template.js');


var db = dbConn.balsongyeeDb(mysql);


router.get('/sendResult', function(req, res){

  var id = req.session.userId;

  if(id){
    var feedback = '';
    var header = template.header(feedback, auth.statusUI(req,res)); 
    var footer = template.footer();  

    db.query('select * from userSendResultSMS where userId = ?', [id], function (err, results, fields) {
      if(err) console.log("err : "+err);
      var sendResult = template.sendResult(results,"sms");
      
      res.render('sendResult', {
        header: header,
        footer: footer,
        sendResult: sendResult
      }); 
             
  });    
  }else{
    
    //req.session.flash = {'error':'로그인 후 이용해주세요'} 
    req.flash('error', '로그인 후 이용해주세요')
    res.redirect('/auth/login');
  } 
});


router.get('/sendResult/:tagId', function(req, res){

  var userSendIndex = req.params.tagId;
  var id = req.session.userId;

  db.query('select * from SC_TRAN where userId = ? and userSendIndex = ?', [id,userSendIndex], function (err, results, fields) {
    if(err) console.log("err : "+err);
    
    var sendResultDetail = template.sendResultDetail(results);
    res.render('sendResultDetail', {
              header: header,
              footer: footer,
              sendResultDetail: sendResultDetail
    }); 
   
  });  



});




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

  var coin;
  if(paidAmount == 100){
    coin = 6;
  }else if(paidAmount == 10000){
    coin = 600;
  }else if(paidAmount == 20000){
    coin = 1200;
  }else if(paidAmount == 30000){
    coin = 1800;
  }
  
  var id = req.session.userId;
  console.log(id +"가 결제를 진행합니다");


  db.query('select cash from user where id = ?', [id], function (err, results, fields) {
    if(err) console.log("err : "+err);
    var currentCash = results[0].cash;
    console.log(currentCash);
    console.log(currentCash+coin);
    db.query('update user set cash= ? where id = ?', [currentCash+coin, id], function(err, results, fields) {
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