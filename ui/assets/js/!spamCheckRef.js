var fileGridList = w2ui['fileGrid'].records;
  var groupGridList = w2ui['groupGrid'].records;

  var fileCnt = fileGridList.length;
  for(var i = 0; i<wrongNumList.length;i++){
    const findItem = fileGridList.find(function(item) {
      return item.phonenum == wrongNumList[i].phonenum;
    });
    const idx = fileGridList.indexOf(findItem);
    fileGridList.splice(idx, 1);
  }


  wrongNumList대신에 spamList를 추가하면 되는거다!!
