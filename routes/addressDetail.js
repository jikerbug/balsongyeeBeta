

var express = require('express');
var router = express.Router();
var template = require('../views/template/template.js');
var auth = require('../lib/auth');
var mysql = require('mysql');
var dbConn = require('../lib/dbConn');

var db = dbConn.balsongyeeDb(mysql);


router.get('/', function(req, res){
  var id = req.session.userId;
  var groupIdx = req.query.groupIdx;


  if(id && groupIdx){//그룹식별idx가 있어야한다
    db.query('select * from address where idx = ?', [groupIdx], function (err, results, fields) {
      if(err) console.log("err : "+err);
      //없으면 null이 아니라 빈 리스트 리턴해주는 구나...
      if(results[0]){
        if(results[0].userId == id){
          var flashMsg = req.flash();
          var groupName = results[0].groupName;
          var feedback = '';
          if(flashMsg.error){
            feedback = '<script>alert("' + flashMsg.error + '")</script>';
          }
          var header = template.header(feedback, auth.statusUI(req,res)); 
          var footer = template.footer();
          res.render('addressDetail', {
                    header: header,
                    footer: footer,
                    groupName : groupName,
                    groupIdx : groupIdx //display:"none"해놓는 페이지 식별자!
                  });   
        }else{
          req.flash('error', '접근할 수 없습니다.')
          res.redirect('/');
        } 
      }else{
        req.flash('error', '잘못된 접근입니다.')
        res.redirect('/');
      } 
    });
  }else{
    req.flash('error', '아이디 혹은 그룹이 없습니다.')
    res.redirect('/')
  } 
});


router.post('/getPhonenumList', function(req, res){
  var id = req.session.userId;
  var groupIdx = req.query.groupIdx;

  if(!id){
    res.json([{ recid: 1, phonenum: "접근할 수 없습니다.", name: "" }]);
    return;
  }

  db.query('select userId from address where idx = ?', [groupIdx], function (err, results, fields) {
    if(err) console.log("err : "+err);
    if(results[0]){
      if(results[0].userId == id){
        db.query('select * from addressDetail where groupIdx = ?', [groupIdx], function (err, results, fields) {
          if(err) console.log("err : "+err);
          //없으면 null이 아니라 빈 리스트 리턴해주는 구나...
          if(results.length){//없으면 0이나와서 아래의 else문으로...
            var sendList = []
            for(var i =0; i<results.length; i++){
              var phonenum = results[i].phonenum;
              var name = results[i].name;
              sendList.push({ recid: i+1, phonenum: phonenum, name: name });
            }
            res.json(sendList);
          }else{
            res.json([{ recid: 1, phonenum: "등록된 번호가 없습니다.", name: "" }]);
          }
        });  
      }else{
        res.json([{ recid: 1, phonenum: "접근할 수 없습니다.", name: "" }]);
      } 
    }
  });
});

router.post('/addPhonenum', function(req, res){
  var id = req.session.userId;
  var groupIdx = req.body.groupIdx;
  var phonenum = req.body.phonenum;
  var name = req.body.name;
  if(!name){
    name = "이름없음"
  }

  if(!id){
    res.redirect('/');
    return;
  }

  db.query('select userId,count from address where idx = ?', [groupIdx], function (err, results, fields) {
    if(err) console.log("err : "+err);
    if(results[0]){
      if(results[0].userId == id){
        db.query('insert into addressDetail(groupIdx, phonenum, name) values(?,?,?)', [groupIdx, phonenum, name], function (err, results, fields) {
          if(err){
            console.log("err but just designed dup restrict logic: "+err);
            err += "";
            var errType = err.split(' ')[1];
            if(errType == 'ER_DUP_ENTRY:'){
              req.flash('error', '이미 존재하는 번호입니다.')
            }
          }else{
            db.query('update address set count = ? where idx= ?', [results[0].count + 1,groupIdx], function (err, results, fields) {
              res.redirect(`/addressDetail?groupIdx=${groupIdx}`);
            });
          } 
        });  
      }else{
        res.redirect('/');
      }
    }else{
      res.redirect('/');
    }
  });
  
});

router.post('/deletePhonenum', function(req, res){
  var id = req.session.userId;
  var groupIdx = req.body.groupIdx;
  var phonenum = req.body.phonenum;
  console.log(phonenum);

  if(!id){
    res.redirect('/');
    return;
  }

  db.query('select userId,count from address where idx = ?', [groupIdx], function (err, results, fields) {
    if(err) console.log("err : "+err);
    if(results[0]){
      if(results[0].userId == id){
        addressCnt = results[0].count;

        db.query('delete from addressDetail where groupIdx = ? and phonenum = ?', [groupIdx, phonenum], function (err, results, fields) {
          if(err) console.log("err : "+err);
      
          if(results.affectedRows == 1){
            db.query('update address set count = ? where idx= ?', [addressCnt - 1,groupIdx], function (err, results, fields) {
              res.send('OK');
            });   
          }else{
            res.send('삭제할 번호가 없습니다'); //여기도 사실 올일이 없다. 아마 ...
          }
        }); 

      }
    }
  }); 
});


router.post('/addPhonenumList', function(req, res){
  var id = req.session.userId;
  var groupIdx = req.body.groupIdx;
  var resultList = JSON.parse(req.body.phonenumList);
  var listCnt = resultList.length;

  console.log('/addPhonenumList router Entered');


  if(!id){
    res.redirect('/');
  }
  var addressCnt;
  db.query('select userId,count from address where idx = ?', [groupIdx], function (err, results, fields) {
    if(err) console.log("err : "+err);
    if(results[0]){
      if(results[0].userId == id){
        addressCnt = results[0].count

        var sql = `INSERT INTO addressDetail(groupIdx, phonenum, name)
        VALUES (${groupIdx},?,?);`;
                  
        var sqls = "";
        resultList.forEach(function(item){
          sqls += mysql.format(sql, [item.phonenum, item.name]);
        });

        console.log('쿼리 생성 완료');

        db.query(sqls,
          function (err, results, fields) {
          if (err){
            console.log("err dup key in /addPhonenumList : "+err);
            req.flash('error', '입력에러 발생. 고객센터또는 대표번호로 문의해주세요');
            res.redirect(`/addressDetail?groupIdx=${groupIdx}`);
          }else{
            console.log("입력완료");
            db.query('update address set count = ? where idx= ?', [addressCnt + listCnt,groupIdx], function (err, results, fields) {
              res.redirect(`/addressDetail?groupIdx=${groupIdx}`);
            });    
          }         
        });
      }else{
        res.redirect('/');
      }
    }else{
      res.redirect('/');
    }
  });
});




module.exports = router; 