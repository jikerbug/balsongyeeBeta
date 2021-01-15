module.exports = {

  header:function(alert='', authStatus=`<li><a href="/auth/login">로그인</a></li>
  <li><a href="/auth/register">회원가입</a></li>`){
    return `
    <!-- ======= Header ======= -->

    
    <header id="header" class="fixed-top">
    
      <div class="container-fluid d-flex justify-content-between align-items-center">
        <!-- Uncomment below if you prefer to use an image logo -->
        <!-- <a href="index.html" class="logo"><img src="assets/img/logo.png" alt="" class="img-fluid"></a>-->

        <h2 class="logo"><a href="/"><img src="assets/img/logo2.svg" style="margin-bottom:7px"/> 발송이</a></h2>
        <nav class="nav-menu d-none d-lg-block">
          <ul>
            <li class="nav-item dropdown">
              <a class="dropdown" href="/userInfo/sendResult?msgType=sms" id="navbarDropdown">
                발송결과
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                <a class="dropdown-item" href="/userInfo/sendResult?msgType=sms">단문</a>
                <a class="dropdown-item" href="/userInfo/sendResult?msgType=lms">장문</a>
                <a class="dropdown-item" href="/userInfo/sendResult?msgType=mms">사진</a>
              </div>
            </li>
            <li class="nav-item dropdown">
              <a class="dropdown" href="/sendMsg?msgType=smslms" id="navbarDropdown">
                문자전송
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                <a class="dropdown-item" href="/sendMsg?msgType=smslms">단문/장문</a>
                <a class="dropdown-item" href="/sendMsg?msgType=mms">사진</a>
              </div>
            </li>
            <li class="nav-item dropdown">
              <a href="/sendMsg?msgType=smslms" id="navbarDropdown">
                선거문자
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <a class="dropdown-item" href="/sendMsg?msgType=smslms">선거 단문/장문</a>
              <a class="dropdown-item" href="/sendMsg?msgType=mms">선거 사진</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="/sendMsg?msgType=mms">의정부구 선거</a>
              </div>
            </li>
            <li><a href="/userInfo/address">주소록</a></li>
            ${authStatus}
            <li><a href="/services">고객센터</a></li>
            <li><a href="/userInfo/cash">충전</a></li>
            
          </ul>
        </nav><!-- .nav-menu -->

        <div class="header-padding">
        </div>

      </div>

    </header><!-- End Header --> 
    `
  },
  footer:function() {
    return `<!-- ======= Footer ======= -->
    <footer id="footer">
      <div class="container">
        
        <div style="fontSize:5; textAlign: 'center'">
          <p>모은유통대표 : 임모은 / 사업자등록번호 : 155-08-01080</p>
          <p>주소 : 경기도 남양주시 경강로294번길 17(삼패동) / 대표전화 : 010-8752-1215</p>  
          <p>COPYRIGHT 발송이 ALL RIGHTS RESERVED.</p>    
        </div>
  
        <div class="credits">
          <!-- All the links in the footer should remain intact. -->
          <!-- You can delete the links only if you purchased the pro version. -->
          <!-- Licensing information: https://bootstrapmade.com/license/ -->
          <!-- Purchase the pro version with working PHP/AJAX contact form: https://bootstrapmade.com/kelly-free-bootstrap-cv-resume-html-template/ -->
          Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>
        </div>
      </div>
    </footer><!-- End  Footer -->`;
  },
  sidenav:function(name, coin, sms, lms, mms, logout="") {
    return `
    <div class="sidenav">
    <p>${name} 고객님</p>
    <p>잔여건수</p>
    <input style="display:none" id="coin" value="${coin}"/>
    <p>코인 : ${coin}코인</p>
    <p href="#">단문 : ${sms}건</p>
    <p href="#">장문 : ${lms}건</p>
    <p href="#">사진 : ${mms}건</p>
    <a href="#layer2" class="btn-example">정보안내</a>
    <a href="/auth/logout" id="logout-button">로그아웃</a>
   
    <div class="dim-layer">
        <div class="dimBg"></div>
        <div id="layer2" class="pop-layer">
            <div class="pop-container">
                <div class="pop-conts">
                    <!--content //-->
                    <p class="ctxt mb20">
                    현재 보여지는 잔여건수는 단문, 장문, 사진을 전송 할 수 있는 최대건수입니다.<br>
                    각각의 건수가 충전되어 있는 것이 아니며 코인를 단문, 장문, 사진으로 환산해 놓은 건수입니다.<br>
                    1코인 = 단문 1건<br>
                    3코인 = 장문 1건<br>
                    6코인 = 포토 1건
                    </p>

                    <div class="btn-r">
                        <a href="#" class="btn-layerClose">Close</a>
                    </div>
                    <!--// content-->
                </div>
            </div>
        </div>
    </div>
    </div>
    `
  },
  loginSidenav:function() {
    return `
        <div class="loginSidenav">
					<div class="card fat">
						<div class="card-body">
							<h4 class="card-title" style="font-size:smaller; font-weight:bold">로그인</h4>
							<form method="POST" action="/auth/login_process" class="my-login-validation" novalidate="">
								<div class="form-group">
									<input id="id" type="id" class="form-control" name="id" placeholder="아이디">
									<div class="invalid-feedback">
										id is invalid
									</div>
								</div>
								<div class="form-group">
									<input id="password" type="password" class="form-control" name="pwd" placeholder="비밀번호">
								    <div class="invalid-feedback">
								    	비밀번호를 입력해주세요
										</div>
									
								</div>

								<a href="forgot.html" class="float-right" style="margin-bottom:15px">
									아이디 / 비밀번호 찾기
								</a>
								<div class="login-button" >
									<button type="submit" class="btn btn-primary btn-block" style="background-color:#34b7a7;margin-bottom:-10px">
										로그인
									</button>
								</div>
								<div class="mt-4 text-center" >
									계정이 없으신가요?<a style="display:inline" href="/auth/register">회원가입</a>
                </div>
							</form>
						</div>
					</div>
        </div>  
    `

    },
    sendResultDetail:function(tuples) {


      var form = function(date, msg, type, cnt, success, fail, status) {
        return `<tr>
        <th scope="row">1</th>
        <td>${date}</td>
        <td>${msg}</td>
        <td>${type}</td>
        <td>${cnt}</td>
        <td>${success}</td>
        <td>${fail}</td>
        <td>${status}</td>
        </tr>`
      }

      var sendResult = ``;

      for(var i =0; i< tuples.length; i++){
        var date = tuples[i].TR_SENDDATE;
        var msg = tuples[i].TR_MSG;
        var type = tuples[i].TR_MSGTYPE;
        var cnt = "1개"
        var success = "1개";
        var fail = "0개";
        var status = tuples[i].TR_SENDSTAT;
        sendResult += form(date, msg, type, cnt, success, fail, status);
      }
      
      return sendResult;
      
    },
    sendResult:function(tuples,type) {

      // yyyy-MM-dd 포맷으로 반환
      var getFormatDate = function(date){
        var year = date.getFullYear();              //yyyy
        var month = (1 + date.getMonth());          //M
        month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
        var day = date.getDate();                   //d
        day = day >= 10 ? day : '0' + day;          //day 두자리로 저장
        var hours = date.getHours();
        hours = hours >= 10 ? hours : '0' + hours;  
        var minutes = date.getMinutes();
        minutes = minutes >= 10 ? minutes : '0' + minutes; 
        return  year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;
      }



      var form = function(date, title, msgType, cnt, success, fail, status, sendResultIndex) {
        return `<tr>
        <th scope="col">
              <input type="checkbox"  aria-label="Checkbox for following text input">
        </th>
        <td><a href="/userInfo/sendResult/detail/?msgType=sms&userSendIndex=${sendResultIndex}">상세보기</a></td>
        <td>${date}</td>
        <td>${title}</td>
        <td>${msgType}</td>
        <td>${cnt}</td>
        <td>${success}</td>
        <td>${fail}</td>
        <td>${status}</td>
        </tr>`
      }

      var sendResult = ``;

      for(var i =0; i< tuples.length; i++){
        var date = getFormatDate(tuples[i].TR_SENDDATE);
        var title = tuples[i].userSendTitle;
        var msgType = type;
        var cnt = tuples[i].userSendCnt;
        var success = cnt;
        var fail = cnt - success;
        var status = fail ? '진행중' : '완료';
        var sendResultIndex = tuples[i].userSendIndex;
        sendResult += form(date, title, msgType, cnt, success, fail, status,sendResultIndex);
      }

      return sendResult;
      
    }
    
  
  
  
 



}