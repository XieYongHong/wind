const Koa = require('koa')
const {port2, userData} = require('./config.js')
const bodyparser = require('koa-bodyparser')
const static = require('koa-static')
const request = require('request')
const websocket = require('koa-websocket')
const router = require('./router.js')
const webRouter = require('./websocket.js')
const client = require('./client')

const app = websocket(new Koa())

const opt = {
    host:'http://www.gps165.com',
    method: 'get',
    path: '/MobileApi/MobileService.ashx?method=loginSystem&userName=DFDQFDYXGS&pwd=123123123123&customType=1',
    headers: {
        "Content-Type": 'application/json',
    }
}

request(opt.host+opt.path, (error, response, body) => {
    var data = JSON.parse(body)
    if(data.Success){
        userData.customID = data.CustomID
        userData.servceKey = data.ServiceKey
        userData.UserName = data.UserName
        userData.WebServer = data.WebServer
    }
})

app.use(static(__dirname+'/static'))
app.use(bodyparser())
app.use(router.routes())
app.ws.use(webRouter.routes())

app.listen(port2, () => {
    console.log(`启动服务器,端口：${port2}`);
})
