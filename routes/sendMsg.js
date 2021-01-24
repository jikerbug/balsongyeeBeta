
var express = require('express');
var router = express.Router();
var template = require('../views/template/template.js');
var auth = require('../lib/auth');
var dbConn = require('../lib/dbConn');
var actualSendMsg = require('../lib/actualSendMsg');
var supportSendMsg = require('../lib/supportSendMsg');
var mysql = require('mysql');

var db = dbConn.balsongyeeDb(mysql);

var fs = require('fs');
var multer  = require('multer');
const { send } = require('process');
var upload = multer({ 
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      var folderId = req.session.userId;   
      var dir = `./routes/userSendImg/${folderId}`;
      if (!fs.existsSync(dir)){
          fs.mkdirSync(dir);
      }
      cb(null, `routes/userSendImg/${folderId}/`);
    },
    filename: function (req, file, cb) {
      cb(null, 'userSendImg.jpg'); //이거 한글파일은 발송이 안됨!!
    }
  })
});


router.get('/', function(req, res){
  var flashMsg = req.flash();
  var feedback = '';
  if(flashMsg.error){
    feedback = '<script>alert("' + flashMsg.error + '")</script>';
  }

  var userId = req.session.userId;


  if(userId){
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
      
      var msgType = req.query.msgType;
      if(!msgType || msgType == "smslms"){
        res.render('sendMsg', {
          header: header,
          footer: footer,
          sidenav: sidenav
        });  
      }else if(msgType == "mms"){
        res.render('sendMsgMms', {
          header: header,
          footer: footer,
          sidenav: sidenav
        });  
      }else{
        res.render('sendMsg', {
          header: header,
          footer: footer,
          sidenav: sidenav
        });  
      }
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
});

router.post('/processMms',upload.single('file') , function(req, res){

  console.log(req.file);
  console.log(req.body);


  if(req.body.passwd == '3456'){

    console.log(req.body.passwd);
    console.log(req.body.phonenumList);
    processCashCheck(req, res);

  }else{
    res.send("잘못된 비밀번호입니다");
  }
  
});


router.post('/process', function(req, res){
  if(req.body.passwd == '3456'){

    console.log(req.body.passwd);
    console.log(req.body.phonenumList);
    processCashCheck(req, res);
  }else{
    res.send("잘못된 비밀번호입니다");
  }
  
});


/////처리함수
function processCashCheck(req,res) {


  var msgType = req.body.msgType
  var sendCnt = req.body.sendCnt
  var id = req.session.userId


  console.log(sendCnt + "명에게 " + msgType +"를 전송합니다");

  //결제처리
  if(msgType =="sms"){
    var price = 1;
  }else if(msgType =="lms"){
    var price = 3;
  }else if(msgType =="mms"){
    var price = 6;
  }
  
  var priceCash = sendCnt * price;

  db.query('select cash from user where id = ?', [id], function (err, results, fields) {
    if(err) console.log("err : "+err);
    var currentCash = results[0].cash;
    console.log("잔여 코인: " + currentCash);
    console.log("사용 코인: " + priceCash);
    if(currentCash < priceCash){
      res.send('잔여 코인이 부족합니다');  
    }else{
      db.query('update user set cash= ? where id = ?', [currentCash-priceCash, id], function(err, results, fields) {
        if(err) console.log("err : "+err);
        res.send("OK");//꼭 ok로 보내야함
        processSendList(req);
      })
    }   
  }); 
}


function processSendList(req){
  //TODO: phonenumList에 이름이 추가되어 있을때 분기처리 나중에 추가
  var resultList = JSON.parse(req.body.phonenumList);
  console.log(resultList);

  //분할발송시 -> processDbQuery를 여러번 수행하는 것으로 구현!
  var splitMinutes = req.body.splitMinutes;
  var countPerSplit = req.body.countPerSplit;
  if(splitMinutes){
    if(countPerSplit){
      splitMinutes = parseInt(splitMinutes);
      countPerSplit = parseInt(countPerSplit);

      var i,j,temparray;
      var minutesCnt = 0;
      for (i=0,j=resultList.length; i<j; i+=countPerSplit) {
          temparray = resultList.slice(i,i+countPerSplit);
          processDbQuery(temparray, req, splitMinutes*(minutesCnt), minutesCnt, '분할');
          minutesCnt++;
      }
    }else{console.log("발생할일 없지만 그냥 오류처리")}
  }else{
    processDbQuery(resultList, req, 0, 0, '일반');
  }
}


function processDbQuery(resultList, req, splitMinutes, groupNum, sendType) {
  //분할발송 아닌 경우에는 sendIndex에 추가할 groupNum은 0이다 splitMutes도 0이다
  var msgType = req.body.msgType;

  var reservedDate = req.body.reservedDate;
  if(reservedDate){
    if(sendType=='분할'){
      sendType = '분할&예약';
    }else{
      sendType = '예약';
    }
  }

  var sendDate = supportSendMsg.sendDateCalculate(reservedDate,splitMinutes);

  if(msgType == "sms"){
    actualSendMsg.sendSms(mysql, db, req, resultList, sendDate, groupNum, sendType);
    
  }else if(msgType == "lms"){
    actualSendMsg.sendLms(mysql, db, req, resultList, sendDate, groupNum, sendType);

  }else if (msgType == "mms"){
    actualSendMsg.sendMms(mysql, db, req, resultList, sendDate, groupNum, sendType);
  }

}



module.exports = router;
