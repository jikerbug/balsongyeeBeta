module.exports = {
  balsongyeeDb:function(mysql) {
    var db = mysql.createConnection({
      host     : 'localhost',
      port     : '3308',
      user     : 'root',
      password : 'Ih336449!',
      database : 'balsongyee',
      multipleStatements : true
    });
    db.connect();
    return db;
  }
} 