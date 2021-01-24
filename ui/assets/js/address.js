$('#groupGrid').w2grid({
  name: 'groupGrid',
  url: '/address/getGroups',
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
  


// function removeGroup() {
//   w2ui.groupGrid.delete(true);
// }

// function addGroup() {
//   var g = w2ui['grid'].records.length;
//   w2ui['grid'].add( { recid: g + 1, groupName: 'Jin', count: 'Franson'} );
// }

// var test = [
//   { recid: 1, groupName: "남양주시민", count: "20명" }
// ];

// $(function () {
//   groupList = localStorage.getItem('excelGroup');
//   groupList = JSON.parse(groupList);

//   groupGrid(test)
  
  
// });

// function groupGrid(groupList) {
//   $('#groupGrid').w2grid({
//     name: 'groupGrid',
//     header: 'List of Names',
//     style: 'font-size:16px',
//     show : {
//         toolbar:true, 
//         footer:true
//     }, 
//     multiSearch:false,
//     searches : [
//       { field:"groupName",  caption:"그룹명", type:"text"},
//       { field:"count", caption:"인원수", type:"text" }
//   ],
//     columns: [
//       { field: 'groupName', caption: '그룹명', size: '50%' },
//       { field: 'count', caption: '인원수', size: '50%' },
//     ],
//     records: groupList
// });
// }

// $('#myGrid').w2grid({ 
//   name   : 'myGrid', 
//   url    : 'data/records.json',
//   columns: [                
//       { field: 'fname', caption: 'First Name', size: '30%' },
//       { field: 'lname', caption: 'Last Name', size: '30%' },
//       { field: 'email', caption: 'Email', size: '40%' },
//       { field: 'sdate', caption: 'Start Date', size: '120px' },
//   ]
// });