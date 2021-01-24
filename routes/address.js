

var express = require('express');
var router = express.Router();
var template = require('../views/template/template.js');
var auth = require('../lib/auth');
var mysql = require('mysql');
var dbConn = require('../lib/dbConn');

var db = dbConn.balsongyeeDb(mysql);


router.get('/', function(req, res){
  var id = req.session.userId;

  if(id){
    var flashMsg = req.flash();
    var feedback = '';
    if(flashMsg.error){
      feedback = '<script>alert("' + flashMsg.error + '")</script>';
    }
    var header = template.header(feedback, auth.statusUI(req,res)); 
    var footer = template.footer(); 
    res.render('address', {
              header: header,
              footer: footer
        });   
  }else{
    req.flash('error', '로그인 후 이용해주세요')
    res.redirect('/auth/login');
  }        
});


router.get('/detail', function(req, res){
  var feedback = '';
  var header = template.header(feedback, auth.statusUI(req,res)); 
  var footer = template.footer(); 
  res.render('addressDetail', {
            header: header,
            footer: footer
          });    
});


router.post('/getGroups', function(req, res){
  var userId = req.session.userId;

  db.query('select idx,groupName,count from address where userId = ? order by idx desc', [userId], function (err, results, fields) {
    if(err) console.log("err : "+err);
    //없으면 null이 아니라 빈 리스트 리턴해주는 구나...
    if(results.length){//없으면 0이나와서 아래의 else문으로...
      var sendList = []
      for(var i =0; i<results.length; i++){
        var groupName = results[i].groupName;
        var count = results[i].count;
        sendList.push({ recid: i+1, groupName: groupName, count: count })
      }
      res.json(sendList);
    }else{
      res.json([{ recid: 1, groupName: "생성한 그룹이 없습니다", count: "" }])
    }
  });  
});

router.post('/addGroup', function(req, res){
  var userId = req.session.userId;
  var groupName = req.body.groupName;

  if(userId){
    db.query('select groupName,count from address where userId = ? and groupName = ?', [userId,groupName], function (err, results, fields) {
      if(err) console.log("err : "+err);
      //없으면 null이 아니라 빈 리스트 리턴해주는 구나...
      if(results.length){//있으면 중복이라 추가안해준다
        req.flash('error', '이미 존재하는 그룹명입니다')
        res.redirect('/address')
      }else{
        db.query('insert into address(userId,groupName,count) values(?,?,?)', [userId, groupName, 0], function (err, results, fields) {
          if(err) console.log("err : "+err);
          //없으면 null이 아니라 빈 리스트 리턴해주는 구나...
          res.redirect('/address')
        }); 
      }
    }); 
    
  }
  
});





module.exports = router; 