
var express = require('express');
var router = express.Router();
var template = require('../views/template/template.js');
var auth = require('../lib/auth');
var mysql = require('mysql');

var dbConn = require('../lib/dbConn');


var db = dbConn.balsongyeeDb(mysql);


router.get('/sendResult', function(req, res){
  var feedback = '';
  var header = template.header(feedback, auth.statusUI(req,res)); 
  var footer = template.footer(); 
  res.render('sendResult', {
            header: header,
            footer: footer
          });    
})

router.get('/cash', function(req, res){
  if(auth.isOwner(req,res)){
    var feedback = '';
    var header = template.header(feedback, auth.statusUI(req,res)); 
    var footer = template.footer();  
    res.render('cash', {
              header: header,
              footer: footer
            }); 
  }else{
    
    //req.session.flash = {'error':'로그인 후 이용해주세요'}
    
      
    req.flash('error', '로그인 후 이용해주세요')
    res.redirect('/auth/login');
  }
     
})

router.get('/address', function(req, res){
  var feedback = '';
  var header = template.header(feedback, auth.statusUI(req,res)); 
  var footer = template.footer(); 
  res.render('address', {
            header: header,
            footer: footer
          });    
})





module.exports = router;