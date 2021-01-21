var express = require('express');
var router = express.Router();
var template = require('../views/template/template.js');
var sendResultTemplate = require('../views/template/sendResult.js');
var auth = require('../lib/auth');
var mysql = require('mysql');
var dbConn = require('../lib/dbConn');


var db = dbConn.balsongyeeDb(mysql);


router.get('/', function(req, res){

  var msgType = req.query.msgType;
  var pageNum = req.query.pageNum;
  var id = req.session.userId;

  if(!pageNum){
    pageNum = '1';
  }
  pageNum = parseInt(pageNum);

  if(id){
    var feedback = '';
    var header = template.header(feedback, auth.statusUI(req,res)); 
    var footer = template.footer();  

    if(!msgType ||(msgType !="lms" && msgType !="mms")){ //msgType이 없거나 sms와 다른 이상한 get도 다 sms가 기본값인것!
      db.query('select * from userSendResultSMS where userId = ? ORDER BY TR_SENDDATE DESC', [id], function (err, results, fields) {
        if(err) console.log("err : "+err);

        //slice는 범위 넘어가도 오류없이 범위 내의 것들만 처리해준다!
        if(results){
          var resultPage = results.slice((pageNum-1)*20, pageNum*20);

          var sendResult = sendResultTemplate.sendResult(resultPage);
  
          var sendResultPageLinks = sendResultTemplate.sendResultPageLinks(results.length, msgType,pageNum);
        }else{
          var sendResult = '';
          var sendResultPageLinks = '';
        }
        

        res.render('sendResult', {
          header: header,
          footer: footer,
          title: "단문 발송결과",
          sendResult: sendResult,
          sendResultPageLinks: sendResultPageLinks
        });         
      });    
    }else if(msgType !="lms"){
      res.render('sendResult', {
        header: header,
        footer: footer,
        title: "장문 발송결과",
        sendResult: "sendResult"
      });  
    }else if(msgType == "mms"){
      res.render('sendResult', {
        header: header,
        footer: footer,
        title: "장문 발송결과",
        sendResult: "sendResult"
      });  
    }
  }else{
    req.flash('error', '로그인 후 이용해주세요')
    res.redirect('/auth/login');
  }
});


router.get('/detail', function(req, res){

  var userSendIndex = req.query.userSendIndex;
  var msgType = req.query.msgType;
  var id = req.session.userId;

  var date = new Date();
  var currentYYYYMM = date.getFullYear + (date.getMonth+1);

  if(msgType =="sms"){
    db.query('select * from SC_TRAN where userId = ? and userSendIndex = ?', [id,userSendIndex], function (err, resultsFromSC_TRAN, fields) {
      if(err) console.log("err : "+err);
      db.query(`select * from SC_LOG${currentYYYYMM} where userId = ? and userSendIndex = ?`, [id,userSendIndex], function (err, resultsFromSC_LOG, fields) {
      var feedback = '';
      var header = template.header(feedback, auth.statusUI(req,res)); 
      var footer = template.footer();  
      var sendResultDetail = sendResultTemplate.sendResultDetail(resultsFromSC_TRAN, resultsFromSC_LOG);

      var msg = resultsFromSC_TRAN[0].TR_MSG; 
      var callback = resultsFromSC_TRAN[0].TR_CALLBACK;
      var msgContent = sendResultTemplate.msgContent(msg, "제목없음(단문발송)", callback);
      res.render('sendResultDetail', {
                header: header,
                footer: footer,
                msgContent: msgContent,
                sendResultDetail: sendResultDetail
              }); 
      }); 
  }); 
  }else if(msgType =="lms"){
  
  }else if(msgType =="mms"){

  }else{
    res.redirect('/');
  }
});





module.exports = router;