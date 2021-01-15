module.exports = {
  encryptPasswd:function(passwd) {
    var bcrypt = require('bcryptjs');
    var saltRounds = 10;

    bcrypt.genSalt(saltRounds, function(err, salt) {
      if(err) return next(err);
      
      bcrypt.hash(passwd, salt, function(err, hash) {
          // Store hash in your password DB.
          if(err) return next(err);
          return hash;
      });
    });
  },
  compPasswd:function(passwd, dbpasswd) {
    var bcrypt = require('bcryptjs');
    bcrypt.compare(passwd,dbpasswd, function(err,result) {
      if(result){
        return true;
      }else{
        return false;
      }
    })
    
  }

}