


var test = [
  { recid: 1, fname: "Peter", lname: "Jeremia" }
];
for(var i=2; i<50000;i++){
  var json = { recid: i, fname: "Peter", lname: "Jeremia"}
  test.push(json);
}
console.log('s');

$(function () {
  groupList = localStorage.getItem('excelGroup');
  groupType = localStorage.getItem('groupType');
  groupList = JSON.parse(groupList);
  console.log(groupList);

  if(groupType == "number"){
    numberGrid(groupList)
  }else if(groupType == "numberWithName"){
    numberWithNameGrid(groupList)
  }
  
});

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

function numberGrid(groupList) {
  $('#grid').w2grid({
    name: 'grid',
    header: 'List of Names',
    show : {
        toolbar:true, 
        footer:true
    }, 
    multiSearch:false,
    searches : [
      { field:"phonenum", caption:"전화번호", type:"text" },
  ],
    columns: [
        { field: 'phonenum', caption: '전화번호', size: '30%' },
    ],
    records: groupList
});
}

