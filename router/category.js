// 存放分类相关的接口
const express = require('express');
const db = require('../db');
const router = express.Router();

// 获取分类接口
router.get('/list',(req,res)=>{
    db(`select * from category`,(err,result)=>{
        if(err) throw err;
        res.end({status:0,message:'获取分类成功',data:result})
    })
})
// 删除分类接口
// 参数：id，类型：查询字符串格式 
router.get('/delete',(req,res)=>{
    // 使用req.query来接受get请求的查询字符串格式的参数
    db(`delete from category where id=${req.query.id}`,(err,result)=>{
        if(err) throw err;
        res.end({status:0,message:'删除分类成功'})
    })
})
module.exports = router;