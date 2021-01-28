module.exports = {
  sendSms: function (mysql, db, req, resultList, sendDate, groupNum, sendType) {
    var sender = req.body.sender;
    var msg = req.body.msg;
    var id = req.session.userId;

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
        var sqlForSendDate = `INSERT INTO userSendResult VALUES(?,?,?,?,` + sendDate + `,?,?,?)`
        db.query(sqlForSendDate, 
        [id,userSendIndex,resultList.length,userSendTitle, sender, msg, sendType], 
        function (err, results, fields) {
          if(err) console.log("err : "+err);
          }); 
          //다중 insert문 쿼리 하나로 모아주는 로직!! 

          //이렇게도 되기는 하네
          //var temp = mysql.format('INSERT INTO userSendResult VALUES(?)', [100]);

          var sql = `INSERT INTO SC_TRAN (TR_SENDDATE, TR_SENDSTAT, TR_MSGTYPE, TR_PHONE, TR_CALLBACK, TR_MSG, userId, userSendIndex)
          VALUES (`+ sendDate +`, '0', '0', ?,'` + sender + `','` + msg + `','`+ id +`',`+ userSendIndex + `);`;
                    
          //따로 함수로 빼려고 했으나, db쿼리안에 넣으면 작동이 잘 안되는 듯,,,,
          var sqls = "";
          resultList.forEach(function(item){
            sqls += mysql.format(sql, item);
          });

          console.log(sqls);
          
          db.query(sqls,
            function (error, results, fields) {
            if (error) throw error;
            console.log("발송완료");
          });
        });
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

