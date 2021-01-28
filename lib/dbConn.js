module.exports = {
  balsongyeeDbOld:function(mysql) {
    var db = mysql.createConnection({
      host     : 'localhost',
      port     : '3308',
      user     : 'root',
      password : 'Ih336449!',
      database : 'balsongyee2',
      multipleStatements : true
    });
    db.connect();
    return db;
  },
  balsongyeeDb:function(mysql) {
    var db = mysql.createPool({
      host: 'localhost',
      port     : '3308',
      user     : 'root',
      password : 'Ih336449!',
      database : 'balsongyee2',
      multipleStatements : true,
      waitForConnections: true,
      connectionLimit: 10, //https://devbox.tistory.com/entry/JSP-%EC%BB%A4%EB%84%A5%EC%85%98-%ED%92%80-1
      queueLimit: 0
    });
    return db;
  }
} 