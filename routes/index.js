var express = require('express');
var router = express.Router();
var template = require('../views/template/template.js');
var auth = require('../lib/auth');
const path = require("path");



router.get('/', function(req, res){

  var feedback = '';

  var header = template.header(feedback, auth.statusUI(req,res)); 
  var footer = template.footer(); 
  res.render('index', {
            header: header,
            footer: footer,
        });
});


router.get('/flash', function(req, res){
  // Set a flash message by passing the key, followed by the value, to req.flash().
  req.flash('error', 'Flash is back!')
  res.redirect('/');
});
 
router.get('/2', function(req, res){
  // Get an array of flash messages by passing the key to req.flash()
  res.send(req.flash('info'));
});

router.get('/services', function(req, res){
  var feedback = '';
  var header = template.header(feedback, auth.statusUI(req,res)); 
  var footer = template.footer(); 
  res.render('services', {
            header: header,
            footer: footer
        });
})

router.get('/test', function(req, res){
  res.render('test', {
            title: "<h1>MY HOMEPAGE</h1>",
            length: 5
        });
})



module.exports = router;