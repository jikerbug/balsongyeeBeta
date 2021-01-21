module.exports = {
  smsAllType:function(req, res,db,auth,template,sendResultTemplate,msgType) {

    var detailType = req.query.detailType;
    var userSendIndex = req.query.userSendIndex;
    var thisDate = req.query.thisDate;
    var pageNum = req.query.pageNum;
    if(!pageNum){
      pageNum = '1';
    }
    pageNum = parseInt(pageNum);
    var id = req.session.userId;

    

    //이 4개의 값이 모두 있어야 페이지 보여줄 수 있다!(msgType은 앞에서 타입 분류할때 검사함)
    if(!thisDate || !userSendIndex || !id || !detailType){
      res.redirect('/');
      return 0;
    }
    db.query('select * from SC_TRAN where userId = ? and userSendIndex = ?', [id,userSendIndex], function (err, resultsFromSC_TRAN, fields) {
      if(err) console.log("err : "+err);
      console.log(thisDate);
      db.query(`select * from SC_LOG_${thisDate} where userId = ? and userSendIndex = ?`, [id,userSendIndex], function (err, resultsFromSC_LOG, fields) {
        var feedback = '';
        var header = template.header(feedback, auth.statusUI(req,res)); 
        var footer = template.footer();  
        var sendResultDetail = sendResultTemplate.sendResultDetail(
          resultsFromSC_TRAN, resultsFromSC_LOG, msgType, userSendIndex, thisDate, pageNum);
    
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
  }
 

}



