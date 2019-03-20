const Koa = require('koa')
const {port2} = require('./config.js')
const router = require('./router.js')
const bodyparser = require('koa-bodyparser')
const static = require('koa-static')
const request = require('request')

const app = new Koa()

const userData = {
    method:'loginSystem',
    userName:'12345677',
    pwd:'12345688',
    customType:1
}

const opt = {
    host:'http://www.gps165.com',
    method: 'get',
    path: '/MobileApi/MobileService.ashx?method=loginSystem&userName=DFDQFDYXGS&pwd=123123123123&customType=1',
    headers: {
        "Content-Type": 'application/json',
    }
}

request(opt.host+opt.path, (error, response, body) => {
    console.log('body', body);
    if(body.Success){
        console.log('body', body);
    }
})

app.use(async (ctx,next) => {
    ctx.set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,Content-Length, Authorization, Accept,X-Requested-With",
        "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS",
        // "Content-Type": "application/json;charset=utf8"
    })
    if(ctx.req.method == 'OPTIONS'){
        ctx.body = {}
    }else{
        await next()
    }
})

app.use(static(__dirname+'/static'))
app.use(bodyparser())
app.use(router.routes())

app.listen(port2, () => {
    console.log(`启动服务器,端口：${port2}`);
})
