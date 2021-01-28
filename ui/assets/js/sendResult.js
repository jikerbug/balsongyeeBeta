$(function () {
  resultGrid();
});

function resultGrid() {

  $('#resultGrid').w2grid({
    name: 'resultGrid',
    url  : `/sendResult/getResultList`,
    header: 'List of Names',
    style: 'font-size:16px;text-align:center',
    show : {
        toolbar:true, 
        footer:true
    }, 
    multiSearch:false,
    searches : [
      { field:"sendDate", caption:"발송일", type:"text" },
      { field:"msg", caption:"메세지 내용", type:"text" },
      { field:"sendType", caption:"유형", type:"text" },
      { field:"count", caption:"발송건수", type:"text" },
    ],
    columns: [
      { field:"sendDate", caption:"발송일", size: '20%'},
      { field:"msg", caption:"메세지 내용", size: '30%'},
      { field:"sendType", caption:"유형", size: '20%'},
      { field:"count", caption:"발송건수", size: '20%'},
    ]
  });
}

function userSendIndexCheck() {
  var selection = w2ui['resultGrid'].getSelection()
  selection = Number.parseInt(selection[0])
  
  if(selection){
    var record = w2ui['resultGrid'].get(selection);
    var userSendIndex = record.recid;
    var sendDate = record.sendDate;
    var msgType = 'sms';
    userSendIndex = userSendIndex.toString();
    document.getElementById("userSendIndex").value = userSendIndex;
    document.getElementById("msgType").value = msgType;
    document.getElementById("sendDate").value = sendDate;
    
    return true;
  }else{
    alert('발송결과를 선택해주세요')
    return false;
  }
}
