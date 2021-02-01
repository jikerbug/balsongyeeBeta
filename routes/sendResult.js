var express = require('express');
var router = express.Router();
var template = require('../views/template/template.js');
var sendResultTemplate = require('../views/template/sendResult.js');
var auth = require('../lib/auth');
var dbConn = require('../lib/dbConn');
var mysql = require('mysql2');

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

      res.render('sendResult', {
        header: header,
        footer: footer,
        title: "단문 발송결과",
        msgType: "sms"
      });            
    }else if(msgType =="lms"){
      res.render('sendResult', {
        header: header,
        footer: footer,
        title: "장문 발송결과",
        msgType: "lms"
      });        
    }else if(msgType == "mms"){
      res.render('sendResult', {
        header: header,
        footer: footer,
        title: "사진 발송결과",
        msgType: "mms"
      });  
    }
  }else{
    req.flash('error', '로그인 후 이용해주세요')
    res.redirect('/auth/login');
  }
});



router.get('/detail', function(req, res){

  var msgType = req.query.msgType;
  var id = req.session.userId;

  
  console.log(msgType);
  if(!msgType || !id){
    res.redirect('/');
    return 0;
  }

  var sendDate = req.query.sendDate; //이거는 sendMonth로 리팩터 해야될듯,,,,
  var date = new Date(sendDate); 
  var sendYYYYMM = (date.getFullYear()) *100 + date.getMonth()+1;
  var userSendIndex = req.query.userSendIndex;


  db.query('select * from userSendResult where userSendIndex = ?', [userSendIndex], function (err, results, fields) {
    var msg = results[0].TR_MSG; 
    var callback = results[0].TR_CALLBACK;
    var sendDate = results[0].TR_SENDDATE;

    var title = "제목없음(단문발송)";
    if(msgType !='sms'){
      title = results[0].userSendTitle;
    }
    var msgContent;
    if(msgType =='mms'){
      var filePath = results[0].FILE_PATH1;

      //절대경로로 저장되어있는 것을, static 폴더 지정된 ui안의 폴더인 userSendImg로 시작하게, /를 쓰게 바꾸는 작업!
      filePath = filePath.split('userSendImg')[1];
      filePath = 'userSendImg\\'+ filePath;
      filePath = filePath.replace(/[\\]/g,"/");
      msgContent = sendResultTemplate.mmsContent(msg, title, callback,sendDate,filePath);
    }else{
      msgContent = sendResultTemplate.msgContent(msg, title, callback,sendDate);
    }

    var feedback ='';
    var header = template.header(feedback, auth.statusUI(req,res)); 
    var footer = template.footer();  
    res.render('sendResultDetail', {
              userSendIndex: userSendIndex,
              sendYYYYMM: sendYYYYMM,
              header: header,
              footer: footer,
              msgContent: msgContent,
              msgType : msgType
            }); 
  }); 
  

});


router.get('/getResultDetailList', function(req, res){
  var userSendIndex = req.query.userSendIndex;
  var sendYYYYMM = req.query.sendYYYYMM;
  var userId = req.session.userId;
  var msgType = req.query.msgType;


  if(!userId){
    res.redirect('/');
    return 0;
  }

  
  var resultDetailList = []
  if(msgType == 'sms'){
    db.query('select * from SC_TRAN where userSendIndex = ?', [userSendIndex], function (err, resultsFromSC_TRAN, fields) {
      if(err) console.log("err : "+err);
      
      if(resultsFromSC_TRAN){
        var status;
        for(var i=0;i<resultsFromSC_TRAN.length;i++){
          status = '진행중'
          resultDetailList.push({recid:i+1, phonenum:resultsFromSC_TRAN[i].TR_PHONE, status: status});
        }
      }
  
      db.query(`select * from SC_LOG_${sendYYYYMM} where userSendIndex = ?`, [userSendIndex], function (err, resultsFromSC_LOG, fields) {
        if(resultsFromSC_LOG){
          var status;
          for(var i=0;i<resultsFromSC_LOG.length;i++){
            status = (resultsFromSC_LOG[i].TR_RSLTSTAT == '06') ? '완료' : '실패'
            resultDetailList.push({recid:i+resultsFromSC_TRAN.length+1, phonenum:resultsFromSC_LOG[i].TR_PHONE, status: status});
          }
        }
        res.json(resultDetailList);
      }); 
    }); 
  }else if(msgType == 'lms' || msgType == 'mms'){
    db.query('select * from MMS_MSG where userSendIndex = ?', [userSendIndex], function (err, resultsMMS, fields) {
      if(err) console.log("err : "+err);
      
      if(resultsMMS){
        var status;
        for(var i=0;i<resultsMMS.length;i++){
          status = '진행중'
          resultDetailList.push({recid:i+1, phonenum:resultsMMS[i].PHONE, status: status});
        }
      }
      res.json(resultDetailList);
  
      // db.query(`select * from SC_LOG_${sendYYYYMM} where userSendIndex = ?`, [userSendIndex], function (err, resultsLOG, fields) {
      //   if(resultsFromSC_LOG){
      //     var status;
      //     for(var i=0;i<resultsLOG.length;i++){
      //       status = (resultsLOG[i].TR_RSLTSTAT == '06') ? '완료' : '실패'
      //       resultDetailList.push({recid:i+resultsMMS.length+1, phonenum:resultsLOG[i].TR_PHONE, status: status});
      //     }
      //   }
      //   res.json(resultDetailList);
      // }); 
    }); 
  }
  
});

router.get('/getResultList', function(req, res){

  var msgType = req.query.msgType;
  var userId = req.session.userId;
  if(!userId){
    res.redirect('/');
    return 0;
  }

  //console.log(msgType);

  var resultList = [];
  var jsonData;
  var sendDate;
 
  db.query(`select * from userSendResult where userId = ? and msgType = '${msgType}' order by processDate desc`, [userId], function (err, results, fields) {
    if(results){
      for(var i=0;i<results.length;i++){
        sendDate = sendResultTemplate.getFormatDate(results[i].TR_SENDDATE);
        processDate = results[i].processDate;
        jsonData = {recid:results[i].userSendIndex, processDate:processDate,sendDate:sendDate, msg: results[i].userSendTitle,
          sendType: results[i].sendType,count:results[i].userSendCnt}
        resultList.push(jsonData);
      }
    }
    res.json(resultList);
  });
});

router.post('/deleteResult', function(req, res){
  var userId = req.session.userId;
  var selectionList = req.body.selectionList;
  console.log(selectionList)

  if(userId){
    res.send('OK'); 
    for(var i=0; i<selectionList.length;i++){
      db.query('delete from userSendResult where userSendIndex = ? and userId = ?', [selectionList[i],userId], function (err, results, fields) {
        if(err) console.log("err : "+err);      
      }); 
    }
  }else{
    res.send('잘못된 사용자 접근입니다.')
  }
});



module.exports = router;