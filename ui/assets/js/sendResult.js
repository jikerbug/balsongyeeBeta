
$(function () {
  $.ajax({
    type : "get",
    url : `/sendResult/getResultList`,
    dataType: 'json',
    success: function(resultList) {
      resultGrid(resultList);
    }
  });
  
});

function resultGrid(resultList) {

  $('#resultGrid').w2grid({
    name: 'resultGrid',
    header: 'List of Names',
    style: 'font-size:16px;text-align:center',
    show : {
        toolbar:true, 
        footer:true,
        selectColumn:true
    }, 
    multiSearch:false,
    multiSelect : true,
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
    ],
    records:resultList
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


function removeResult(){
  var selectionList = w2ui['resultGrid'].getSelection();
  //selection은 recid로 리턴한다!!

  console.log(selectionList);

  if(!selectionList.length){
    alert('삭제할 발송결과를 선택해주세요');
    return;
  }
  if(confirm(`전송이 완료되지 않은 문자가 포함될경우 전송이 취소됩니다. 삭제하시겠습니까?`)){
    /////address삭제시 ON DELETE CASCADE에의해, addressDetail에 등록되었던 튜플 전부삭제된다
    w2ui.resultGrid.delete(this);
    $.ajax({
      type: "POST",
      url: "/sendResult/deleteResult",
      data : {
        "selectionList": selectionList
      },
      success: function(msg) {
        if (msg == 'OK') {
          alert('삭제가 완료되었습니다.');
        } else {
          alert(msg);
        }
      }
    });
  }
}
