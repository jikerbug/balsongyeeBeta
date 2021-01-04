
var express = require('express');
var router = express.Router();
var template = require('../views/template/template.js');
var auth = require('../lib/auth');
var mysql = require('mysql');
const { sendDataToProcessId } = require('pm2');



var db = mysql.createConnection({
  host     : 'localhost',
  port     : '3308',
  user     : 'root',
  password : 'Ih336449!',
  database : 'balsongyee',
  multipleStatements : true
});

db.connect();



router.post('/process', function(req, res){
  if(req.body.passwd == '3456'){
    db.query(`INSERT INTO SC_TRAN (TR_SENDDATE, TR_SENDSTAT, TR_MSGTYPE, TR_PHONE, TR_CALLBACK, TR_MSG)
     VALUES (NOW(), '0', '0', '` + req.body.phonenum + `','01071891476','` + req.body.msg + `');`,
      function (error, results, fields) {
      if (error) throw error;
      console.log(results[0]);
    });
  }
  console.log(req.body);
  res.redirect('/');
})

router.get('/', function(req, res){
  var feedback = '';
  var header = template.header(feedback, auth.statusUI(req,res)); 
  res.render('sendMsg', {
            header: header,
            length: 5
          });    
})




function processInputSend(phonenumList, sender, msg) {

  var pList = JSON.parse(phonenumList);

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
  processDbQuery(resultList, sender, msg);
  
  
}

function processDbQuery(resultList, sender, msg) {
    var sql = `INSERT INTO SC_TRAN (TR_SENDDATE, TR_SENDSTAT, TR_MSGTYPE, TR_PHONE, TR_CALLBACK, TR_MSG)
    VALUES (NOW(), '0', '0', ?,'` + sender + `','` + msg + `');`;
    var sqls = "";
    resultList.forEach(function(item){
      sqls += mysql.format(sql, item);
    });

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

    processInputSend(req.body.phonenumList, req.body.sender, req.body.msg);


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