//--------------------전송----------------------//
var sendImg = new FormData();

$(function($) {
  $('.php-email-form .submitButton').on("click",function() {

    console.log(sendImg.get('file'));

    var sender = document.getElementById("sender").value;
    var pageType = document.getElementById("pageType").value;

    if(pageType == "smslms"){
      var msg = document.getElementById("msg").value;
    }else if(pageType == "mms"){
      var msg = document.getElementById("msgMms").value;
      if(sendImg.get('file')){
      }else{
        alert("사진을 첨부하지 않으셨습니다. 단문/장문 메뉴 이용바랍니다")
        return 0;
      }
      console.log($('#photoFile')[0].files[0]);
    }
    
    var passwd = document.getElementById("passwd").value;
    var subject = document.getElementById("msgSubject").value;
    var len = getTextLength(msg);


    var msgType;

    if(pageType == "mms"){
      msgType ="mms"
    }else if(parseInt(len)> 90){
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

    var this_form = $('.php-email-form');
    
    this_form.find('.sent-message').slideUp();
    this_form.find('.error-message').slideUp();
    this_form.find('.loading').slideDown();


    if(pageType=="mms"){
      //sendImg에다가 그냥 데이터 다 넣어버리자
      var data = new FormData()
      data.append('file', sendImg.get('file'));   
      data.append('phonenumList', JSON.stringify(resultInfo));
      data.append('sender', sender);
      data.append('msg', msg);
      data.append('passwd', passwd);
      data.append('msgType', msgType);
      data.append('subject', subject);
      data.append('sendCnt', sendCnt);
      $.ajax({
        type : "POST",
        url : "/sendMsg/processMms",
        data : data,
        processData: false,
        contentType: false,
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
      sendImg.remove();
    }else if(pageType=="smslms"){
      console.log("smslms발송")
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
    }
  });
});


//--------------------발송번호----------------------//
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

// 업로드한 파일이름을 추가
$(".custom-file-input").on("change", function() {
  var fileName = $(this).val().split("\\").pop();
  $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
});


//--------------------사진파일업로드----------------------//

const photoFile = document.getElementById('photoFile');
if(photoFile){ //그냥 sendMsg페이지의 경우에는 photoFile이 없기때문에, 없는 것에 등록하면 코드가 뻑이 난다
  photoFile.addEventListener('change', event => { 
    readphoto(event.target);
  });  
}

function readphoto(input) {
  
  if(input.files[0]){ //변경한 파일이 존재할때만!
    var src = URL.createObjectURL(input.files[0]);
    $( "#sendImg" ).remove();
    $('#contentBox').prepend(`<img src="${src}" alt="전송사진" id="sendImg" onclick="deletephoto()" 
    onmouseover="$(this).fadeTo(100, 0.5)" onmouseout="$(this).fadeTo(100, 1.0);"/>`);

    sendImg = new FormData();

    var files = $('#photoFile')[0].files[0];
    sendImg.append('file',files);
    console.log(sendImg.get('file'));;
  }
}

function deletephoto(){
  if(confirm("사진을 삭제하시겠습니까?")){
    $( "#sendImg" ).remove();
    document.getElementById("photoFile").value = "";
    sendImg.delete('file');
  }
}



function addPhotoFromPhotoList(obj){
  var src;
  var fileName;
  var choice = obj.getAttribute('id');

  
  switch (choice) {
    case 'sendImg1': src = 'assets/img/voteImg/1.jpg';fileName = '1.jpg';break;
    case 'sendImg2': src = 'assets/img/voteImg/2.jpg';fileName = '2.jpg';break;
    case 'sendImg3': src = 'assets/img/voteImg/3.jpg';fileName = '3.jpg';break;
    case 'sendImg4': src = 'assets/img/voteImg/4.jpg';fileName = '4.jpg';break;
  }  

  $('html,body').animate({scrollTop:100}, 'slow');
  $( "#sendImg" ).remove();
  $('#contentBox').prepend(`<img src="${src}" alt="전송사진" id="sendImg" onclick="deletephoto()" 
  onmouseover="$(this).fadeTo(100, 0.5)" onmouseout="$(this).fadeTo(100, 1.0);"/>`);

  //파일 객체에 담는 로직 추가!

  fetch(src)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.blob();
  })
  .then(myBlob => {
    sendImg = new FormData();
    //서버에서 blob으로 받은 파일을 fileObject로 변경
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    var file = new File([myBlob], fileName);
    sendImg.append('file', file)
    console.log(sendImg.get('file'))
    
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
  });
}




//--------------------엑셀파일업로드----------------------//


const excelFile = document.getElementById('excelFile');
excelFile.addEventListener('change', event => {
  readExcel(event.target);
  console.log("read Excel")
});



function readExcel(input) {
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



