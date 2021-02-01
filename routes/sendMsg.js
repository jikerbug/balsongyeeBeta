
const express = require('express');
const router = express.Router();
const template = require('../views/template/template.js');
const auth = require('../lib/auth');
const actualSendMsg = require('../lib/actualSendMsg');

const mysql = require('mysql2'); //mysql.format을 쓰기 위함!
const db = require("../lib/dbpool");


const fs = require('fs');
const multer  = require('multer');
const upload = multer({ 
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      var folderId = req.session.userId;   
      var dir = `./ui/userSendImg/${folderId}`;
      if (!fs.existsSync(dir)){
          fs.mkdirSync(dir);
      }
      cb(null, `ui/userSendImg/${folderId}/`);
    },
    filename: function (req, file, cb) {
      var id = Math.random().toString(36).substring(3); 
      cb(null, `img${id}.jpg`); //이거 한글파일은 발송이 안됨!!
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
      if(err) console.log('/sendMsg/ err :' + err);

      if(!results){
        res.redirect('/');
        return;
      }
      var name = results[0].name;
      var coin = results[0].cash;
      var sms = coin;
      var lms = parseInt(coin/3);
      var mms = parseInt(coin/6);

  
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

  //console.log(req.file);
  //console.log(req.body);


  if(req.body.passwd == '3456'){

    console.log(req.body.passwd);
    //console.log(req.body.phonenumList);
    processCashCheck(req, res);

  }else{
    res.send("잘못된 비밀번호입니다");
  }
  
});


router.post('/process', function(req, res){
  if(req.body.passwd == '3456'){
    console.log(req.body.passwd);
    processCashCheck(req, res);
  }else{
    res.send("잘못된 비밀번호입니다");
  }
  
});


/////처리함수
async function processCashCheck(req,res) {

  var msgType = req.body.msgType
  var id = req.session.userId

  var resultList = JSON.parse(req.body.phonenumList);

  var sendAddressGroup = JSON.parse(req.body.sendAddressGroup);
  var addressDetailList = new Array();


  //여기서 디비에서 다 꺼내와도 금방 처리된다. 1초도 안걸리는듯
  //따라서 초반에 다 처리해주는게 로직이 더 간단함!
  //주소록왔을경우 처리
  console.log(sendAddressGroup);
  if(sendAddressGroup.length > 0){
    const dbPromise = db.promise();
    for (var i=0;i<sendAddressGroup.length;i++) {
      var groupIdx = sendAddressGroup[i].groupIdx;
      const [rows,fields] = await dbPromise.query('select phonenum from addressDetail where groupIdx = ?', [groupIdx]);
      console.log(rows);
      for(var j=0;j<rows.length;j++){
        addressDetailList.push(rows[j].phonenum);
      }
      var groupIdx = sendAddressGroup[i].groupIdx  
    }
  }



  var sendCnt = resultList.length; //클라이언트에서 받아오는 sendCnt는 좀 잘못구현된부분이 있는듯 해서 이렇게 바꿈,,,,(1명에게 sms를 전송합니다.9명 중복입니다.)
  resultList = resultList.concat(addressDetailList); //기존배열을 변경하지 않습니다. //추가된 새로운 배열을 반환합니다.
  
  resultList = Array.from( 
    resultList.reduce((m, t) => m.set(t, t), new Map()).values()
  );

  var addressGroupCnt = addressDetailList.length;
  var oldSendCnt = sendCnt+addressGroupCnt;
  sendCnt = resultList.length;
  var dupNum = oldSendCnt-sendCnt

  console.log(sendCnt + "명에게 " + msgType +"를 전송합니다." + dupNum + "명 중복입니다.");


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
      //res.send('잔여 코인이 부족합니다');  //많이 보내는거 테스트 가능하게 이렇게 만든거!
      res.send("OK");//꼭 ok로 보내야함
      processSendList(req,resultList);
    }else{
      db.query('update user set cash= ? where id = ?', [currentCash-priceCash, id], function(err, results, fields) {
        if(err) console.log("err : "+err);
        res.send("OK");//꼭 ok로 보내야함
        processSendList(req,resultList);
      })
    }   
  }); 
}


function processSendList(req,resultList){
  //TODO: phonenumList에 이름이 추가되어 있을때 분기처리 나중에 추가
  

  //분할발송시 -> processDbQuery를 여러번 수행하는 것으로 구현!
  var splitMinutes = req.body.splitMinutes;
  var countPerSplit = req.body.countPerSplit;


  if(splitMinutes){
    if(countPerSplit){
      console.log('분할');
      console.log(splitMinutes);
      console.log(countPerSplit);
      splitMinutes = parseInt(splitMinutes);
      countPerSplit = parseInt(countPerSplit);

      var i,j,temparray;
      var minutesCnt = 0;
      for (i=0,j=resultList.length; i<j; i+=countPerSplit) {
          temparray = resultList.slice(i,i+countPerSplit);
          processDbQuery(temparray, req, splitMinutes*(minutesCnt), '분할');
          minutesCnt++;
      }
    }else{console.log("발생할일 없지만 그냥 오류처리")}
  }else{
    processDbQuery(resultList, req, 0, '일반');
  }
}


function processDbQuery(resultList, req, splitMinutes, sendType) {
  var msgType = req.body.msgType;
  if(msgType == "sms" || msgType == "lms"){
    actualSendMsg.sendSmsLms(mysql, db, req, resultList, sendType, splitMinutes, msgType);
  }else if (msgType == "mms"){
    actualSendMsg.sendMms(mysql, db, req, resultList, sendType, splitMinutes);
  }
}



module.exports = router;
