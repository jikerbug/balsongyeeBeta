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
  }
 



}