/*-----------------------------------폰목록 보여주기-----------------------------------*/


function showPopup() 
{ 
  window.open("assets/w2ui/gridPopup.html", "a", "width=500, height=405, left=100, top=50"); 
}


var test = [
  { recid: 1, fname: "Peter", lname: "Jeremia" }
];
for(var i=2; i<50000;i++){
  var json = { recid: i, fname: "Peter", lname: "Jeremia"}
  test.push(json);
}
console.log('s');



$(function () {
  $('#grid').w2grid({
      name: 'grid',
      header: 'List of Names',
      show : {
          toolbar:true, 
          footer:true
      }, 
      multiSearch:false,
      searches : [
        { field:"fname", caption:"ID", type:"int" },
        { field:"lname", caption:"이름", type:"float" }
    ],
      columns: [
          { field: 'fname', caption: 'First Name', size: '30%' },
          { field: 'lname', caption: 'Last Name', size: '30%' },

      ],
      records: test
  });
});

