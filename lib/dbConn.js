module.exports = {
  balsongyeeDb:function(mysql) {
    var db = mysql.createConnection({
      host     : 'localhost',
      port     : '3308',
      user     : 'root',
      password : 'Ih336449!',
      database : 'balsongyee',
      multipleStatements : true
    });
    db.connect();
    return db;
  },
  statusUI:function(request, response) {
      var authStatusUI = '<li><a href="/auth/login">로그인</a></li><li><a href="/auth/register">회원가입</a></li>'
      if (this.isOwner(request, response)) {
          authStatusUI = `<li><a href="/auth/logout">로그아웃</a></li><li><a href="/userInfo/cash">내정보</a></li>`;
      }
      return authStatusUI;
  }
} 