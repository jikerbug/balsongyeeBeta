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
            <li><a href="/userInfo/sendResult">발송결과</a></li>
            <li><a href="/sendMsg">단문발송</a></li>
            <li><a href="/sendMsg">장문발송</a></li>
            <li><a href="/userInfo/address">주소록</a></li>
            <li><a href="/userInfo/cash">충전</a></li>
            ${authStatus}
            <li><a href="/services">고객센터</a></li>
            
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
  sidenav:function(name, coin, sms, lms, mms) {
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

    
    
  }
  
  
 



}