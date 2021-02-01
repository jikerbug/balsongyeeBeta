module.exports = {
    
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
    msgContent:function(msg, subject, callback,sendDate){
      return `
      <div class="phone-section">
        <input type="text" class="form-control" value="${subject}"/>
        <div class="php-email-form">
          <textarea class="form-control" name="msg" id="msg" rows="16" style="width: 100%;"
            data-rule="required">${msg}</textarea>
        </div>
        <input type="text" class="form-control" value="발신번호 : ${callback}"/>
        <input type="text" class="form-control" value="발송일 : ${this.getFormatDate(sendDate)}"/>
      </div>
            `;
    },mmsContent:function (msg, subject, callback,sendDate,filePath) {

      console.log(filePath);
      return `
      <div class="phone-section">
        <input type="text" class="form-control" value="${subject}"/>
        <div class="php-email-form">
          <div id="contentBox">
            <img src="${filePath}" alt="전송사진" id="sendImg"/>
            <textarea class="form-control" name="msg" id="msg" rows="16" style="width: 100%;"
            data-rule="required">${msg}</textarea>
          </div>
        </div>
        <input type="text" class="form-control" value="발신번호 : ${callback}"/>
        <input type="text" class="form-control" value="발송일 : ${this.getFormatDate(sendDate)}"/>
      </div>
            `;
    }
}
