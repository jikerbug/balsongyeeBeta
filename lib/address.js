module.exports = {
  isOwner:function(db,res,groupIdx,req,callback,id) {
    if(id){
      db.query('select userId from address where idx = ?', [groupIdx], function (err, results, fields) {
        if(err) console.log("err : "+err);
        if(results[0]){
          if(results[0].userId == id){
             callback(db,res,groupIdx);
          }else{
            req.flash('error', '접근할 수 없습니다.')
            res.redirect('/');
          } 
        }else{
          req.flash('error', '존재하지 않는 주소록입니다.')
          res.redirect('/');
        }
      });
    }else{
      req.flash('error', '로그인후 이용해주세요')
      res.redirect('/');
    }
    
  }
    
} 