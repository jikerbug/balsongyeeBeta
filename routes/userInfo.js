var express = require('express');
var router = express.Router();
var template = require('../views/template/template.js');
var auth = require('../lib/auth');
var mysql = require('mysql2');
var dbConn = require('../lib/dbConn');

var db = dbConn.balsongyeeDb(mysql);


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




router.get('/myPage', function(req, res){
  var feedback = '';
  var header = template.header(feedback, auth.statusUI(req,res)); 
  var footer = template.footer(); 
  res.render('myPage', {
            header: header,
            footer: footer
          });    
});

router.post('/saveMyMsg', function(req, res){
  var msg = req.body.msg;
  var userId = req.session.userId;
  console.log(msg);

  db.query('insert into myMsg values(null,?,?)', [userId,msg], function (err, results, fields) {
    if(err) console.log(err);
    res.send('OK');
  });  

  
});


router.get('/getMyMsg', function(req, res){
  
  var userId = req.session.userId;

  db.query('select userMsg from myMsg where userId = ? order by idx desc', [userId], function (err, results, fields) {
    if(err) console.log('/sendMsg/ err :' + err);

    var myMsgList = []
    var i;
    for(i=0; i<results.length;i++){
      myMsgList.push(results[i]);
    }
    //myMsg는 총 4개만 유지할 수 있도록 하자.
    res.json(myMsgList);
  });
});












module.exports = router;