$(function($) {

  $('form.php-email-form').on("submit",function() {

    var sender = document.getElementById("sender").value;
    var msg = document.getElementById("msg").value;
    var passwd = document.getElementById("passwd").value;
    var subject = document.getElementById("msgSubject").value;
    var text = document.getElementById("msg").value;
    var len = getTextLength(text);
    var msgType;

    if(parseInt(len)> 90){
      msgType = "lms";
    }else{
      msgType = "sms";
    }

    var resultInfo = new Array();
    var listInfo = $('#phonenumList').find('option').map(function() {
      if(this.id == ""){
        return $(this).val();
      } 
    }).get();
    resultInfo.push(listInfo);



    var fileInfo = $('#phonenumList').find('option').map(function() {
      if(this.id != ""){
        return sendInfo[this.id]; //하나의 list로 합쳐지는 이유는 map의 특성때문인듯
        //$(this).val()는 그냥 값이라 값째로 리스트에 들어가고
        //sendInfo[this.id]는 리스트라서 그 리스트안의 원소들이 하나의 리스트로 들어간다
      }  
    }).get();


    //----------------------잔여 코인 여부확인--------------------------///
    // 잔여 코인을 value값을 통해 프론트엔드에서 확인하면, html값 조작을 통해 가짜로 처리할 수 있게된다! 절대금지!!
    //----------------------잔여 코인 여부확인--------------------------///


    //이제 resultInfo는 리스트에 있는 번호랑, 파일에 있는 번호를 모두 포함한다!
    var sendCnt = fileInfo.length + listInfo.length;
    resultInfo.push(fileInfo);
    

    console.log(resultInfo[0]);
    console.log(resultInfo[1]);



    var  ferror = false;
    if (ferror) return false;
    else var str = $(this).serialize();

    var this_form = $(this);
    
    this_form.find('.sent-message').slideUp();
    this_form.find('.error-message').slideUp();
    this_form.find('.loading').slideDown();

    $.ajax({
      type: "POST",
      url: "/sendMsg/process",
      data : {
      "phonenumList" : JSON.stringify(resultInfo),
      "sender" : sender,
      "msg" : msg,
      "passwd" : passwd,
      "msgType": msgType,
      "subject": subject,
      "sendCnt": sendCnt
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

  if(showInfo == "명단확인"){

    $('#infoList').children('option').remove();
    for(var i =0; i < sendInfo[id].length;i++){     
      $('#infoList').append('<option value="'+ sendInfo[id][i] +'">'+ sendInfo[id][i] +'</option>');
    }
    $('#infoList').css("display","");
    document.getElementById("showInfo").innerHTML = "숨기기"

  }else{
    $('#infoList').css("display","none");
    document.getElementById("showInfo").innerHTML = "명단확인"
  }

}

$(".custom-file-input").on("change", function() {
  var fileName = $(this).val().split("\\").pop();
  $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
});

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