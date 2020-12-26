//const { response } = require('express');
//const bodyParser = require('body-parser');
const express = require('express');
const app = express();
//const cookieParser = require('cookie-parser');


var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

var auth = require('./lib/auth');
var template = require('./lib/template.js');
var mysql = require('mysql');

//use:사용자의 요청이 있을때마다 실행하도록 약속되어있음

app.use(express.urlencoded({ extended: true }))
//app.use(cookieParser());




var authRouter = require('./routes/auth');



var options = {
	host: 'localhost',
	port: 3308,
	user: 'root',
	password: 'Ih336449!',
	database: 'session_test'
};

var sessionStore = new MySQLStore(options);

app.use(session({
  HttpOnly:true,
	key: 'session_cookie_name',
	secret: 'session_cookie_secret',
	store: sessionStore,
	resave: false,
	saveUninitialized: false
}));

///이게 session뒤에 있어야 적용된다!!!
app.use('/auth', authRouter); 
/*
var passport = require('passport') //passport 관련코드는 세션을 활용하기 때문에 반드시 뒤에 있어야함!(사실 require는 상관x)
  , LocalStrategy = require('passport-local').Strategy;

app.post('/auth/login_process',
  passport.authenticate('local', {
     successRedirect: '/', failureRedirect: '/auth/login' })
); 
//passport.auth.... 요놈이 callback인 거다


var authData = {
  email: 'mrimc@naver.com',
  password: '3456',
  nickname: 'mrimc'
}   

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});



passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'pwd'
  },
  function (username, password, done) {
    console.log('LocalStrategy', username, password);  
    if(username === authData.email){
      console.log(1);
      if(password === authData.password){
        console.log(2);
        return done(null, authData);
      } else {
        console.log(3);
        return done(null, false, {
          message: 'Incorrect password.'
        });
      }
      return done(null, user);
    } else {
      console.log(4);
      return done(null, false, {
        message: 'Incorrect username.'
      });
    }
  }
));
*/


var db = mysql.createConnection({
  host     : 'localhost',
  port     : '3308',
  user     : 'root',
  password : 'Ih336449!',
  database : 'balsongyee'
});

db.connect();


app.listen(8080, function(){
  console.log("listening on 8080");
});


///요 아래의 get, post이런게 바로 라우트 방식이다

app.get('/', function(req, res){
  var html = template.html('', auth.statusUI(req,res)); 
  //res.cookie('favorite', "choco");
  //res.cookie('permaent', "toxic", {maxAge:60*60*24, httpOnly:true});
  res.send(html);
  
})

app.get('/alert', function(req, res){
  var html = template.html('', auth.statusUI(req,res), template.alert()); 
  //res.cookie('favorite', "choco");
  //res.cookie('permaent', "toxic", {maxAge:60*60*24, httpOnly:true});
  res.send(html);
})

app.post('/process/sendMsgOld', function(req, res){
  if(req.body.passwd == '3456'){
    db.query('insert into test(id) value("' + req.body.msg + '")', function (error, results, fields) {
      if (error) throw error;
      console.log(results[0]);
    });
  }
  console.log(req.body);
  res.sendFile(__dirname + '/htmls/index.html');
})

app.post('/process/sendMsg', function(req, res){
  if(req.body.passwd == '3456'){
    db.query(`INSERT INTO SC_TRAN (TR_SENDDATE, TR_SENDSTAT, TR_MSGTYPE, TR_PHONE, TR_CALLBACK, TR_MSG)
     VALUES (NOW(), '0', '0', '` + req.body.phonenum + `','01071891476','` + req.body.msg + `')`,
      function (error, results, fields) {
      if (error) throw error;
      console.log(results[0]);
    });
  }
  console.log(req.body);
  res.sendFile(__dirname + '/htmls/index.html');
})

app.post('/test', function(req, res){
  console.log(req.body.color);
  res.sendFile(__dirname + '/htmls/sendMsg.html');
})

app.get('/sendMsg', function(req, res){
  if (!auth.isOwner(req, res)) {
    res.redirect('/alert');
    return false;
  }
  var form = template.form();
  var html = template.html(form, auth.statusUI(req,res)); 
  res.send(html);
})