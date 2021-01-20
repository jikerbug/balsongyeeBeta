
var express = require('express');
var router = express.Router();
var template = require('../views/template/template.js');
var auth = require('../lib/auth');
var dbConn = require('../lib/dbConn');
var mysql = require('mysql');

var db = dbConn.balsongyeeDb(mysql);

var fs = require('fs');
var multer  = require('multer');
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
    
    processInputSendPermission(req, res);

  }else{
    res.send("잘못된 비밀번호입니다");
  }
  
});


router.post('/process', function(req, res){
  if(req.body.passwd == '3456'){

    console.log(req.body.passwd);
    console.log(req.body.phonenumList);
    processInputSendPermission(req, res);
  }else{
    res.send("잘못된 비밀번호입니다");
  }
  
});


/////처리함수
function processInputSendPermission(req,res) {


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
          processDbQuery(temparray, req, splitMinutes*(minutesCnt), minutesCnt);
          minutesCnt++;
      }
    }else{console.log("발생할일 없지만 그냥 오류처리")}
  }else{
    console.log(resultList);
    processDbQuery(resultList, req, req.body.splitMinutes, 0);
  }

  
}


function processDbQuery(resultList, req, splitMinutes, groupNum) {
  var sender = req.body.sender;
  var msg = req.body.msg;
  var msgType = req.body.msgType;
  var subject = req.body.subject;
  var id = req.session.userId;
  var file = req.file;
  var reservedDate = req.body.reservedDate;

  //분할발송 아닌 경우에는 sendIndex에 추가할 groupNum은 0이다


  //과거 날짜(하루 이상 차이까지는 나지 않는)로 보내도 now()로 보내준다!
  //모듈 다시 이식했을때 확인
  //예약발송
  var sendDate;
  if(reservedDate){
    sendDate = '"' + reservedDate + '"';
  }else{
    sendDate = 'NOW()'
  }


  //분할발송
  if(splitMinutes || splitMinutes == 0){
    if(sendDate == 'NOW()'){
      var now = new Date();
      var time = now.getTime() + splitMinutes * 1000 * 60;
      var date = new Date(time); 

      var month = (9 > date.getMonth()) ? '0' + (date.getMonth()+1) : date.getMonth()+1;
      var day = (10 > date.getDate()) ? '0' + date.getDate() : date.getDate();
      var hours = (10 > date.getHours()) ? '0' + date.getHours() : date.getHours();
      var minutes = (10 > date.getMinutes()) ? '0' + date.getMinutes() : date.getMinutes();

      sendDate = "'" + date.getFullYear() +"-"+ month +"-"+ day + " " + hours + ":" + minutes + "'";

    }else{

      //2021-01-18 23:25:09
      var y = sendDate.substr(1,4),
          m = sendDate.substr(6,2),
          d = sendDate.substr(9,2),
          h = sendDate.substr(12,2),
          min = sendDate.substr(15,2);

      sendDate = new Date(y,m-1,d,h,min); 
      var time = sendDate.getTime() + splitMinutes * 1000 * 60;
      var date = new Date(time); 

      var month = (9 > date.getMonth()) ? '0' + (date.getMonth()+1) : date.getMonth()+1;
      var day = (10 > date.getDate()) ? '0' + date.getDate() : date.getDate();
      var hours = (10 > date.getHours()) ? '0' + date.getHours() : date.getHours();
      var minutes = (10 > date.getMinutes()) ? '0' + date.getMinutes() : date.getMinutes();

      sendDate = "'" + date.getFullYear() +"-"+ month +"-"+ day + " " + hours + ":" + minutes + "'";
    }     
    console.log(sendDate);
  }


  if(msgType == "sms"){

    //한번 발송을 수행할때, 해당 발송 그룹을 sendResult에 묶어서 보여줄 수 있어야한다. 그래야 발송결과 편하게 확인
    //이때 묶음을 구별하기 위해 사용할 것이 userSendIndex와 id이다
    db.query('select userSendIndex from user where id = ?', [id], function (err, results, fields) {
      if(err) console.log("err : "+err);
      var userSendIndex = results[0].userSendIndex + groupNum*7;
      db.query('update user set userSendIndex= ? where id = ?', [userSendIndex+1, id], function(err, results, fields) {
        if(err) console.log("err : "+err);
        //분할발송시 userSendIndex가 업데이트 되기 전에 select가 수행되기 때문에 이런 방식으로 구분!
        //and... 어차피 업데이트되면 무조건 더 커지고, 그 커진걸 바탕으로 groupNum만큼 추가로 + 해주는 것이기 때문에 노상관!
        //그리고 혹시몰라서 * 7으로까지해줬으니 노상관!!

        //sms발송결과테이블처리 
        //발송하기 전이라도 어쨌든, 발송 요청묶음에 대해 확인을 미리 해볼수 있는게 좋다!
        //따라서 이것을 이렇게 앞에 놓게된다 //이것 이후에 response를 하는 방향도 고려해보자
        var userSendTitle = msg.split(' ')[0];
        db.query('INSERT INTO userSendResultSMS VALUES(?,?,?,?,NOW(),?,?)', 
        [id,userSendIndex,resultList.length,userSendTitle, sender, msg], 
        function (err, results, fields) {
          if(err) console.log("err : "+err);
        }); 

        //다중 insert문 쿼리 하나로 모아주는 로직!! 

        //이렇게도 되기는 하네
        //var temp = mysql.format('INSERT INTO userSendResultSMS VALUES(?)', [100]);
      

        var sql = `INSERT INTO SC_TRAN (TR_SENDDATE, TR_SENDSTAT, TR_MSGTYPE, TR_PHONE, TR_CALLBACK, TR_MSG, userId, userSendIndex)
        VALUES (`+ sendDate +`, '0', '0', ?,'` + sender + `','` + msg + `','`+ id +`',`+ userSendIndex + `);`;
        var sqls = "";
        resultList.forEach(function(item){
          sqls += mysql.format(sql, item);
        });

        console.log(sqls);
        

        // 대량 발송처리
        db.query(sqls,
          function (error, results, fields) {
          if (error) throw error;
          console.log("발송완료");
        });


      })
    });  
  }else if(msgType == "lms"){
    `INSERT INTO MMS_MSG (SUBJECT, PHONE, CALLBACK, STATUS, REQDATE, MSG, TYPE)
    VALUES ('[차세대MMS 전송테스트]', '수신 번호', '발신 번호', '0', NOW(), '5월 가
    정의달을 맞아 아래 기프트상품 구매시(10%할인)+(5%적립금)혜택을 드립니다.', '0');`

    var sql = `INSERT INTO MMS_MSG (SUBJECT, PHONE, CALLBACK, STATUS, REQDATE, MSG, TYPE)
    VALUES ('`+ subject + `', ?,'` + sender + `', '0', `+ sendDate +`, '` + msg + `', '0');`;
    var sqls = "";
    resultList.forEach(function(item){
      sqls += mysql.format(sql, item);
    });

    //lms발송결과테이블처리

    //대량 발송처리
    db.query(sqls,
      function (error, results, fields) {
      if (error) throw error;
      console.log("발송완료");
    });

  }else if (msgType == "mms"){
    `INSERT INTO MMS_MSG (SUBJECT, PHONE, CALLBACK, STATUS, REQDATE, MSG, FILE_CNT,
      FILE_PATH1, TYPE) VALUES ('[차세대MMS 전송테스트]', '수신 번호', '발신 번호', '0',
      NOW(), '5월 가정의 달을 맞아 아래 기프트 상품 구매 시(10%할인)+(5%적립금)혜택을 드립
      니다. 당사사정에 의해 변동/취소 가능', '1', 'D:\\UPLUSAGT\\image\\sample.jpg', '0');
      `

    // 'routes/userSendImg/mrimc/'이런식으로 path가 나오고 __dirname도 routes까지 나오니까 file

    var filePathParsed = file.path.substring(6, file.path.length);
    var filePath = __dirname + filePathParsed;
    var sql = `INSERT INTO MMS_MSG (SUBJECT, PHONE, CALLBACK, STATUS, REQDATE, MSG, FILE_CNT, FILE_PATH1, TYPE)
    VALUES ('`+ subject + `', ?,'` + sender + `', '0',` + sendDate + `, '` + msg + `', '1', '`+ filePath + `', '0');`;
    var sqls = "";
    resultList.forEach(function(item){
      sqls += mysql.format(sql, item);
    });

    console.log(sqls);
    console.log('실제쿼리는 주석처리함')

    //mms발송결과테이블처리

    //대량 발송처리
    
    // db.query(sqls,
    //   function (error, results, fields) {
    //   if (error) throw error;
    //   console.log("발송완료");
    // });


  }

}







module.exports = router;
