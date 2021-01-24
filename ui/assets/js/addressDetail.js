
function removeGroup() {
  w2ui.groupPhonenumListGrid.delete(true);
}

function addGroup() {
  var g = w2ui['grid'].records.length;
  w2ui['grid'].add( { recid: g + 1, groupName: 'Jin', count: 'Franson'} );
}



$(function () {
  groupList = localStorage.getItem('excelGroup');
  groupList = JSON.parse(groupList);

  numberWithNameGrid(groupList)
  groupPhonenumListGrid([])
  
  
});

function groupPhonenumListGrid(groupList) {
  $('#groupPhonenumListGrid').w2grid({
    name: 'groupGrid',
    header: 'List of Names',
    style: 'font-size:16px',
    show : {
        toolbar:true, 
        footer:true
    }, 
    multiSearch:false,
    searches : [
      { field:"phonenum",  caption:"전화번호", type:"text"},
      { field:"name", caption:"이름", type:"text" }
  ],
    columns: [
      { field: 'phonenum', caption: '전화번호', size: '30%' },
      { field: 'name', caption: '이름', size: '30%' },
    ],
    records: groupList
});
}

function numberWithNameGrid(groupList) {
  $('#grid').w2grid({
    name: 'grid',
    header: 'List of Names',
    show : {
        toolbar:true, 
        footer:true
    }, 
    multiSearch:false,
    searches : [
      { field:"phonenum",  caption:"전화번호", type:"text"},
      { field:"name", caption:"이름", type:"text" }
  ],
    columns: [
      { field: 'phonenum', caption: '전화번호', size: '30%' },
      { field: 'name', caption: '이름', size: '30%' },
    ],
    records: groupList
});
}


//-----------------일반 입력---------------------------//

function isPhonenumValid(phonenum) {
  //전화번호 형식인지 체크 //직접입력, 텍스트 입력시 쓸것!
  phonenum = phonenum.replace(/[-]/g,"");
  var regPhone = /^(01[016789]{1})[0-9]{3,4}[0-9]{4}$/;
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
var sendInfo = new Array(); 
var id_key = 0;

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
      var excelGroup = new Array();
      var gridListGroup = new Array();
      workBook.SheetNames.forEach(function (sheetName) {
          console.log('SheetName: ' + sheetName);
          let rows = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName], {header:['zeroCol','oneCol']});
          //이 형식 또는 그냥 전화번호만 있는 형식으로 받기
          
          //console.log(rows);
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
            var validCnt = onlyPhonenumExcelCnt(setCnt, rows, excelGroup, gridListGroup);
            setCnt = count;
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
            var validCnt = phonenumWithNameExcelCnt(setCnt, rows, excelGroup, gridListGroup, phonenumIdx)
          }
          console.log(rows)
          sendInfo.push(excelGroup);
        
          alert(`전체: ${count}건\n발송가능한 번호: ${validCnt}건\n잘못된 번호: ${setCnt - validCnt}건\n중복된 번호: ${duplicatedCnt}건`);

          localStorage.setItem("excelGroup",JSON.stringify(gridListGroup));

          var info = "엑셀파일" + validCnt + "명";
          $('#phonenumList').append('<option id=' +id_key+ ' value="'+ info +'">'+ info +'</option>');
          id_key++;
          console.log(sendInfo);

          if(confirm('불러온 명단을 확인하시겠습니까?')){
            showPopup();
          }
      });
  };
  reader.readAsBinaryString(input.files[0]);
}

function onlyPhonenumExcelCnt(count, rows, excelGroup, gridListGroup) {
  var validCnt = 0;
  localStorage.setItem("groupType","number");
  var phonenum;
  for(var i=0;i<count;i++){
    let values = Object.values(rows[i]);
    phonenum = phonenumFormattingExcel(values[0]);
   
    if(phonenum){
      validCnt++;
      excelGroup.push(phonenum);  
      gridListGroup.push({ recid: i+1, phonenum: phonenum})
    }else{
      gridListGroup.push({ recid: i+1, phonenum: "잘못된번호:" + values[0],w2ui: {style:"background-color:#FF99CC;"}})
    }
  }
  return validCnt;
}

function phonenumWithNameExcelCnt(count, rows, excelGroup, gridListGroup, phonenumIdx) {
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
      excelGroup.push(phonenum);  
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
  console.log(phonenum)
  if(phonenum.length== 10 && phonenum.charAt(0) == '1'){
    return '0'+phonenum;
  }else if(phonenum.length==11 && phonenum.charAt(0) == '0' && phonenum.charAt(1) == '1'){
    return phonenum;
  }else{
    return null;
  }
}





/*-----------------------------------엑셀&텍스트 - 폰목록 보여주기-----------------------------------*/

function showPopup() 
{           
  try { 
    window.open("assets/w2ui/gridPopup.html", "a", "width=500, height=405, left=100, top=50").focus();  
  } catch(e){
    alert( "팝업차단 설정을 풀어주세요." ); 
  }
  
}

function showInfo(){
  var sel = document.getElementById("phonenumList");
  var id = sel.options[sel.selectedIndex].id;

  var showInfo = document.getElementById("showInfo").innerHTML
  var gridListGroup = new Array();
  if(showInfo == "명단확인"){

    $('#infoList').children('option').remove();
    for(var i =0; i < sendInfo[id].length;i++){     
      gridListGroup.push({ recid: i+1, phonenum: sendInfo[id][i]})
    }
    localStorage.setItem("excelGroup",JSON.stringify(gridListGroup));
    showPopup();

  }else{
    $('#infoList').css("display","none");
    document.getElementById("showInfo").innerHTML = "명단확인"
  }
}


