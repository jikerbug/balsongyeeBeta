module.exports = {
  sendDateCalculate: function(reservedDate, splitMinutes) {
    //분할발송 아닌 경우에는 sendIndex에 추가할 groupNum은 0이다
    //과거 날짜(하루 이상 차이까지는 나지 않는)로 보내도 now()로 보내준다!
    //splitMinutes는 분할발송으로 인한 해당 그룹의 시간갭이다.

    //예약발송
    var sendDate;
    if(reservedDate){
      sendDate = `${reservedDate}`;
    }else{
      var now = new Date();
      var time = now.getTime();
      var date = new Date(time); 

      var month = (9 > date.getMonth()) ? '0' + (date.getMonth()+1) : date.getMonth()+1;
      var day = (10 > date.getDate()) ? '0' + date.getDate() : date.getDate();
      var hours = (10 > date.getHours()) ? '0' + date.getHours() : date.getHours();
      var minutes = (10 > date.getMinutes()) ? '0' + date.getMinutes() : date.getMinutes();
      sendDate = `${date.getFullYear()}-${month}-${day} ${hours}:${minutes}`;
    }

    //분할발송
    if(splitMinutes){

      //'2021-01-18 23:25:09' -> 계산하기 위해 Date 객체로 만들어줘야한다
      var y = sendDate.substr(0,4),
          m = sendDate.substr(5,2),
          d = sendDate.substr(8,2),
          h = sendDate.substr(11,2),
          min = sendDate.substr(14,2);

      sendDate = new Date(y,m-1,d,h,min); 

      var time = sendDate.getTime() + splitMinutes * 1000 * 60;
      var date = new Date(time); 

      var month = (9 > date.getMonth()) ? '0' + (date.getMonth()+1) : date.getMonth()+1;
      var day = (10 > date.getDate()) ? '0' + date.getDate() : date.getDate();
      var hours = (10 > date.getHours()) ? '0' + date.getHours() : date.getHours();
      var minutes = (10 > date.getMinutes()) ? '0' + date.getMinutes() : date.getMinutes();

      sendDate = `${date.getFullYear()}-${month}-${day} ${hours}:${minutes}`;
       
      console.log('sendDate :'+sendDate);
    }
    return sendDate;
  },
  sendSms: async function (mysql, db, req, resultList, sendType, splitMinutes) {

    var reservedDate = req.body.reservedDate;
    if(reservedDate){
      if(sendType=='분할'){
        sendType = '분할&예약';
      }else{
        sendType = '예약';
      }
    }
    var sender = req.body.sender;
    var msg = req.body.msg;
    var id = req.session.userId;
    var sendDate = this.sendDateCalculate(reservedDate,splitMinutes);
    
    var userSendTitle = msg.split(' ')[0];
    var sqlForSendDate = `INSERT INTO userSendResult VALUES(NULL,?,?,?,?,?,?,?)`//NULL을 넣으면 auto_increment제대로 동작

    const dbPromise = db.promise();

    const [rows,fields] = await dbPromise.query(sqlForSendDate, [id,resultList.length,userSendTitle, sendDate,sender, msg, sendType]);
    var userSendIndex = rows.insertId;
    var sql = `INSERT INTO SC_TRAN (TR_SENDDATE, TR_SENDSTAT, TR_MSGTYPE, TR_PHONE, TR_CALLBACK, TR_MSG, userSendIndex)
    VALUES ('${sendDate}', '0', '0', ?,'${sender}', '${msg}', ${userSendIndex});`;
              
    var sqls = "";
    resultList.forEach(function(item){
      sqls += mysql.format(sql, item);
    });

    //console.log(sqls);
    
    db.query(sqls,
      function (error, results, fields) {
      if (error) throw error;
      console.log("발송완료");
    }); 
   
  },
  sendLms:function(mysql, db, req, resultList, sendDate, groupNum, sendType) {

    var sender = req.body.sender;
    var msg = req.body.msg;
    var id = req.session.userId;
    var subject = req.body.subject;


    var sql = `INSERT INTO MMS_MSG (SUBJECT, PHONE, CALLBACK, STATUS, REQDATE, MSG, TYPE)
    VALUES ('`+ subject + `', ?,'` + sender + `', '0', `+ sendDate +`, '` + msg + `', '0');`;

    var sqls = "";
    resultList.forEach(function(item){
      sqls += mysql.format(sql, item);
    });

    console.log(sqls);
    
    // db.query(sqls,
    //   function (error, results, fields) {
    //   if (error) throw error;
    //   console.log("발송완료");
    // });
    
  },
  sendMms:function (mysql, db, req, resultList, sendDate, groupNum, sendType) {

    var subject = req.body.subject;
    var sender = req.body.sender;
    var msg = req.body.msg;
    var id = req.session.userId;
    var file = req.file;
    console.log(file);

    // 'routes/userSendImg/mrimc/'이런식으로 path가 나오고 __dirname도 routes까지 나오니까 file

    var filePathParsed = file.path.substring(6, file.path.length);
    var filePath = __dirname + filePathParsed;
    var sql = `INSERT INTO MMS_MSG (SUBJECT, PHONE, CALLBACK, STATUS, REQDATE, MSG, FILE_CNT, FILE_PATH1, TYPE)
    VALUES ('`+ subject + `', ?,'` + sender + `', '0',` + sendDate + `, '` + msg + `', '1', '`+ filePath + `', '0');`;
    
    //따로 함수로 빼려고 했으나, db쿼리안에 넣으면 작동이 잘 안되는 듯,,,,
    var sqls = "";
    resultList.forEach(function(item){
      sqls += mysql.format(sql, item);
    });

    console.log(sqls);
    
    // db.query(sqls,
    //   function (error, results, fields) {
    //   if (error) throw error;
    //   console.log("발송완료");
    // });
  }
} 

