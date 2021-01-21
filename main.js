const express = require('express');
const app = express();
const ejs = require('ejs');
//const helmet = require("helmet");
app.set('view engine', 'ejs');
app.set('views', ['./views', './views/userInfo']);



var flash = require('connect-flash');
var session = require('express-session');
const LowdbStore = require('lowdb-session-store')(session);
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('./sessions/db.json', { defaultValue: [] });
const db = lowdb(adapter);


//use:사용자의 요청이 있을때마다 실행하도록 약속되어있음
app.use(express.urlencoded({ extended: true }))

//app.use(helmet());


app.use('/auth', express.static('ui')); //이렇게 해야 라우터에서도 ui에서 가져올 수 있다!
app.use('/auth/login', express.static('ui'));
app.use('/auth/register', express.static('ui'));

app.use('/sendMsg', express.static('ui'));

app.use('/userInfo', express.static('ui'));

app.use('/userInfo/cash', express.static('ui'));
app.use('/userInfo/myPage', express.static('ui'));

app.use('/sendResult', express.static('ui'));
app.use('/sendResult/detail', express.static(__dirname + '/ui'));
//dirname쓰는게 더 안전하다는데? 이건 조사해보기



app.use('/', express.static('ui')); //static을 무조건 ui에서 가져오는 거다
//이게 세션 아래에 있으면 static을 가져올때마다 desiralize가 실행되기때문에 위로 가야한다!




app.use(session({
  //HttpOnly:true,
	secret: 'eshfk534$#%#$ggwefw', //소스코드에 포함시키지 말고 별도의 파일로 빼기(변수처리)
  store: new LowdbStore(db, {
    ttl: 86400
  }),
	resave: false,
  saveUninitialized: true, //세션을 사용할때만 실행시켜서 서버에 부담 줄임
  
}));

app.use(flash());

//form-data가져오는 (이미지 전송위해) 라이브러리 
//왜인지모르겠지만 로그인 안되는 문제 발생 -> sendMsg/processMms에서만 쓰자 / 추후에 문제생기면 multiparty쓰기
//const formidableMiddleware = require('express-formidable');
//app.use('/sendMsg/processMms', formidableMiddleware());
//app.use(formidableMiddleware({
//  uploadDir: './userSendImg',
//}));



var authRouter = require('./routes/auth');
var indexRouter = require('./routes/index');
var sendMsgRouter = require('./routes/sendMsg');
var userInfoRouter = require('./routes/userInfo');
var sendResultRouter = require('./routes/sendResult');


///이게 session뒤에 있어야 적용된다!!!
app.use('/auth', authRouter); 
app.use('/sendMsg', sendMsgRouter); 
app.use('/userInfo', userInfoRouter); 
app.use('/sendResult', sendResultRouter); 
app.use('/', indexRouter); 




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


