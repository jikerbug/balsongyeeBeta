module.exports = {
  sendDateCalculate: function(reservedDate, splitMinutes) {
    //분할발송 아닌 경우에는 sendIndex에 추가할 groupNum은 0이다
    //과거 날짜(하루 이상 차이까지는 나지 않는)로 보내도 now()로 보내준다!
    //모듈 다시 이식했을때 확인
    //예약발송
    var sendDate;
    if(reservedDate){
      sendDate = '"' + reservedDate + '"';
    }else{
      sendDate = 'NOW()'
    }

    if(splitMinutes == 0){
      console.log(sendDate);
      return sendDate;
    }

    //분할발송
    if(splitMinutes){
      if(sendDate == 'NOW()'){
        var now = new Date();
        var time = now.getTime() + splitMinutes * 1000 * 60;
        var date = new Date(time); 

        var month = (9 > date.getMonth()) ? '0' + (date.getMonth()+1) : date.getMonth()+1;
        var day = (10 > date.getDate()) ? '0' + date.getDate() : date.getDate();
        var hours = (10 > date.getHours()) ? '0' + date.getHours() : date.getHours();
        var minutes = (10 > date.getMinutes()) ? '0' + date.getMinutes() : date.getMinutes();

        sendDate = "'" + date.getFullYear() +"-"+ month +"-"+ day + " " + hours + ":" + minutes + "'";

      }else{

        //2021-01-18 23:25:09
        var y = sendDate.substr(1,4),
            m = sendDate.substr(6,2),
            d = sendDate.substr(9,2),
            h = sendDate.substr(12,2),
            min = sendDate.substr(15,2);

        sendDate = new Date(y,m-1,d,h,min); 
        var time = sendDate.getTime() + splitMinutes * 1000 * 60;
        var date = new Date(time); 

        var month = (9 > date.getMonth()) ? '0' + (date.getMonth()+1) : date.getMonth()+1;
        var day = (10 > date.getDate()) ? '0' + date.getDate() : date.getDate();
        var hours = (10 > date.getHours()) ? '0' + date.getHours() : date.getHours();
        var minutes = (10 > date.getMinutes()) ? '0' + date.getMinutes() : date.getMinutes();

        sendDate = "'" + date.getFullYear() +"-"+ month +"-"+ day + " " + hours + ":" + minutes + "'";
      }     
      console.log('sendDate :'+sendDate);
    }

    return sendDate;
  }
} 

