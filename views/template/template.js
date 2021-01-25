module.exports = {

  header:function(alert='', authStatus=`<li><a href="/auth/login">로그인</a></li>
  <li><a href="/auth/register">회원가입</a></li>`){
    return `
    
    <!-- ======= Header ======= -->
    <header id="header" class="fixed-top">
    <div class="container" style="padding:0">
    <div class="container-fluid d-flex justify-content-between align-items-center">
        <nav class="nav-menu d-none d-lg-block" style="text-align: center">
        
          <ul>
            <li style="padding:0">
            <h2 class="logo"><a href="/"><img src="assets/img/logo2.svg" style="margin-bottom:7px"/>
            <span>발송이</span>
            </a></h2>
            </li>
            <li class="nav-item dropdown">
              <a class="dropdown" href="/sendResult?msgType=sms" id="navbarDropdown">
                발송결과
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                <a class="dropdown-item" href="/sendResult?msgType=sms">단문</a>
                <a class="dropdown-item" href="/sendResult?msgType=lms">장문</a>
                <a class="dropdown-item" href="/sendResult?msgType=mms">사진</a>
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
                <i class="bx bx-check-circle" style="color:red"></i>
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <a class="dropdown-item" href="/sendMsg?msgType=smslms">선거 단문/장문</a>
              <a class="dropdown-item" href="/sendMsg?msgType=mms">선거 사진</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="/sendMsg?msgType=mms">의정부구 선거</a>
              </div>
            </li>
            <li><a href="/address">전화번호목록</a></li>
            ${authStatus}
            <li><a href="/services">고객센터</a></li>
            <li><a href="/userInfo/cash">충전</a></li>   
          </ul>
        </nav><!-- .nav-menu -->

        <div class="header-padding">
        </div>
      </div>
      </div>
    </header><!-- End Header --> 
    ${alert}
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
    return this.layoutContainerColLeft(`
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
    </div>`) +`<div class="dim-layer">
    <div class="dimBg"></div>
    <div id="layer2" class="pop-layer">
        <div class="pop-container">
            <div class="pop-conts">
                <!--content //-->
                <p class="ctxt mb20">
                현재 보여지는 잔여건수는 단문, 장문, 사진을 전송할 수 있는 최대건수입니다.<br>
                각각의 건수가 충전되어 있는 것이 아니며 코인을 단문, 장문, 사진으로 환산해 놓은 건수입니다.
                <p style="font-weight:bold;line-height:10px">1코인 = 단문 1건</p>
                <p style="font-weight:bold;line-height:10px">3코인 = 장문 1건</p>
                <p style="font-weight:bold;line-height:10px">6코인 = 포토 1건</p>
                </p>
                <div class="btn-r">
                    <a href="#" class="btn-layerClose">Close</a>
                </div>
                <!--// content-->
            </div>
        </div>
    </div>
</div>`+ this.sidenavRight();
    
  },
  loginSidenav:function() {
    return this.layoutContainerColLeft(`
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
        </div>`)+ this.sidenavRight();
    },
    sidenavRight:function() {
      return this.layoutContainerColRight(`
      <div class="sidenavRight">
        <a href="/" class="icon-href">
          <i class="bx bx-file"></i>
          <p>080 거부번호</p>    
        </a>
        <a href="/" class="icon-href">
          <i class="bx bx-phone"></i>
          <p>발신번호 등록</p>
        </a>
        <a href="/" class="icon-href">
          <i class="bx bx-credit-card"></i>
          <p>결제/충전하기</p>
        </a>
        <a href="/" class="icon-href">
          <i class="bx bx-support"></i>
          <p>전화상담</p>
        </a>
        <a href="/" class="icon-href">
          <i class="bx bx-user-voice"></i>
          <p>선거홍보안내</p>
        </a>
        <a href="/" class="icon-href">
          <i class="bx bxs-contact"></i>
          <p>주소록 등록</p>
        </a>
      </div> 
      `);
    },
    layoutContainerColLeft:function(html) {
      return `
      <div class="container" data-aos="fade-up">
      <div class="row">
        <div class="col-lg-3 col-md-6" data-aos="zoom-in" data-aos-delay="100">
        ${html}
        </div>
        <div class="col-lg-5 col-md-6" data-aos="zoom-in" data-aos-delay="100">
        
        </div>
        <div class="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-delay="100">
        </div>
      </div>
      </div>
      ` 
    },layoutContainerColRight:function(html) {
      return `
      <div class="container-fluid">
      <div class="row">
        <div class="col-lg-9">    
        </div>
        <div class="col-lg-2">
        ${html}
        </div>
      </div>
      </div>
      ` 
    }
    
  
  
  
 



}