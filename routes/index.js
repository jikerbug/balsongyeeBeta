var express = require('express');
var router = express.Router();
var template = require('../views/template/template.js');
var auth = require('../lib/auth');
const path = require("path");



///요 아래의 get, post이런게 바로 라우트 방식이다

/*
router.get('/', function(req, res){
  var flashMsg = req.flash();
  var feedback = '';
  if(flashMsg.info){
    feedback = '<div style="color:red; margin:10px;"><h5>로그인 후 사용가능합니다</h5></div>';
  }
  var html = template.html(feedback, auth.statusUI(req,res)); 
  res.send(html);
})
*/

router.get('/', function(req, res){
  var feedback = '';
  var header = template.header(feedback, auth.statusUI(req,res)); 
  res.render('index', {
            header: header,
            length: 5
        });
});

router.get('/services', function(req, res){
  var feedback = '';
  var header = template.header(feedback, auth.statusUI(req,res)); 
  res.render('services', {
            header: header,
            length: 5
        });
})

router.get('/test', function(req, res){
  res.render('test', {
            title: "<h1>MY HOMEPAGE</h1>",
            length: 5
        });
})



module.exports = router;