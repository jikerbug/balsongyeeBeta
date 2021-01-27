
$(function () {
  groupIdxUrl = localStorage.getItem('groupIdxUrl');
  groupGrid(groupIdxUrl);
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


