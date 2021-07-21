// 存放个人中心相关的四个接口
const express = require('express');
const db = require('../db');
const router = express.Router();
/*  
=====获取用户信息
请求方式：get
接口地址：/my/user/info
参数：无
*/
router.get('/userinfo',(req,res)=>{
    // console.log(req.user);{ id: 8, iat: 1626711541, exp: 1626718741 }
    db(`select * from user where id=${req.user.id}`,(err,result)=>{
        if (err) throw err;
        res.send({
            status:0,
            message:'获取成功',
            data:result[0]
        })
    })
})
/* 
====更新用户信息
请求方式：post
接口地址：/my/user/userinfo
参数：qq nickname id
Contemt-Type: application/x-www-form-urlencoded
请求体:email [nickname | id
*/
router.post('/userinfo',(req,res)=>{
    // console.log(req.body);{ nickname: 'yaofen', qq: '2498638403', id: '99' }
    const {nickname,id,qq}=req.body;
    // if(id!==req.user.id) return res.send({status:1,message:'没有权限'})
    db(`update user set nickname='${nickname}',qq='${qq}' where id=${id}`,(err,result)=>{
        if(err) throw err;
        res.send({status:1,message:'更新成功'});
    })
})
/* 
====更换头像
请求方式：post
接口地址：/my/user/avatar
请求体：avatar
Contemt-Type: application/x-www-form-urlencoded
*/
// ？不知道为什么收不到apipost发来的请求
router.post('/avatar',(req,res)=>{
    console.log(req.body);
    // db(`update user set user_pic='${req.body.avatar} where id=${req.user.id}`,(err,result)=>{
    //     if(err) throw err;
    //     res.send({status:1,message:'头像更换成功'})
    // })
})
/* 
====重置密码
请求方式：
接口地址：/my/user/
参数：
*/

module.exports = router;