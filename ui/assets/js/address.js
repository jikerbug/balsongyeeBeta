
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
    { field: 'groupName', caption: '그룹명', size: '50%' },
    { field: 'count', caption: '인원수', size: '50%' },
  ]
});
  

function removeGroup(){
  var selection = w2ui['groupGrid'].getSelection();
  selection = Number.parseInt(selection[0]);
  if(!selection){
    alert('삭제할 그룹을 선택해주세요');
    return;
  }
  var record = w2ui['groupGrid'].get(selection);//언제나 하나만 리턴한다.리스트로 받을 걱정 ㄴㄴ
  if(confirm(`${record.groupName}에 등록된 전화번호가 전부 삭제됩니다. 삭제하시겠습니까?`)){
    /////address삭제시 ON DELETE CASCADE에의해, addressDetail에 등록되었던 튜플 전부삭제된다
    
    w2ui.groupGrid.delete(this);
    $.ajax({
      type: "POST",
      url: "/address/deleteGroup",
      data : {
        "groupIdx": record.recid
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

function groupIdxCheck() {
  var selection = w2ui['groupGrid'].getSelection()
  selection = Number.parseInt(selection[0])
  
  if(selection){
    var record = w2ui['groupGrid'].get(selection);
    var groupIdx = record.recid;
    groupIdx = groupIdx.toString();
    document.getElementById("groupIdx").value = groupIdx;
    return true;
  }else{
    alert('그룹을 선택해주세요')
    return false;
  }
}
