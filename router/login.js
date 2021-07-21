// 登录 注册接口
const db = require("../db");
// md5对密码进行加密
let { md5 } = require("utility");
const jwt = require("jsonwebtoken");
// 1.加载express
const express = require("express");
// 2.创建路由对象，实则是一个函数类型
const router = express.Router();

// 注册中间件必须在这，完成数据验证

router.use((req, res, next) => {
  // 获取uesrName/password
  let { userName, password } = req.body;
  // 验证用户名
  if (!/^[a-zA-Z][0-9a-zA-Z_]{1,9}$/.test(userName)) {
    next("用户名只能包含数字字母下划线，长度为2-10");
  } else if(!/^\S{6,12}$/.test(password)){
    next('密码6-12，不能有空格');
  }else{
      next();
  }
});

// 3.写接口，把接口挂载到router上
/* 
注册接口
请求方式:post
请求地址：/api/reguser
请求体：userName  password
*/
router.post("/reguser", (req, res) => {
  //  console.log(req.body);
  let { userName, password } = req.body;
  password = md5(password); //重新给变量赋值，值为加密后的结果
  //2.判断账号是否被占用
  db(`select * from user where userName="${userName}"`, (err, result) => {
    if (err) throw err;
    // console.log(result);//查询到res是非空数组，未查询到是空数组
    if (result.length > 0) {
      res.send({ status: 1, message: "用户名被占用" });
    } else {
      //3.未占用，添加至数据库
      db(
        `insert into user set userName='${userName}',password='${password}'`,
        (e, r) => {
          if (e) throw e;
          res.send({ status: 0, message: "用户注册成功" });
        }
      );
    }
  });
});
/* 
登录接口
请求方式：post
请求地址：api/login
请求体:userName  password
*/
router.post("/login", (req, res) => {
  let { userName, password } = req.body;
  password = md5(password); //重新给变量赋值，值为加密后的结果
  // 使用用户名和加密后的密码作为查询条件
  db(
    `select * from user where userName="${userName}" and password="${password}"`,
    (err, result) => {
      // console.log(result);
      if (err) throw err;
      if (result.length > 0) {
        // 登陆成功，生成token
        // token保存用户id
        let token ="Bearer " +jwt.sign({ id: result[0].id }, "qw333ert", { expiresIn: "2h" });
        res.send({ status: 0, message: "登录成功", token });
      } else {
        res.send({ status: 1, message: "登录失败" });
      }
    }
  );
});

// 错误处理中间件

router.use((err, req, res, next) => {
  // 错误为前方传来的err
  res.send({ status: 1, message: err });
});

// 4.导出路由对象
module.exports = router;
