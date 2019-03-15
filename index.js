const Koa = require('koa')
const app = new Koa()
const {port2} = require('./config.js')
const router = require('./router.js')
const bodyparser = require('koa-bodyparser')

app.use(async (ctx,next) => {
    ctx.set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,Content-Length, Authorization, Accept,X-Requested-With",
        "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS",
        "Content-Type": "application/json;charset=utf8"
    })
    if(ctx.req.method == 'OPTIONS'){
        ctx.body = {}
    }else{
        await next()
    }
})


app.use(bodyparser())
app.use(router.routes())

app.listen(port2, () => {
    console.log(`启动服务器,端口：${port2}`);
})
