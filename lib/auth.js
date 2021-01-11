module.exports = {
  isOwner:function(request, response) {
      if (request.session.is_logined) {
          return true;
      } else {
          return false;
      }
  },
  statusUI:function(request, response) {
      var authStatusUI = '<li><a href="/auth/login">로그인</a></li><li><a href="/auth/register">회원가입</a></li>'
      if (this.isOwner(request, response)) {
          authStatusUI = `<li><a href="/auth/logout">로그아웃</a></li><li><a href="/userInfo/myPage">내정보</a></li>`;
      }
      return authStatusUI;
  }
} 