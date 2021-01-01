module.exports = {
  isOwner:function(request, response) {
      if (request.user) { //로그인 되어있을 경우에만 user객체가 있을것(deserialize를 통해!)
          return true;
      } else {
          return false;
      }
  },
  statusUI:function(request, response) {
      var authStatusUI = '<li><a href="/auth/login">로그인</a></li><li><a href="/auth/register">회원가입</a></li>'
      if (this.isOwner(request, response)) {
          authStatusUI = `<li><a href="/auth/logout">로그아웃</a></li>`;
      }
      return authStatusUI;
  }
} 