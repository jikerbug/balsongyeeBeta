var express = require('express');
var router = express.Router();

var auth = require('../lib/auth');
var template = require('../lib/template.js');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);



var options = {
	host: 'localhost',
	port: 3308,
	user: 'root',
	password: 'Ih336449!',
	database: 'session_test'
};

var sessionStore = new MySQLStore(options);





router.get('/login', function(request, response){
  var login = template.login();
  var html = template.html(login); 
  response.send(html);
});

/* //얘를 passport버전으로 바꿔줄거다!
router.post('/login_process', function (request, response) {
  var post = request.body;
  var email = post.email;
  var password = post.pwd;
  if(email === authData.email && password === authData.password){
    
    request.session.is_logined = true;
    request.session.nickname = authData.nickname;
    request.session.save(function(){ //save가 완료가 된뒤에 redirect를 해주기 때문에, 혹시모를 상태정보가 꼬일일을 막아준다
      response.redirect(`/`);
    });
  } else {
    response.send('Who?');
  }
  
});
*/
router.get('/logout', function (request, response) {
  request.session.destroy(function(err){
    response.redirect('/');
  });
});

module.exports = router; 