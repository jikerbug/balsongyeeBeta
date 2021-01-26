
var wrongNumList = [];
//파일을 넘겨줘서 입력해야 중복이 적다. setList는 그냥 중복 몇개인지 확인용이고
//어차피 db에서 중복처리 해줄것이다! (primaryKey니까);
var fileGridList;

///!!!!!!!!!!!!!!!!!!!!!!!!!request entity too large 때문에 ajax후 refresh로 구현하기로 하자!

$("#btn-addfileList").on('click', (function(e) {
	e.preventDefault();
  if(!phonenumListCheck()) return;
  
  document.getElementById("phonenumList").value = JSON.stringify(fileGridList)
	$('#addfileList')[0].submit();
  })
);

function phonenumListCheck() {

  fileGridList = w2ui['fileGrid'].records;
  var groupGridList = w2ui['groupGrid'].records;

  mergedList = groupGridList.concat(fileGridList);
  setList = Array.from(
    mergedList.reduce((m, t) => m.set(t.phonenum, t), new Map()).values()
  );

  var fileCnt = fileGridList.length;
  var mergedCnt = mergedList.length;
  var setCnt = setList.length;
  var duplicatedCnt = mergedCnt - setCnt;
  var validCnt = fileCnt-duplicatedCnt;

  if(confirm(`전체: ${fileCnt}건\n등록 가능한 번호: ${validCnt}건\n그룹과 중복된 번호: ${
    duplicatedCnt}건\n그룹에 번호를 등록하시겠습니까?`)){
    return true;
  }else{
    return false;
  }

}

function directPhonenumCheck() {
  var phonenum = document.getElementById('phonenum').value;
  var regPhone = /^(01[016789]{1})[0-9]{4}[0-9]{4}$/;
  //var regPhone = /^(01[016789]{1}|070)[0-9]{4}[0-9]{4}$/;
  if( regPhone.test(phonenum)) {
    return true;
  } else {
    alert('전화번호 형식이 올바르지 않습니다.')
    return false;
  }
}

function deleteRecord() {
  var selection = w2ui['groupGrid'].getSelection()
  selection = Number.parseInt(selection[0])
  var record = w2ui['groupGrid'].get(selection);

  var groupIdx = document.getElementById('groupIdx').value;
  w2ui.groupGrid.delete(this);
  $.ajax({
    type: "POST",
    url: "/addressDetail/deletePhonenum",
    data : {
      "groupIdx": groupIdx,
      "phonenum": record.phonenum
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

$(function () {

  var groupIdxUrl = document.getElementById('groupIdx').value;
  groupGrid(groupIdxUrl);

  fileGrid();
  wrongGrid();
});

function groupGrid(groupIdxUrl) {
  $('#groupGrid').w2grid({
    name: 'groupGrid',
    url  : `/addressDetail/getPhonenumList?groupIdx=${groupIdxUrl}`,
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
    ]
});
}

function fileGrid() {
  $('#fileGrid').w2grid({
    name: 'fileGrid',
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
    records: []
});
}


function wrongGrid() {
  $('#wrongGrid').w2grid({
    name: 'wrongGrid',
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
    records: []
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
      var excelGroup = new Array();
      var fileGridList = new Array();
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
            var validCnt = onlyPhonenumExcelCnt(setCnt, rows, excelGroup, fileGridList);
            setCnt = count; //되돌릴때는 이거 주석처리
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
            var validCnt = phonenumWithNameExcelCnt(setCnt, rows, excelGroup, fileGridList, phonenumIdx)
          }
        
          alert(`전체: ${count}건\n발송가능한 번호: ${validCnt}건\n잘못된 번호: ${setCnt - validCnt}건\n중복된 번호: ${duplicatedCnt}건`);
          
          //console.log(fileGridList);
          w2ui['fileGrid'].add(fileGridList);
          w2ui['wrongGrid'].add(wrongNumList);
      });
  };
  reader.readAsBinaryString(input.files[0]);
}

function onlyPhonenumExcelCnt(count, rows, excelGroup, fileGridList) {
  var validCnt = 0;
  var phonenum;
  for(var i=0;i<count;i++){
    let values = Object.values(rows[i]);
    phonenum = phonenumFormattingExcel(values[0]);
   
    if(phonenum){
      validCnt++;
      excelGroup.push(phonenum);  
      fileGridList.push({ recid: i+1, phonenum: phonenum, name: "이름없음"})
    }else{
      wrongNumList.push({ recid: i+1, phonenum: "잘못된번호:" + values[0],w2ui: {style:"background-color:#FF99CC;"}})
    }
  }
  return validCnt;
}

function phonenumWithNameExcelCnt(count, rows, excelGroup, fileGridList, phonenumIdx) {
  var validCnt = 0;
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
      fileGridList.push({ recid: i+1, phonenum: phonenum, name: values[nameIdx]});
    }else{
      wrongNumList.push({ recid: i+1, phonenum: "잘못된번호:" + values[phonenumIdx]
      , name:values[nameIdx], w2ui: {style:"background-color:#FF99CC;"}});
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
  if(phonenum.length== 10 && phonenum.charAt(0) == '1'){
    return '0'+phonenum;
  }else if(phonenum.length==11 && phonenum.charAt(0) == '0' && phonenum.charAt(1) == '1'){
    return phonenum;
  }else{
    return null;
  }
}



