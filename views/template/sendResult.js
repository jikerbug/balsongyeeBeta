module.exports = {
    sendResultDetail:function(tuplesInSC_TRAN, tuplesInSC_LOG, msgType, sendResultIndex, thisDate, currentPageNum) {

      var sendResult = ``;
      
      
      var loadingCnt = tuplesInSC_TRAN.length;
      var successCnt = 0;
      var failCnt = 0;
      var loggedCnt = 0;
      var tuplePerPage = 2;

      console.log(tuplesInSC_LOG)
      if(tuplesInSC_LOG){//그냥 하면 Cannot read property 'length' of undefined이거뜸!
        loggedCnt = tuplesInSC_LOG.length
      }

      var allCnt = loadingCnt +loggedCnt;

      if(tuplesInSC_TRAN){
        for(var i =(currentPageNum-1)*tuplePerPage; i< currentPageNum*tuplePerPage && i<tuplesInSC_TRAN.length; i++){
          var date = this.getFormatDate(tuplesInSC_TRAN[i].TR_SENDDATE);
          var phone = tuplesInSC_TRAN[i].TR_PHONE;
          var status = '진행중'
          sendResult += this.detailForm(date, phone, status);
        }
      }
      

      if(tuplesInSC_LOG){
        for(var i =0; i< tuplesInSC_LOG.length; i++){    
          var status = tuplesInSC_LOG[i].TR_RSLTSTAT;
          //성공,실패 검사
          if(status == '06'){
            status = '성공'
            successCnt++;
          }else{
            status = '실패' + status;
            failCnt++;
          }
          //페이지 범위 안에 있는애만 detail추가를 해준다
          if((currentPageNum-1) * tuplePerPage <= i && currentPageNum * tuplePerPage > i){
            var date = this.getFormatDate(tuplesInSC_LOG[i].TR_SENDDATE);
            var phone = tuplesInSC_LOG[i].TR_PHONE;
            sendResult += this.detailForm(date, phone, status);
          }   
        }
      }

      sendResult = `
      <table class="table table-bordered" style="text-align: center;">
        <thead class="thead-light">
          <tr>
            <th scope="col">
              <input type="checkbox"  aria-label="Checkbox for following text input">
            </th>
            <th scope="col">발송일</th>
            <th scope="col">수신번호</th>
            <th scope="col">진행상황</th>
          </tr>
        </thead>
        <tbody>
          ${sendResult}
          <tr>
            <th scope="row">@</th>
            <td>@</td>
            <td>@</td>
            <td>@</td>
          </tr>
        </tbody>
      </table>`;


      sendResult = `
      <nav aria-label="Page navigation example" class="sendResultNav">
        <ul class="pagination">
          <li class="page-item"><a class="page-link" href="/sendResult/detail/
          ?msgType=${msgType}&userSendIndex=${sendResultIndex}&thisDate=${thisDate}&detailType=all">전체:${allCnt}건</a></li>
          <li class="page-item"><a class="page-link" href="/sendResult/detail/
          ?msgType=${msgType}&userSendIndex=${sendResultIndex}&thisDate=${thisDate}&detailType=success">성공:${successCnt}건</a></li>
          <li class="page-item"><a class="page-link" href="/sendResult/detail/
          ?msgType=${msgType}&userSendIndex=${sendResultIndex}&thisDate=${thisDate}&detailType=loading">진행중:${loadingCnt}건</a></li>
          <li class="page-item"><a class="page-link" href="/sendResult/detail/
          ?msgType=${msgType}&userSendIndex=${sendResultIndex}&thisDate=${thisDate}&detailType=fail">실패:${failCnt}건</a></li>
        </ul>
      </nav>` + sendResult;

      var detailPageLinks = this.detailPageLinks(allCnt,msgType,currentPageNum,sendResultIndex,thisDate,tuplePerPage)
      sendResult += detailPageLinks;
      return sendResult;
    },
    sendResult:function(tuples) {

      var sendResult = ``;
      var date = new Date();
      

      for(var i =0; i< tuples.length; i++){
        var date = this.getFormatDate(tuples[i].TR_SENDDATE);
        var title = tuples[i].userSendTitle;
        var sendType = tuples[i].sendType;
        var cnt = tuples[i].userSendCnt;
        var sendResultIndex = tuples[i].userSendIndex;
        var currentYYYYMM = ((tuples[i].TR_SENDDATE).getFullYear()) *100 + (tuples[i].TR_SENDDATE).getMonth()+1;
        sendResult += this.standardForm(date, title, sendType, cnt, sendResultIndex,currentYYYYMM);
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
    standardForm: function(date, title, sendType, cnt, sendResultIndex, thisDate) {
      return `
      <tr>
      <th scope="col">
            <input type="checkbox"  aria-label="Checkbox for following text input">
      </th>
      <td><a href="/sendResult/detail/?msgType=sms&userSendIndex=${sendResultIndex}&thisDate=${thisDate}&detailType=all">상세보기</a></td>
      <td>${date}</td>
      <td>${title}</td>
      <td>${sendType}</td>
      <td>${cnt}</td>
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
    },
    
    detailPageLinks:function(resultLength,msgType, currentPageNum, sendResultIndex,thisDate,tuplePerPage) {

      var pageLength = parseInt(resultLength/tuplePerPage) + 1;

      var html = ``;
      var pageform = function(pageNum,pageCtrl) {
        return ` <li class="page-item"><a class="page-link" ${pageCtrl} href="/sendResult/detail/?msgType=${msgType}&pageNum=${pageNum}&userSendIndex=${sendResultIndex}&thisDate=${thisDate}&detailType=all">${pageNum}</a></li>`
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
      html += `
      <a title="처음" class="page-link" href="/sendResult/detail/?msgType=${msgType}&pageNum=${1}&userSendIndex=${sendResultIndex}&thisDate=${thisDate}&detailType=all" aria-label="Previous">
      <<
      </a>
      <a title="이전페이지" class="page-link" href="/sendResult/detail/?msgType=${msgType}&pageNum=${prevNum}&userSendIndex=${sendResultIndex}&thisDate=${thisDate}&detailType=all" aria-label="Previous">
      <
      </a>`

      var startPage = currentPageNum - 5;
      if(startPage < 1){
        startPage = 1;
      }
      //페이지 짧을때, 처음의 startPage조정
      if(pageLength - startPage < 6){
        startPage = 1;
        //사이드 이펙트로 생기는, 끝의 startPage조정
        if(pageLength - 1 >= 10){ //10이상이면 안괜찮아! -> 조정들어간다
          startPage = pageLength - 7 + 1;
        }
      }
      

      var endPage = currentPageNum +4;
      if(endPage>pageLength){
        endPage = pageLength;
      }
      //끝에 다가갈때 endPage조정
      if(endPage - startPage < 9){
        if(pageLength - endPage > 4){
          endPage = 10;
        }else{
          endPage = pageLength;
        }
        
      }

      for(var i = startPage; i<=endPage; i++){
        if(i == currentPageNum){
          html += pageform(i,'id="currentPageLink"')
        }else{
          html += pageform(i,'')
        } 
      }

      html += `
      <a title="다음페이지" class="page-link" href="/sendResult/detail/?msgType=${msgType}&pageNum=${nextNum}&userSendIndex=${sendResultIndex}&thisDate=${thisDate}&detailType=all" aria-label="Next">
      >
      </a>
      <a title="마지막" class="page-link" href="/sendResult/detail/?msgType=${msgType}&pageNum=${pageLength}&userSendIndex=${sendResultIndex}&thisDate=${thisDate}&detailType=all" aria-label="Next">
      >>
      </a>`

      var result = `<nav aria-label="Page navigation example" class="sendResultNav">
      <ul class="pagination">
        ${html}
        </ul>
      </nav>`

        return result;
      }
}
