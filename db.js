// 完成对mysql模块的封装
function db(sql, callback) {
  let mysql = require("mysql");
  let conn = mysql.createConnection({
    host: "localhost", //主机地址
    user: "root", //用户名
    password: "root", //密码
    // 指定数据库
    database: "sy123",
  });

  // 连接到mysql
  conn.connect();

  // 完成增删改查
  //conn.query('sql语句'，(err,result)=>{})
  conn.query(sql, callback);

  // 关闭连接
  conn.end();
}

module.exports=db;
