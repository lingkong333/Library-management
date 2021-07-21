// 存放文章相关的接口
const moment = require('moment');
const express = require("express");
const router = express.Router();
const db = require('../db');
// 获取文章接口
/* 
请求方式:GET
请求的url: /my / article/list请求参数:
- pagenum --页码值
- pagesize --每页显示多少条数据- cate_id --文章分类的Id
- state --文章的状态，可选“草稿”或“已发布”
*/
router.get("/list", (req, res) => {
  //console.log(req. query);
  //设置变量，接收请求参数
  let { pagenum, pagesize, cate_id, state } = req.query;
  // console.log(cate_id,state);
  //根据cate_id 和state制作SQL语句的条件
  let w = "";
  if (cate_id) {
    w += `and cate_id=${cate_id}`;
  }
  if (state) {
    w += `and state='${state}'`;
  }
  //分页查询数据的SQL(该SQL用到了连表查询，并且使用了很多变量组合)
  let sql1 = `select a.id,a.title，a.state，a.pub_date，c.name cate_name from 
    article a join category c on a.cate_id=c.id
    where author_id=${req.user.id} and is_delete=0 ${w}limit ${
    (pagenum - 1) * pagesize
  }, ${pagesize}`;
  //查询总记录数的SQL，查询条件和前面查询数据的条件必须要一致
  let sql2 = `select count(*) total from article a 
    join category c on a.cate_id=c.id
    where author_id=${req.user.id} and is_delete=0 ${w}`;
  //分别执行两条SQL(因为db查询数据库是异步方法，必须嵌套查询)
  db(sql1, (err, result1) => {
    if (err) throw err;
    db(sql2, (e, result2) => {
      if (e) throw e;
      res.send({
        status: 0,
        message: "获取文章列表数据成功",
        data: result1,
        total: result2[0].total,
      });
    });
  });
});

// 添加文章接口
/* 
接口地址:/my/ article/add
请求方式:POST
请求体:title l content l cate_id ! state ! cover_img
Content-Type: multipart/form-data
*/
const multer = require('multer');
const upload = multer({dest:"uploads/"})//配置上传文件的目录
let { title, content, cate_id, state } = req. body;
let filename = req.file.fieldname;
let pub_date=moment().format('YYYY-MM-DD')
// 数据表article中要求添加的字段，必须填
let sql = `insert into article set title='${title}',content='${content}', cover_img='${filename}',
cate_id=${cate_id},state='${state}',author_id=${author_id},pub_date=${pub_date}`;
router.post('/add',upload.single('cover_img'),(req,res)=>{
    // console.log(req.body);客户端上传的文本信息
    db(sql,(err,result)=>{
        if(err) throw err;
        res.end({status:0,message:'添加文章成功'})
    })
})

// 删除文章接口
/* 请求方式:GET
    接口地址:/my/article/delete/ 2
    请求参数:id,url参数
 */
router.get('/delete/:id',(req,res)=>{
    // 通过req.parmas来获取url参数
    db(`delete from article where id=${req.params.id}`,(err,result)=>{
        if(err) throw err;
        res.send({status:0,message:'文章删除成功'})
    })
})
module.exports = router;
