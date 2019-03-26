const Koa = require('koa')
const {port2} = require('./config.js')
const bodyparser = require('koa-bodyparser')
const static = require('koa-static')
const {login} = require('./request.js')
const websocket = require('koa-websocket')
const router = require('./router.js')
const webRouter = require('./websocket.js')
const client = require('./client')

const app = websocket(new Koa())

login()

app.use(static(__dirname+'/static'))
app.use(bodyparser())
app.ws.use(webRouter.routes())
app.use(router.routes())

app.listen(port2, () => {
    console.log(`启动服务器,端口：${port2}`);
})
