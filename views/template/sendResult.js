module.exports = {
    sendResultDetail:function(tuplesInSC_TRAN, tuplesInSC_LOG) {

      var sendResult = ``;

      if(tuplesInSC_TRAN){
        for(var i =0; i< tuplesInSC_TRAN.length; i++){
          var date = this.getFormatDate(tuplesInSC_TRAN[i].TR_SENDDATE);
          var phone = tuplesInSC_TRAN[i].TR_PHONE;
          var status = '진행중'
          sendResult += this.detailForm(date, phone, status);
        }
      }
      

      if(tuplesInSC_LOG){
        for(var i =0; i< tuplesInSC_LOG.length; i++){
          var date = this.getFormatDate(tuplesInSC_LOG[i].TR_SENDDATE);
          var phone = tuplesInSC_LOG[i].TR_PHONE;
          var status = '전송완료'
          sendResult += this.detailForm(date, phone, status);
        }
      }
      return sendResult;
      
    },
    sendResult:function(tuples) {

      var sendResult = ``;

      for(var i =0; i< tuples.length; i++){
        var date = this.getFormatDate(tuples[i].TR_SENDDATE);
        var title = tuples[i].userSendTitle;
        var sendType = tuples[i].sendType;
        var cnt = tuples[i].userSendCnt;
        var success = cnt;
        var fail = cnt - success;
        var status = fail ? '진행중' : '완료';
        var sendResultIndex = tuples[i].userSendIndex;
        sendResult += this.standardForm(date, title, sendType, cnt, success, fail, status,sendResultIndex);
      }

      return sendResult;
      
    },
    getFormatDate: function(date){
      // yyyy-MM-dd 포맷으로 반환
      var year = date.getFullYear();              //yyyy
      var month = (1 + date.getMonth());          //M
      month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
      var day = date.getDate();                   //d
      day = day >= 10 ? day : '0' + day;          //day 두자리로 저장
      var hours = date.getHours();
      hours = hours >= 10 ? hours : '0' + hours;  
      var minutes = date.getMinutes();
      minutes = minutes >= 10 ? minutes : '0' + minutes; 
      return  year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;
    },
    standardForm: function(date, title, sendType, cnt, success, fail, status, sendResultIndex) {
      return `
      <tr>
      <th scope="col">
            <input type="checkbox"  aria-label="Checkbox for following text input">
      </th>
      <td><a href="/sendResult/detail/?msgType=sms&userSendIndex=${sendResultIndex}">상세보기</a></td>
      <td>${date}</td>
      <td>${title}</td>
      <td>${sendType}</td>
      <td>${cnt}</td>
      <td>${success}</td>
      <td>${fail}</td>
      <td>${status}</td>
      </tr>`
    },
    detailForm:function(date, phone, status) {
      return `<tr>
      <th scope="row">1</th>
      <td>${date}</td>
      <td>${phone}</td>
      <td>${status}</td>
      </tr>`
    },
    msgContent:function(msg, subject, callback){
      return `
      <div class="phone-section">
        <input type="text" class="form-control" value="${subject}"/>
        <div class="php-email-form">
          <textarea class="form-control" name="msg" id="msg" rows="16" style="width: 100%;"
            data-rule="required">${msg}</textarea>
        </div>
        <input type="text" class="form-control" value="발신번호 : ${callback}"/>
      </div>
            `;
    },sendResultPageLinks:function(resultLength,msgType, currentPageNum) {

      var pageLength = parseInt(resultLength/20) + 1;


      var html = ``;
      var pageform = function(pageNum) {
        return ` <li class="page-item"><a class="page-link" href="/sendResult/?msgType=${msgType}&pageNum=${pageNum}">${pageNum}</a></li>`
      }

      var prevNum = currentPageNum-1;
      var nextNum = currentPageNum+1;
      if(prevNum == 0){
        prevNum = 1;
      }
      console.log(pageLength);
      console.log(nextNum);
      if(nextNum == pageLength+1){
        nextNum = pageLength;
      }
      html += `<a class="page-link" href="/sendResult/?msgType=${msgType}&pageNum=${prevNum}" aria-label="Previous">
      <span aria-hidden="true">&laquo;</span>
      <span class="sr-only">Previous</span>
    </a>`

      for(var i = 0; i<pageLength; i++){
        html += pageform(i+1)
      }

      html += `<a class="page-link" href="/sendResult/?msgType=${msgType}&pageNum=${nextNum}" aria-label="Next">
      <span aria-hidden="true">&raquo;</span>
      <span class="sr-only">Next</span>
    </a>`
      return html;
      
    }
    



}
