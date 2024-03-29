

//-----------------일반 입력---------------------------//

function isPhonenumValid(phonenum) {
  //전화번호 형식인지 체크 //직접입력, 텍스트 입력시 쓸것!
  phonenum = phonenum.replace(/[-]/g,"");
  var regPhone = /^(01[016789]{1})[0-9]{4}[0-9]{4}$/;
  //var regPhone = /^(01[016789]{1}|070)[0-9]{3,4}[0-9]{4}$/;
  if( regPhone.test($.trim(phonenum)) ) {
    return phonenum;
  } else {
    return null;
  }
}

function addPhonenum(){
  var phonenum = document.getElementById("name").value;
  phonenum = isPhonenumValid(phonenum);
  if(phonenum){
    var listInfo = $('#phonenumList').find('option').map(function() {
      if(this.id == ""){
        return $(this).val();
      } 
    }).get();
    var isUniq = true;
    for(var i = 0; i< listInfo.length;i++){
      if(listInfo[i] == phonenum){
        alert('중복된 번호입니다');
        isUniq = false;
        return;
      }
    }
    if(isUniq){
      $('#phonenumList').append('<option value="'+ phonenum +'">'+ phonenum +'</option>');
    }
  }else{
    //TODO : 이름 있으면 추가로직 필요
    alert('전화번호 형식이 올바르지 않습니다.')
  }
}
function deletePhonenum(){
  var sel = document.getElementById("phonenumList");
  var val = sel.options[sel.selectedIndex].value;
  $("#phonenumList option[value='"+val+"']").remove();
}

function deleteAll(){
  $('#phonenumList').children('option').remove();
}



//--------------------전송----------------------//
var sendImg = new FormData();
var sendInfo = new Array(); //파일을 그룹별로 모아놓아서 그룹별로 손쉽게 삭제할 수 있도록 하기위함 -> 전송할때는 resultInfo로, 하나로 다 합쳐줌
//일반 입력은 전송할때, html에서 직접 불러옴(listInfo)
var sendAddressGroup = new Array(); //그룹 idx, 인원수 모아놓는 배열
var id_key = 0; //엑셀파일 식별하는데에 사용

function isSenderValid(sender) {
  //전화번호 형식인지 체크 
  sender = sender.replace(/[-]/g,"");
  var regPhone = /^(01[016789]{1}|070|02|0[3-9]{1}[0-9]{1})[0-9]{3,4}[0-9]{4}$/;
  //var regPhone = /^(01[016789]{1}|070)[0-9]{3,4}[0-9]{4}$/;
  if( regPhone.test($.trim(sender)) ) {
    return true;
  } else {
    return false;
  }
}


$(function($) {
  $('.php-email-form .submitButton').on("click",function() {

    //------------------------엑셀파일끼리 중복제거는 서버에서 진행!!------------//
    var sendlen = document.getElementById("phonenumList").length;
    if(sendlen == 0){
      alert('발송할 번호를 추가해주세요');
      return;
    }

    console.log(sendAddressGroup);
    //console.log(sendImg.get('file'));

    //페이지타입
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

    //잔챙이들
    var sender = document.getElementById("sender").value;
    if(!isSenderValid(sender)){
      alert('발신번호 형식이 올바르지 않습니다.');
      return;
    }
    var passwd = document.getElementById("passwd").value;
    var subject = document.getElementById("msgSubject").value;
    if(!subject){
      subject = '제목없음';
    }

    //예약발송
    var isReserveSend = document.getElementById("reserveSend").checked;
    var reservedDate = document.getElementById("reservedData").value;
    console.log(reservedDate);
    if(isReserveSend){
      if(!reservedDate){
        alert("날짜를 지정해주세요");
        return;
      }
    }else{
      //체크를 안했으면 값을 보내면 안된다
      reservedDate= "";
    }

    //분할발송
    var isSplitSend = document.getElementById("splitSend").checked;
    var splitMinutes = document.getElementById("splitMinutes").value;
    var countPerSplit = document.getElementById("countPerSplit").value;

    console.log(splitMinutes);
    console.log(countPerSplit);
    if(isSplitSend){
      if(!splitMinutes && !countPerSplit){
        alert('발송 간격과 간격당 건수를 입력해주세요');
        return;
      }else if(!splitMinutes){
        alert('발송 간격을 입력해주세요');
        return;
      }else if(!countPerSplit){
        alert('발송 간격당 건수를 입력해주세요');
        return;
      }
      console.log(!Number.isInteger(+splitMinutes));
      //string을 parseInt후에 isInterger하면 동작 안한다! 타입 분기할땐 +붙이기!
      if(!Number.isInteger(+splitMinutes) || !Number.isInteger(+countPerSplit)){
        alert('분할발송에는 숫자만 입력해주세요');
        return;
      }else{
        if(+splitMinutes>120){
          alert('발송 간격은 120분 이하로만 입력해주세요');
          return;
        }
        if(+countPerSplit>10000){
          alert('발송 건수는 1만 건 이하로만 입력해주세요');
          return;
        }
      }
    }else{
      splitMinutes = "";
      countPerSplit = "";
    }


    //메세지 타입 구하기
    var len = getTextLength(msg);
    var msgType;

    if(pageType == "mms"){
      msgType ="mms"
    }else if(parseInt(len)> 90){
      msgType = "lms";
    }else{
      msgType = "sms";
    }


    //전화번호 목록(파일 목록부터)
    var resultInfo = $('#phonenumList').find('option').map(function() {
      if(this.id != ""){
        return sendInfo[this.id]; //하나의 list로 합쳐지는 이유는 map의 특성때문인듯
        //$(this).val()는 그냥 값이라 값째로 리스트에 들어가고
        //sendInfo[this.id]는 리스트라서 그 리스트안의 원소들이 하나의 리스트로 들어간다
      }  
    }).get();

    ///전화번호 목록(일반등록)
    var listInfo = $('#phonenumList').find('option').map(function() {
      if(this.id == ""){
        return $(this).val();
      } 
    }).get();
    console.log('console.log(listInfo);');
    console.log(listInfo);
    for(var i=0;i<listInfo.length;i++){
      //TODO : 이름 있을경우 처리하는 동작
      resultInfo.push(listInfo[i]);
    }
    console.log(resultInfo);

    var sendCnt = resultInfo.length;


    //----------------------잔여 코인 여부확인--------------------------///
    // 잔여 코인을 value값을 통해 프론트엔드에서 확인하면, html값 조작을 통해 가짜로 처리할 수 있게된다! 절대금지!!
    //----------------------잔여 코인 여부확인--------------------------///
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
      data.append('reservedDate', reservedDate);
      data.append('splitMinutes', splitMinutes);
      data.append('countPerSplit', countPerSplit);
      data.append('sendAddressGroup', JSON.stringify(sendAddressGroup));
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
        "sendCnt": sendCnt,
        'reservedDate': reservedDate,
        'splitMinutes': splitMinutes,
        'countPerSplit':countPerSplit,
        'sendAddressGroup':JSON.stringify(sendAddressGroup)
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

// 업로드한 파일이름을 추가
$(".custom-file-input").on("change", function() {
  var fileName = $(this).val().split("\\").pop();
  $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
});


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
      
      workBook.SheetNames.forEach(function (sheetName) {
        console.log('SheetName: ' + sheetName);
        let rows = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName], {header:['zeroCol','oneCol']});
        //이 형식 또는 그냥 전화번호만 있는 형식으로 받기
        
        //console.log(rows);
        fileProcess(rows, 'excel');
      });
  };
  reader.readAsBinaryString(input.files[0]);
}

function fileProcess(rows, fileType) {
  var fileGroup = new Array(); 
  var gridListGroup = new Array();
  var count = rows.length;
  if(count>50000){
    alert('50000건이 넘는 파일은 불러올 수 없습니다.')
    return;
  }
  if(count > 10000){
    alert('10000건 이상 불러올 경우 로딩이 길어질 수 있습니다. 잠시만 기다려주세요')
  }

  //중복은 set사용해서 제거하자
  //스팸제거도 가능할지?...
  var spamCnt = 0;

  let keyheader = Object.keys(rows[0]);
  if(keyheader.length == 1){
    //폰번호만 있을때
    // rows = Array.from( 
    //   rows.reduce((m, t) => m.set(t.zeroCol, t), new Map()).values()
    // );
    var setCnt = rows.length;
    var duplicatedCnt = count - setCnt;
    var validCnt = onlyPhonenumExcelCnt(setCnt, rows, fileGroup, gridListGroup);
    setCnt = count;//이건 주석처리 해야 중복제거 제대로 가능!
  }else if(keyheader.length == 2){
    //이름, 폰번호가 있을때
    //우선 이름-번호인지 번호-이름인지 체크
    var testValues;
    var phonenumIdx;
    for(var i = 0; i< rows.length;i++){
      testValues = Object.values(rows[i]);
      if(phonenumFormattingExcel(testValues[0])){
        phonenumIdx = 0;
        break;
      }else if(phonenumFormattingExcel(testValues[1])){
        phonenumIdx = 1;
        break;
      }
    }
    if(phonenumIdx == 0){
      rows = Array.from( 
        rows.reduce((m, t) => m.set(t.zeroCol, t), new Map()).values()
      );
    }else if(phonenumIdx == 1){
      rows = Array.from( 
        rows.reduce((m, t) => m.set(t.oneCol, t), new Map()).values()
      );
    }
    var setCnt = rows.length;
    var duplicatedCnt = count - setCnt;
    var validCnt = phonenumWithNameExcelCnt(setCnt, rows, fileGroup, gridListGroup, phonenumIdx)
  }
  sendInfo.push(fileGroup);

  alert(`전체: ${count}건\n발송가능한 번호: ${validCnt}건\n잘못된 번호: ${setCnt - validCnt}건\n중복된 번호: ${duplicatedCnt}건`);

  localStorage.setItem("fileGroup",JSON.stringify(gridListGroup));

  var info = "엑셀파일" + validCnt + "명";
  if(fileType == 'text'){
    info = "텍스트파일" + validCnt + "명";
  }
  $('#phonenumList').append('<option id=' +id_key+ ' value="'+ info +'">'+ info +'</option>');
  id_key++;
  //console.log(sendInfo);

  if(confirm('불러온 명단을 확인하시겠습니까?')){
    showPopup();
  }
  
}

function onlyPhonenumExcelCnt(count, rows, fileGroup, gridListGroup) {
  var validCnt = 0;
  localStorage.setItem("groupType","number");
  var phonenum;
  for(var i=0;i<count;i++){
    let values = Object.values(rows[i]);
    phonenum = phonenumFormattingExcel(values[0]);
   
    if(phonenum){
      validCnt++;
      fileGroup.push(phonenum);  
      gridListGroup.push({ recid: i+1, phonenum: phonenum})
    }else{
      gridListGroup.push({ recid: i+1, phonenum: "잘못된번호:" + values[0], w2ui: {style:"background-color:#FF99CC;"}})
    }
  }
  return validCnt;
}

function phonenumWithNameExcelCnt(count, rows, fileGroup, gridListGroup, phonenumIdx) {
  var validCnt = 0;
  localStorage.setItem("groupType","numberWithName");

  var nameIdx;
  if(phonenumIdx == 1){
    nameIdx = 0;
  }else{
    nameIdx = 1;
  }
 

  var phonenum;
  for(var i=0;i<count;i++){
    let values = Object.values(rows[i]);
    phonenum = phonenumFormattingExcel(values[phonenumIdx]);
    if(phonenum){
      validCnt++;
      fileGroup.push(phonenum);  
      gridListGroup.push({ recid: i+1, phonenum: phonenum, name: values[nameIdx]})
    }else{
      gridListGroup.push({ recid: i+1, phonenum: "잘못된번호:" + values[phonenumIdx]
      , name:values[nameIdx], w2ui: {style:"background-color:#FF99CC;"}})
    }
  }
  return validCnt;
}


function phonenumFormattingExcel(phonenum){

  //엑셀전용
  if(Number.isInteger(phonenum)){
    phonenum = phonenum.toString()
  }
  
  //1012341234형식으로 통일! -> 서버에서 0붙여주기 & grid에서도 0붙여준다
  //앞자리가 1로 시작하기만 하면된다!!
  //시간 좀 줄이기 위해 정규식은 패스 & 오타도 바로잡아준다 ex) .01071891476
  phonenum = phonenum.replace(/[^0-9]/g,"");
  //console.log(phonenum)
  if(phonenum.length== 10 && phonenum.charAt(0) == '1'){
    return '0'+phonenum;
  }else if(phonenum.length==11 && phonenum.charAt(0) == '0' && phonenum.charAt(1) == '1'){
    return phonenum;
  }else{
    return null;
  }
}

/*-----------------------------------텍스트 파일 가져오기-----------------------------------*/

const textFile = document.getElementById('textFile');
textFile.addEventListener('change', event => {
  readText(event.target);
  console.log("read Text");
});

function readText(input) {
  var file = input.files[0];

  var reader = new FileReader();
  reader.onload = function () {
      var output = reader.result;
      output = output.replace(/ +(?= )/g,''); //여러개의 공백이 있다면, 하나의 공백으로 바꿔준다
      const allLines = output.split(/\r\n|\n/);
      // Reading line by line

      var rows = [];
      var row;
      var rowList;
      var zeroCol;
      var oneCol;
      allLines.forEach((line) => {
        rowList = line.split(' ');
        zeroCol =rowList[0];
        if(rowList[1]){
          oneCol = rowList[1];
        }else{
          oneCol = '';
        }
        row = {'zeroCol':zeroCol,'oneCol':oneCol}
        rows.push(row);
      });
      console.log(rows);
      fileProcess(rows,'text');
  };
  reader.readAsText(file, /* optional */ "utf-8");
}

/*-----------------------------------엑셀&텍스트 - 폰목록 보여주기-----------------------------------*/
localStorage.removeItem('fileGroup'); 
//새로고침하면 지워주기

function showPopup() 
{           
  try { 
    window.open("assets/w2ui/gridPopup.html", "a", "width=500, height=405, left=100, top=50").focus();  
  } catch(e){
    alert( "팝업차단 설정을 풀어주세요." ); 
  }
}

function showPopupAddressDetail() 
{           
  try { 
    window.open("assets/w2ui/gridPopupAddressDetail.html", "a", "width=500, height=405, left=100, top=50").focus();  
  } catch(e){
    alert( "팝업차단 설정을 풀어주세요." ); 
  }
}

function showInfo(){
  var sel = document.getElementById("phonenumList");
  var id = sel.options[sel.selectedIndex].id;

  var gridListGroup = new Array();

  if(Number.isInteger(+id)){
    for(var i =0; i < sendInfo[id].length;i++){     
      gridListGroup.push({ recid: i+1, phonenum: sendInfo[id][i]})
    }
    localStorage.setItem("fileGroup",JSON.stringify(gridListGroup));
    showPopup();
  }else{
    var groupIdxUrl = id.split('-')[0];
    console.log(groupIdxUrl);
    localStorage.setItem("groupIdxUrl",groupIdxUrl);
    showPopupAddressDetail();
  }
}


/*-----------------------------grid관련-----------------------*/

function showAddress() {
  document.getElementById('groupGrid').style.display = "";
}


$('#groupGrid').w2grid({
  name: 'groupGrid',
  url  : '/address/getGroups',
  header: 'List of Names',
  style: 'font-size:16px',
  show : {
      toolbar:true, 
      footer:true
  }, 
  multiSearch:false,
  searches : [
    { field:"groupName",  caption:"그룹명", type:"text"},
    { field:"count", caption:"인원수", type:"text" }
  ],
  columns: [
    { field: 'groupName', caption: '그룹명', size: '60%' },
    { field: 'count', caption: '인원수', size: '40%' },
  ]
});

w2ui.groupGrid.on('click', function(event) {
  event.onComplete = function () {
      var selection = w2ui['groupGrid'].getSelection();//언제나 하나만 리턴한다.리스트로 받을 걱정 ㄴㄴ
      selection = Number.parseInt(selection[0]);
      if(selection){ 
        var record = w2ui['groupGrid'].get(selection);
        
        if(confirm(`${record.groupName}의 전화번호목록을 가져오시겠습니까?`)){
          if(record.count > 0){
            var info = `${record.groupName} 그룹 ${record.count}명`;
            $('#phonenumList').append(`<option id="${record.recid}-${record.groupName}" value="${info}">${info}</option>`);
            sendAddressGroup.push({groupIdx:record.recid, count:record.count});
            console.log(sendAddressGroup);
          }else{
            alert('가져올 전화번호가 없습니다.')
          }
          
        }
      
      }
      
  }
});


