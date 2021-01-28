
const mysql = require("mysql2");
const dbsecret = require("./config/db.json"); //git에 올릴 때 비밀번호가 유출되지 않게 하기 위해 //db.json이라는 파일에서 mysql 정보를 가져옵니다.
const pool = mysql.createPool(
  dbsecret                                           
);
module.exports = pool;

//desecret은 gitignore로 설정하기!