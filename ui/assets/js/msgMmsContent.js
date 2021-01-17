/*---------------------------------------메세지 글자수 체크------------------------------------*/

$(function(){
  $('#msg').on("keyup change",function(){
    bytesHandler(this);
  });
});

function getTextLength(str) {
  var len = 0;
  
  for (var i = 0; i < str.length; i++) {
    if (escape(str.charAt(i)).length == 6) {
      len++;
    }
      len++;
    }
    return len;
}

function bytesHandler(obj){
  var text = $(obj).val();
  var len = getTextLength(text);
  if(len > 90){
    $('span.bytes').text(len + "/2000bytes");

    //byId
    $('#msgSubject').css("pointer-events","auto");
  }else{
    $('span.bytes').text(len + "/90bytes");
    $('#msgSubject').css("pointer-events","none");
    
  } 
}

$(function(){
  $('#msgMms').on("keyup change",function(){
    bytesHandlerMms(this);
  });
});

function getTextLength(str) {
  var len = 0;
  
  for (var i = 0; i < str.length; i++) {
    if (escape(str.charAt(i)).length == 6) {
      len++;
    }
      len++;
    }
    return len;
}

function bytesHandlerMms(obj){
  var text = $(obj).val();
  var len = getTextLength(text);

  $('span.bytesMms').text(len + "/2000bytes");
  //# : byId
  $('#msgSubject').css("pointer-events","auto");
   
}


/*---------------------------------------메세지 콘텐츠(문자)------------------------------------*/

function firstList(choice){
  if(choice === 1){
    return '기분좋은 아침입니다.\n\n한결같은 믿음과 성원에\n\n다시한번 감사의 마음을 전해드리며,\n\n오늘도 기분 좋은 하루되시길 기원합니다.'
  }else if(choice === 2){
    return '귀중한 시간을 할애해 주셔서\n\n진심으로 감사드립니다.\n\n좋은 만남을 기쁘게 생각하며,\n\n다시 만나길 기원합니다.'
  }else if(choice === 3){
    return '그간의 노고에 깊이 감사드립니다.\n\n앞으로도 한결같은 믿음과 성원으로 많은 도움 바랍니다.\n\n오늘도 기분좋은 하루 되실길 기원합니다.'
  }
  else if(choice === 4){
    return '■□■□■□■□\n＊ ＊ ＊ ＊ ＊ ＊\n＊▶◀┌───┐\n◀^ㅡ^▶GoodDay\n＊▶◀└───┘\n＊ ＊ ＊ ＊ ＊ ＊\n♡오┃늘┃♡도┃\n♥━┛━┛♥━┛\n좋┃은┃하┃루┃*\n━┛━┛━┛━┛*\n♬┏┓　┏┓♬\n♪┃┃　┃┃♪\n♬""　0　 ""♬\n■□■□■□■□'
  }
}

function secondList(choice){
  if(choice === 1){
    return '한해동안 베풀어 주신 도움에 진심으로 감사드리며,\n\n새해에도 가정의 평안과 사업번창을 기원합니다.\n\n건강하시고 행복하세요~♬'
  }else if(choice === 2){
    return '내가 웃어야 내 행운도 미소를 짓는다.\n\n나의 표정이 곧 내 행운의 얼굴이다.\n\n그러니까 오늘도 많이 웃으세요~~!^^'
  }else if(choice === 3){
    return '[지나온길]을 되돌아보는 [여유]가..\n\n[가야할길]을 바로 갈 수 있는 지혜를 가져다 줍니다.'
  }
  else if(choice === 4){
    return '이 세상에서 제일 무서운 것은 가난도, 걱정도, 병도, 슬픔도 아니다.\n\n인생에 대하여 권태를 느끼는 것이야말로 가장 무서운 것이다.\n\n- 마키아 벨리 -\n\n다시 돌아올 수 없는 오늘을 후회없이 아낌없이 즐기며 살아요~^^'
  }
}

function setFirst(obj){
  document.getElementById("textarea1").value = firstList(1);
  document.getElementById("textarea2").value = firstList(2);
  document.getElementById("textarea3").value = firstList(3);
  document.getElementById("textarea4").value = firstList(4);
  document.getElementById("textarea1").style.display  = "block";
  document.getElementById("textarea2").style.display  = "block";
  document.getElementById("textarea3").style.display  = "block";
  document.getElementById("textarea4").style.display  = "block";
  document.getElementById("sendImg1").style.display = "none";
  document.getElementById("sendImg2").style.display = "none";
  document.getElementById("sendImg3").style.display = "none";
  document.getElementById("sendImg4").style.display = "none";
 
  
  $(".nav").find(".active").removeClass("active");
  obj.className = "nav-link active"

}

function setSecond(obj){
  document.getElementById("textarea1").value = secondList(1);
  document.getElementById("textarea2").value = secondList(2);
  document.getElementById("textarea3").value = secondList(3);
  document.getElementById("textarea4").value = secondList(4);
  document.getElementById("textarea1").style.display  = "block";
  document.getElementById("textarea2").style.display  = "block";
  document.getElementById("textarea3").style.display  = "block";
  document.getElementById("textarea4").style.display  = "block";
  document.getElementById("sendImg1").style.display = "none";
  document.getElementById("sendImg2").style.display = "none";
  document.getElementById("sendImg3").style.display = "none";
  document.getElementById("sendImg4").style.display = "none";
  $(".nav").find(".active").removeClass("active");
  obj.className = "nav-link active"
}

function setUser(obj){
  
  $(".nav").find(".active").removeClass("active");
  obj.className = "nav-link active"
}


/*------------------------------------MMS 사진관련!!!---------------------------------------*/ 

function setVote(obj){
  document.getElementById("textarea1").style.display  = "none";
  document.getElementById("textarea2").style.display  = "none";
  document.getElementById("textarea3").style.display  = "none";
  document.getElementById("textarea4").style.display  = "none";
  document.getElementById("sendImg1").style.display = "block";
  document.getElementById("sendImg2").style.display = "block";
  document.getElementById("sendImg3").style.display = "block";
  document.getElementById("sendImg4").style.display = "block";
  $(".nav").find(".active").removeClass("active");
  obj.className = "nav-link active"
}

function scrollDownToPhoto(){
  showPhoto();
  $('html,body').animate({scrollTop:1000}, 'slow');
}

function showPhoto(){
  document.getElementById("showCollection").innerHTML = "문자모음 숨기기"
  $('#card-table').css("display","");
  setVote(document.getElementById("voteNav"));
}


//function addPhoto(obj){는 fileAndSend에서 formdata를 활용해야하기 때문에 좀더 직관적이도록fileAndSend.js로 이전했음

