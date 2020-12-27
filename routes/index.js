
var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
var auth = require('../lib/auth');




///요 아래의 get, post이런게 바로 라우트 방식이다

router.get('/', function(req, res){
  var flashMsg = req.flash();
  var feedback = '';
  if(flashMsg.info){
    feedback = '<div style="color:red; margin:10px;"><h5>로그인 후 사용가능합니다</h5></div>';
  }
  var html = template.html(feedback, auth.statusUI(req,res)); 
  res.send(html);
})

module.exports = router;