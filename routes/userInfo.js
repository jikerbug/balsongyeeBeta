
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
  res.render('sendResult', {
            header: header,
          });    
})

router.get('/cash', function(req, res){
  var feedback = '';
  var header = template.header(feedback, auth.statusUI(req,res)); 
  res.render('cash', {
            header: header,
          });    
})

router.get('/address', function(req, res){
  var feedback = '';
  var header = template.header(feedback, auth.statusUI(req,res)); 
  res.render('address', {
            header: header,
          });    
})





module.exports = router;