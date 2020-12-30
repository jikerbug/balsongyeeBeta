module.exports = {

  html:function(view='', authStatus='<a class="nav-link" href="/auth/login">로그인</a>', alert=''){
    return `
    <!doctype html>
    <html>
      <head>
        <!-- Required meta tags -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
    
        <!-- Bootstrap CSS -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1" crossorigin="anonymous">
    
        <title>발송이-선거문자발송서비스</title>
        <link rel="preconnect" href="https://fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css2?family=Stylish&display=swap" rel="stylesheet">
        <style> nav {font-family: 'Stylish', sans-serif; } </style>   
        <style> nav {font-size:1.5em;} </style>  
      </head>
      <body style="textAlign: 'center'">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
          <div class="container-fluid">
            <a class="navbar-brand" href="/" style="font-size: 2em;">발송이</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
              <div class="navbar-nav">
                <a class="nav-link active" aria-current="page" href="/sendMsg">SMS문자발송</a>
                <a class="nav-link" href="/sendMsg">LMS문자발송</a>
                ${authStatus}
              </div>
            </div>
          </div>
        </nav>
    
    
        <p style="margin: 10px">
          안녕하세요 발송이입니다 
        </p>
        
        ${view}
        <!-- Optional JavaScript; choose one of the two! -->
    
        <!-- Option 1: Bootstrap Bundle with Popper -->
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js" integrity="sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW" crossorigin="anonymous"></script>
    
        <!-- Option 2: Separate Popper and Bootstrap JS -->
        <!--
        <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.4/dist/umd/popper.min.js" integrity="sha384-q2kxQ16AaE6UbzuKqyBE9/u/KzioAlnx2maXQHiDX9d4/zp8Ok3f+M7DPm+Ib6IU" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.min.js" integrity="sha384-pQQkAEnwaBkjpqZ8RU1fF1AKtTcHJwFl3pblpTlHXybJjHpMYo79HY3hIi4NKxyj" crossorigin="anonymous"></script>
        -->
      </body>

      ${alert}
    </html>
    `
  },
  form:function(){
    return ` 
    <form method="post" action='/sendMsg/processOld' style="margin: 10px">
      <div class="form-floating">
        <textarea name="msg" class="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style="height: 300px; width: 500px; font-size: 1.3em"></textarea>
        <label for="floatingTextarea2">문자 내용을 입력해주세요</label>
      </div>
      <p><input type="text" name="phonenum" style="width: 200px;" placeholder="전송할 번호를 입력해주세요"></p>
      <p><input type="text" name="passwd" style="width: 200px;" placeholder="비밀번호를 입력해주세요"></p>
      
      <p><input type="submit" value="Submit"></p>
    </form>
    `
  },
  loginOld:function(){
    return `
    <form action="/auth/login_process" method="post" style="margin: 10px">
      <p><input type="text" name="email" placeholder="이메일"></p>
      <p><input type="password" name="pwd" placeholder="비밀번호"></p>
      <p>
        <input type="submit" value="login">
      </p>
    </form>
    `
  },login:function(){
    return `
    <form action="/auth/login_process" method="post" style="margin-left: 10px">
      <div class="mb-3">
        <label for="Email1" class="form-label">이메일</label>
        <input type="email" class="form-control" name="email" style="width: 300px">     
      </div>
      <div class="mb-3">
        <label for="Password1" class="form-label">비밀번호</label>
        <input type="password" class="form-control" name="pwd" style="width: 300px">
      </div>
      <button type="submit" class="btn btn-primary">로그인</button>
    </form>
    `
  },
  register:function(){
    return `
    
    <form action="/auth/register_process" method="post" style="margin: 10px">
      <p><input type="text" name="email" placeholder="이메일"></p>
      <p><input type="password" name="pwd" placeholder="비밀번호"></p>
      <p><input type="password" name="pwdCheck" placeholder="비밀번호 확인"></p>
      <p>
        <input type="submit" value="회원가입">
      </p>
    </form>
    `
  },
  tempIndex: function() {

    return`
    <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta content="width=device-width, initial-scale=1.0" name="viewport">

  <title>발송이 - 문자발송 서비스</title>
  <meta content="" name="description">
  <meta content="" name="keywords">

  <!-- Favicons -->
  <link href="assets/img/favicon.ico" rel="icon">
  <link href="assets/img/apple-touch-icon.png" rel="apple-touch-icon">

  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Raleway:300,300i,400,400i,500,500i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i" rel="stylesheet">

  <!-- Vendor CSS Files -->
  <link href="assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
  <link href="assets/vendor/icofont/icofont.min.css" rel="stylesheet">
  <link href="assets/vendor/owl.carousel/assets/owl.carousel.min.css" rel="stylesheet">
  <link href="assets/vendor/boxicons/css/boxicons.min.css" rel="stylesheet">
  <link href="assets/vendor/venobox/venobox.css" rel="stylesheet">
  <link href="assets/vendor/aos/aos.css" rel="stylesheet">

  <!-- Template Main CSS File -->
  <link href="assets/css/style.css" rel="stylesheet">

  <!-- =======================================================
  * Template Name: Kelly - v3.0.0
  * Template URL: https://bootstrapmade.com/kelly-free-bootstrap-cv-resume-html-template/
  * Author: BootstrapMade.com
  * License: https://bootstrapmade.com/license/
  ======================================================== -->
</head>

<body>

  <!-- ======= Header ======= -->
  <header id="header" class="fixed-top">
    <div class="container-fluid d-flex justify-content-between align-items-center">

      <h2 class="logo"><a href="index.html"><img src="assets/img/logo2.svg" style="margin-bottom:8px"/> 발송이</a></h2>
      <!-- Uncomment below if you prefer to use an image logo -->
      <!-- <a href="index.html" class="logo"><img src="assets/img/logo.png" alt="" class="img-fluid"></a>-->

      <nav class="nav-menu d-none d-lg-block">
        <ul>
          <li><a href="sendMsg.html">문자발송</a></li>
          <li><a href="./loginForm/index.html">로그인</a></li>
          <li><a href="./loginForm/register.html">회원가입</a></li>
          <li><a href="services.html">고객센터</a></li>
          <li><a href="sendMsg.html">Contact</a></li>
        </ul>
      </nav><!-- .nav-menu -->

      <div class="header-padding">
      </div>

    </div>

  </header><!-- End Header -->

  <!-- ======= Hero Section ======= -->
  <section id="hero" class="d-flex align-items-center">
    <div class="container d-flex flex-column align-items-center" data-aos="zoom-in" data-aos-delay="100">
      <h1>발송이</h1>
      <h2>문자발송 서비스</h2>
      <a href="./loginForm/index.html" class="btn-about">로그인</a>
    </div>
  </section><!-- End Hero -->

  <!-- ======= Footer ======= -->
  <footer id="footer">
    <div class="container">
      
      <div style="fontSize:5; textAlign: 'center'">
        <p>(주)모은유통대표 : 임모은 / 사업자등록번호 : 155-08-01080</p>
        <p>주소 : 경기도 남양주시 경강로294번길 17(삼패동)</p>  
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
  </footer><!-- End  Footer -->

  
  <a href="#" class="back-to-top"><i class="bx bx-up-arrow-alt"></i></a>

  <!-- Vendor JS Files -->
  <script src="assets/vendor/jquery/jquery.min.js"></script>
  <script src="assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
  <script src="assets/vendor/jquery.easing/jquery.easing.min.js"></script>
  <script src="assets/vendor/php-email-form/validate.js"></script>
  <script src="assets/vendor/waypoints/jquery.waypoints.min.js"></script>
  <script src="assets/vendor/counterup/counterup.min.js"></script>
  <script src="assets/vendor/owl.carousel/owl.carousel.min.js"></script>
  <script src="assets/vendor/isotope-layout/isotope.pkgd.min.js"></script>
  <script src="assets/vendor/venobox/venobox.min.js"></script>
  <script src="assets/vendor/aos/aos.js"></script>

  <!-- Template Main JS File -->
  <script src="assets/js/main.js"></script>

</body>

</html>
    
    
    `
  },

  tempSendMsg:function() {
    return `

    <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta content="width=device-width, initial-scale=1.0" name="viewport">

  <title>Contact - Kelly Bootstrap Template</title>
  <meta content="" name="description">
  <meta content="" name="keywords">

  <!-- Favicons -->
  <link href="assets/img/favicon.png" rel="icon">
  <link href="assets/img/apple-touch-icon.png" rel="apple-touch-icon">

  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Raleway:300,300i,400,400i,500,500i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i" rel="stylesheet">

  <!-- Vendor CSS Files -->
  <link href="assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
  <link href="assets/vendor/icofont/icofont.min.css" rel="stylesheet">
  <link href="assets/vendor/owl.carousel/assets/owl.carousel.min.css" rel="stylesheet">
  <link href="assets/vendor/boxicons/css/boxicons.min.css" rel="stylesheet">
  <link href="assets/vendor/venobox/venobox.css" rel="stylesheet">
  <link href="assets/vendor/aos/aos.css" rel="stylesheet">

  <!-- Template Main CSS File -->
  <link href="assets/css/style.css" rel="stylesheet">

  <!-- =======================================================
  * Template Name: Kelly - v3.0.0
  * Template URL: https://bootstrapmade.com/kelly-free-bootstrap-cv-resume-html-template/
  * Author: BootstrapMade.com
  * License: https://bootstrapmade.com/license/
  ======================================================== -->
</head>

<body>

  <!-- ======= Header ======= -->
  <header id="header" class="fixed-top">
    <div class="container-fluid d-flex justify-content-between align-items-center">

      <h2 class="logo"><a href="index.html"><img src="assets/img/logo2.svg" style="margin-bottom:8px"/> 발송이</a></h2>
      <!-- Uncomment below if you prefer to use an image logo -->
      <!-- <a href="index.html" class="logo"><img src="assets/img/logo.png" alt="" class="img-fluid"></a>-->

      <nav class="nav-menu d-none d-lg-block">
        <ul>
          <li><a href="sendMsg.html">문자발송</a></li>
          <li><a href="./loginForm/index.html">로그인</a></li>
          <li><a href="./loginForm/register.html">회원가입</a></li>
          <li><a href="services.html">고객센터</a></li>
          <li><a href="sendMsg.html">Contact</a></li>
        </ul>
      </nav><!-- .nav-menu -->

      <div class="header-padding">
      </div>

    </div>

  </header><!-- End Header -->

  <main id="main">

    <!-- ======= Contact Section ======= -->
    <section id="contact" class="contact">
      <div class="container" data-aos="fade-up">

        <div class="section-title" style="margin-top: 30px;">
          <h2>문자 발송하기</h2>
          <div class="info">
            <div class="email">
              <i class="icofont-envelope"></i>
            </div>
          </div>
          
        </div>

        

        <div class="row mt-5">
          

          <div class="col-lg-2">
            

          </div>

          <div class="col-lg-8 mt-5 mt-lg-0">

            <form action="/sendMsg/processOld" method="post" role="form" class="php-email-form">
              <div class="row">
                <div class="col-md-3 form-group">
                  <input type="text" name="phonenum" class="form-control" id="name" placeholder="수신번호" data-rule="minlen:11" data-msg="11자 이상의 전화번호를 입력해주세요" />
                  <div class="validate"></div>
                </div>
                <div class="col-md-3 form-group mt-3 mt-md-0">
                  <input type="text" class="form-control" name="passwd" id="email" placeholder="비밀번호"/>
                  <div class="validate"></div>
                </div>
              </div>
              
              <div class="form-group mt-3">
                <textarea class="form-control" name="msg" rows="5" data-rule="required" data-msg="메세지를 입력해주세요" placeholder="메세지 입력"></textarea>
                <div class="validate"></div>
              </div>
              <div class="mb-3">
                <div class="loading">로딩중...</div>
                <div class="error-message"></div>
                <div class="sent-message">문자발송 성공!</div>
              </div>
              <div class="text-center"><button type="submit">발송</button></div>
            </form>

          </div>

        </div>

      </div>
    </section><!-- End Contact Section -->

  </main><!-- End #main -->

  <!-- ======= Footer ======= -->
  <footer id="footer">
    <div class="container">
      
      <div style="fontSize:5; textAlign: 'center'">
        <p>(주)모은유통대표 : 임모은 / 사업자등록번호 : 155-08-01080</p>
        <p>주소 : 경기도 남양주시 경강로294번길 17(삼패동)</p>  
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
  </footer><!-- End  Footer -->

  <div id="preloader"></div>
  <a href="#" class="back-to-top"><i class="bx bx-up-arrow-alt"></i></a>

  <!-- Vendor JS Files -->
  <script src="assets/vendor/jquery/jquery.min.js"></script>
  <script src="assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
  <script src="assets/vendor/jquery.easing/jquery.easing.min.js"></script>
  <script src="assets/vendor/php-email-form/validate.js"></script>
  <script src="assets/vendor/waypoints/jquery.waypoints.min.js"></script>
  <script src="assets/vendor/counterup/counterup.min.js"></script>
  <script src="assets/vendor/owl.carousel/owl.carousel.min.js"></script>
  <script src="assets/vendor/isotope-layout/isotope.pkgd.min.js"></script>
  <script src="assets/vendor/venobox/venobox.min.js"></script>
  <script src="assets/vendor/aos/aos.js"></script>

  <!-- Template Main JS File -->
  <script src="assets/js/main.js"></script>

  </body>

  </html>
      

    `;
  }
  
 



}