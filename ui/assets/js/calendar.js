//------------달력---------------------//
$(function () {
  //이렇게 넣으면 초는 00으로 세팅해준다
  //마리아db의 date포맷 : 2021-01-11 12:04:45()
        $('#datetimepicker1').datetimepicker({
          format:'YYYY-MM-DD HH:mm',
          minDate: new Date()
        });
});