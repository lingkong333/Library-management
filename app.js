const express = require('express')
const app = express()
const port = 3006

app.listen(port, () => console.log(`Example app listening on port port!`))

// 使用express-jwt进行身份认证 token
const jwt = require('express-jwt');
// jwt() 用于解析token，并将token呆存的数据赋值给req.user
// unless() 完成身份认证
app.use(jwt({
    secret:'qw333ert',//生成token时的钥匙，需统一
    algorithms:['HS256']//加密算法，无需了解
}).unless({ 
    path:[ '/api/login','/api/reguser'] //除这两个接口，别的都需要认证
}))

//接受查询字符串格式请求体,接受客户端的提交的请求体，并赋值给req.body
// 只能处理Contemt-Type: application/x-www-form-urlencoded 类型的请求体
app.use(express.urlencoded({extended:true}));

// 加载自定义路由模块，注册中间件
const loginRouter = require('./router/login');
app.use('/api',loginRouter)

app.use('/my/user',require('./router/user'))

app.use('/my/category',require('./router/category'))

app.use('/my/article',require('./router/article'))

// 错误处理中间件
app.use((err,req,res,next)=>{
    if (err.naem==='UnauthorizedError') {
        res.status(401).send({status:1,message:'身份认证失败！  '})
    }
})

