$(function () {
  
  //userId는 세션데이터에서 꺼내쓰면 된다!
  //sendType에 따라 다르게 보여주는 것은 mms에서만 필요하겠네...! var sendType;
  var userSendIndex = document.getElementById('userSendIndex').value;
  var sendYYYYMM = document.getElementById('sendYYYYMM').value;
  var msgType = document.getElementById('msgType').value;

  $.ajax({
    type : "get",
    url : `/sendResult/getResultDetailList?userSendIndex=${userSendIndex}&sendYYYYMM=${sendYYYYMM}&msgType=${msgType}`,
    dataType: 'json',
    success: function(resultDetailList) {
      resultGrid(resultDetailList);
    }
  });
  
});

function resultGrid(resultDetailList) {

  $('#resultGrid').w2grid({
    name: 'resultGrid',
    header: 'List of Names',
    style: 'font-size:16px',
    show : {
        toolbar:true, 
        footer:true,
    }, 
    multiSearch:false,
    searches : [
      { field:"status", caption:"진행상황", type:"text" },
      { field:"phonenum", caption:"수신번호", type:"text" },
    ],
    columns: [
      { field:"status", caption:"진행상황", size: '50%'},
      { field:"phonenum", caption:"수신번호", size: '50%'},
    ],
    records:resultDetailList
  });
}
