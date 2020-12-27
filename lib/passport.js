module.exports = function(app,db){

  var authData = {
    email: 'mrimc@naver.com',
    password: '3456',
    nickname: 'mrimc'
  }   

  var passport = require('passport') //passport 관련코드는 세션을 활용하기 때문에 반드시 뒤에 있어야함!(사실 require는 상관x)
    , LocalStrategy = require('passport-local').Strategy;

  app.use(passport.initialize());
  app.use(passport.session());


  //로그인 성공에 대한 정보를 session에 저장
  passport.serializeUser(function(user, done) { 
    console.log(user.email);
    done(null, user.email); 
  });

  //로그인 성공후 사용자의 페이지 방문 마다 실행(사용자가 로그인 성공한 사용자인지 체크 -> 필요한 정보 조회)
  //request에 user라는 정보를 주입해준다
  passport.deserializeUser(function(id, done) { 
    console.log(id);
    //db.query('select id from user where id = ?', [id], function (error, results, fields) {
    done(null, id); 
    //});
    
  }); 


  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'pwd'
    },
    function (username, password, done) {
      console.log('LocalStrategy', username, password);  

      db.query('select email,pwd from user where email = ?', [username], function (error, results, fields) {
        console.log(results[0])
        if(results[0]){
          console.log(1);
          if(password === results[0].pwd){
            console.log(2);
            return done(null, results[0]);
          } else {
            console.log(3);
            return done(null, false, {
              message: '비밀번호가 일치하지 않습니다'
            });
          }
          return done(null, user);
        } else {
          console.log(4);
          return done(null, false, {
            message: '존재하지 않는 아이디입니다'
          });
        }
      });
      
    }
  ));
    
  return passport;
}

