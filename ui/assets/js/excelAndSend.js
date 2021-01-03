$(function($) {

  $('form.php-email-form').on("submit",function() {

    var sender = document.getElementById("sender").value;
    var msg = document.getElementById("msg").value;
    var passwd = document.getElementById("passwd").value;

    var resultInfo = new Array();
    var listInfo = $('#phonenumList').find('option').map(function() {return $(this).val();}).get();
    resultInfo.push(listInfo);
    resultInfo.push(sendInfo);

    var  ferror = false;
    if (ferror) return false;
    else var str = $(this).serialize();

    var this_form = $(this);
    
    this_form.find('.sent-message').slideUp();
    this_form.find('.error-message').slideUp();
    this_form.find('.loading').slideDown();

    $.ajax({
      type: "POST",
      url: "/sendMsg/processOld",
      data : {
      "phonenumList" : JSON.stringify(resultInfo),
      "sender" : sender,
      "msg" : msg,
      "passwd" : passwd  
      },
      success: function(msg) {
        if (msg == 'OK') {
          this_form.find('.loading').slideUp();
          this_form.find('.sent-message').slideDown();
          this_form.find("input:not(input[type=submit]), textarea").val('');
        } else {
          this_form.find('.loading').slideUp();
          this_form.find('.error-message').slideDown().html(msg);
        }
      }
    });

    
    
    return false;
  });

});



var sendInfo = new Array(); 
var id_key = 0;

function showInfo(){
  var sel = document.getElementById("phonenumList");
  var id = sel.options[sel.selectedIndex].id;

  var showInfo = document.getElementById("showInfo").innerHTML

  if(showInfo == "세부정보"){

    $('#infoList').children('option').remove();
    for(var i =0; i < sendInfo[id].length;i++){     
      $('#infoList').append('<option value="'+ sendInfo[id][i] +'">'+ sendInfo[id][i] +'</option>');
    }
    $('#infoList').css("display","");
    document.getElementById("showInfo").innerHTML = "숨기기"

  }else{
    $('#infoList').css("display","none");
    document.getElementById("showInfo").innerHTML = "세부정보"
  }
  
  
  

}

function readExcel() {
  
  let input = event.target;
  let reader = new FileReader();
  reader.onload = function () {
      let data = reader.result;
      let workBook = XLSX.read(data, { type: 'binary' });
      var excelGroup = new Array();
      workBook.SheetNames.forEach(function (sheetName) {
          console.log('SheetName: ' + sheetName);
          let rows = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName], {header:['zeroCol','oneCol']});
          //이 형식 또는 그냥 전화번호만 있는 형식으로 받기
          
          console.log(rows);
          var count = rows.length;
          var validCnt = 0;

          let keyheader = Object.keys(rows[0]);
          console.log(keyheader);
          var isOnlyPhoneNum =false;
          if(keyheader.length == 1){
            isOnlyPhoneNum = true;
          }
          
          if(isOnlyPhoneNum){
            console.log(1);
            for(var i=0;i<count;i++){
              let values = Object.values(rows[i]);
              if(Number.isInteger(parseInt(values[0]))){
                  validCnt++;
                  excelGroup.push(values);
              }
            }

          }else{
            console.log(2);
            for(var i=0;i<count;i++){
              let values = Object.values(rows[i]);
              if(Number.isInteger(parseInt(values[1]))){
                  validCnt++;
                  excelGroup.push(values);
              }
            }

          }

          console.log(rows)
          sendInfo.push(excelGroup);
        
          alert("전체: " + count + "건\n잘못된 번호: "+ (count - validCnt) + "건\n발송가능한 번호: " + validCnt+"건");

          var info = "엑셀파일" + validCnt + "명";
          $('#phonenumList').append('<option id=' +id_key+ ' value="'+ info +'">'+ info +'</option>');
          id_key++;
          

          console.log(sendInfo);
       
          
      })
      
  };
  reader.readAsBinaryString(input.files[0]);
}