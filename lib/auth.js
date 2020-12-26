module.exports = {
  isOwner:function(request, response) {
      if (request.session.is_logined) {
          return true;
      } else {
          return false;
      }
  },
  statusUI:function(request, response) {
      var authStatusUI = '<a class="nav-link" href="/auth/login">로그인</a>'
      if (this.isOwner(request, response)) {
          authStatusUI = `<a class="nav-link" href="/auth/logout">로그아웃</a>`;
      }
      return authStatusUI;
  }
} 