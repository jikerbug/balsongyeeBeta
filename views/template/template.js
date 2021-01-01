module.exports = {

  header:function(view='', authStatus=`<li><a href="/auth/login">로그인</a></li>
  <li><a href="/auth/register">회원가입</a></li>`, alert=''){
    return `
    <!-- ======= Header ======= -->
    <header id="header" class="fixed-top">
      <div class="container-fluid d-flex justify-content-between align-items-center">

        <h2 class="logo"><a href="/"><img src="assets/img/logo2.svg" style="margin-bottom:8px"/> 발송이</a></h2>
        <!-- Uncomment below if you prefer to use an image logo -->
        <!-- <a href="index.html" class="logo"><img src="assets/img/logo.png" alt="" class="img-fluid"></a>-->

        <nav class="nav-menu d-none d-lg-block">
          <ul>
            <li><a href="/sendMsg">단문발송</a></li>
            <li><a href="/sendMsg">장문발송</a></li>
            ${authStatus}
            <li><a href="/services">고객센터</a></li>
            <li><a href="/sendMsg">Contact</a></li>
          </ul>
        </nav><!-- .nav-menu -->

        <div class="header-padding">
        </div>

      </div>

    </header><!-- End Header --> 
    `
  }
  
  
 



}