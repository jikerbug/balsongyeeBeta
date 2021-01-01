const express = require('express');
const app = express();
const ejs = require('ejs');
//const helmet = require("helmet");
app.set('view engine', 'ejs');
app.set('views', './views');


var flash = require('connect-flash');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var mysql = require('mysql');
var db = mysql.createConnection({
  host     : 'localhost',
  port     : '3308',
  user     : 'root',
  password : 'Ih336449!',
  database : 'balsongyee'
});

db.connect();

//use:사용자의 요청이 있을때마다 실행하도록 약속되어있음

app.use(express.urlencoded({ extended: true }))
//app.use(helmet());

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
	key: 'eshfk534$#%#$ggwefw', //이것도 비밀로 감춰놓든가 해야될거
	secret: 'session_cookie_secret',
	store: sessionStore,
	resave: false,
	saveUninitialized: false
}));
app.use(flash());



var passportModule = require('./lib/passport');
var passport = passportModule(app,db);

app.post('/auth/login_process',
passport.authenticate('local', {
  successRedirect: '/', 
  failureRedirect: '/auth/login',
  failureFlash: true })
); 
//passport.auth.... 요놈이 callback인 거다




var authRouter = require('./routes/auth');
var indexRouter = require('./routes/index');
var sendMsgRouter = require('./routes/sendMsg');


///이게 session뒤에 있어야 적용된다!!!
app.use('/auth', authRouter); 
app.use('/sendMsg', sendMsgRouter); 
app.use('/', indexRouter); 


app.use('/auth', express.static('ui')); //이렇게 해야 라우터에서도 ui에서 가져올 수 있다!
app.use('/sendMsg', express.static('ui'));
app.use('/', express.static('ui')); //static을 무조건 ui에서 가져오는 거다

app.use(function (req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});

app.listen(8080, function(){
  console.log("listening on 8080");
});


