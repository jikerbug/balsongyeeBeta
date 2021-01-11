
var express = require('express');
var router = express.Router();
var template = require('../views/template/template.js');
var auth = require('../lib/auth');
var mysql = require('mysql');
var dbConn = require('../lib/dbConn');
const { sidenav } = require('../views/template/template.js');


var db = dbConn.balsongyeeDb(mysql);




router.post('/process', function(req, res){
  if(req.body.passwd == '3456'){
    db.query(`INSERT INTO SC_TRAN (TR_SENDDATE, TR_SENDSTAT, TR_MSGTYPE, TR_PHONE, TR_CALLBACK, TR_MSG)
     VALUES (NOW(), '0', '0', '` + req.body.phonenum + `','01071891476','` + req.body.msg + `');`,
      function (err, results, fields) {
      if (err) throw err;
      console.log(results[0]);
    });
  }
  console.log(req.body);
  res.redirect('/sendMsg');
})

router.get('/', function(req, res){
  var flashMsg = req.flash();
  var feedback = '';
  if(flashMsg.error){
    feedback = '<script>alert("' + flashMsg.error + '")</script>';
  }

  var userId = req.session.userId;

  if(userId){
    db.query('select cash from user where email = ?', [userId], function (err, results, fields) {

      var coin = results[0].cash;
      var sms = coin;
      var lms = parseInt(coin/3);
      var mms = parseInt(coin/6);
  
      console.log(coin);
  
      var header = template.header(feedback, auth.statusUI(req,res)); 
      var footer = template.footer(); 
      var sidenav = template.sidenav("임지백", coin,sms,lms,mms);
      res.render('sendMsg', {
                header: header,
                footer: footer,
                sidenav: sidenav
      });   
    });
  }else{
    var header = template.header(feedback, auth.statusUI(req,res)); 
    var footer = template.footer(); 
    res.render('sendMsg', {
              header: header,
              footer: footer,
              sidenav: ""
    });   
  }



  




   
})




function processInputSend(req) {
  

  var pList = JSON.parse(req.body.phonenumList);

  var resultList = [];

  //pList[0]에는 일반 입력들이 모여있음
  for (var i = 0; i < pList[0].length; i++) {
    if(Number.isInteger(parseInt(pList[0][i]))){
      resultList.push(pList[0][i]);
    }
  }

  //pList[1]에는 엑셀파일 입력들이 모여있음
  var phonenum;
  for (var i = 0; i < pList[1].length; i++) {
    if(pList[1][i].length == 1){
      phonenum = pList[1][i][0];
      if(Number.isInteger(parseInt(phonenum))){

        phonenum = String(phonenum);
        phonenum = "0" + phonenum;
        resultList.push(phonenum);
      }else{
        console.log(phonenum);
        console.log("something wrong with fileInput")
      }
    }else{
      if(Number.isInteger(parseInt(pList[1][i][0]))){
        phonenum = pList[1][i][0]
        phonenum = String(phonenum);
        phonenum = "0" + phonenum;
        resultList.push(phonenum);
      }else if(Number.isInteger(parseInt(pList[1][i][1]))){
        phonenum = pList[1][i][1]
        phonenum = String(phonenum);
        phonenum = "0" + phonenum;
        resultList.push(phonenum);
      }else{
        console.log(phonenum);
        console.log("something wrong with fileInput")
      }
    } 
  }

  //pList[2]에는 텍스트파일 입력들이 모여있음

  console.log(resultList);
  processDbQuery(resultList, req.body.sender, req.body.msg, req.body.msgType, req.body.subject);
  
  
}

function processDbQuery(resultList, sender, msg, msgType, subject) {

    if(msgType == "sms"){
      var sql = `INSERT INTO SC_TRAN (TR_SENDDATE, TR_SENDSTAT, TR_MSGTYPE, TR_PHONE, TR_CALLBACK, TR_MSG)
      VALUES (NOW(), '0', '0', ?,'` + sender + `','` + msg + `');`;
      var sqls = "";
      resultList.forEach(function(item){
        sqls += mysql.format(sql, item);
      });
    }else if(msgType == "lms"){
      `INSERT INTO MMS_MSG (SUBJECT, PHONE, CALLBACK, STATUS, REQDATE, MSG, TYPE)
      VALUES ('[차세대MMS 전송테스트]', '수신 번호', '발신 번호', '0', NOW(), '5월 가
      정의달을 맞아 아래 기프트상품 구매시(10%할인)+(5%적립금)혜택을 드립니다.', '0');`

      var sql = `INSERT INTO MMS_MSG (SUBJECT, PHONE, CALLBACK, STATUS, REQDATE, MSG, TYPE)
      VALUES ('`+ subject + `', ?,'` + sender + `', '0', NOW(), '` + msg + `', '0');`;
      var sqls = "";
      resultList.forEach(function(item){
        sqls += mysql.format(sql, item);
      });

    }else{
      console.log("not sms and not lms ... fatal error")
    }
    

    console.log(sqls);

    
    db.query(sqls,
        function (error, results, fields) {
        if (error) throw error;
        console.log(results[0]);
    });
}



router.post('/processOld', function(req, res){



  if(req.body.passwd == '3456'){

    
    console.log(req.body.passwd);
    console.log(req.body.phonenumList);
    
    res.send("OK"); //꼭 ok로 보내야함

    processInputSend(req);


  }else{
    res.send("잘못된 비밀번호입니다");
  }
  
});

router.post('/processTest', function(req, res){
  if(req.body.passwd == '3456'){
    db.query(`INSERT INTO SC_TRAN (TR_SENDDATE, TR_SENDSTAT, TR_MSGTYPE, TR_PHONE, TR_CALLBACK, TR_MSG)
     VALUES (NOW(), '0', '0', '` + req.body.phonenum + `','01071891476','` + req.body.msg + `')`,
      function (error, results, fields) {
      if (error) throw error;
      console.log(results[0]);
    });
    res.send("OK");
  }else{
    res.send("잘못된 비밀번호입니다");
  }
});



module.exports = router;