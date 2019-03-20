const Router = require('koa-router')
const router = new Router()
const client = require('./client')
const {userData, carName} = require('./config.js')
const request = require('request')

let websocket1 = websocket2 = null

router.all('/updatefarm', ctx => {
    websocket1 = ctx.websocket
    ctx.websocket.on('open', data => {
        console.log('lianjie1');
    })
    ctx.websocket.on('message', data => {
        console.log(data);
    })
})

router.all('/updateturbine', ctx => {
    websocket2 = ctx.websocket
    ctx.websocket.on('open', data => {
        console.log('lianjie2');
    })
    ctx.websocket.on('message', data => {
        console.log(data);
    })
})

router.all('/getCarList', async ctx => {
    console.log(userData);
    const url = `http://${userData.WebServer}/MobileApi/MobileService.ashx?method=getMyDevicesInfo&customID=${userData.customID}&serviceKey=${userData.servceKey}&customType=1`
    const obj = await requestData(url)
    let _data = null

    for(var item in obj){
        if(item.indexOf(carName) != -1){
            _data = obj[item]
        }
    }

    setInterval(function(){
        getCar()
    },20000)
    
    async function getCar(){
        let arr = []
        for(let i=0;i<_data.length;i++){
            const url = `http://${userData.WebServer}/MobileApi/MobileService.ashx?method=getDeviceGpsInfo&terminalID=${_data[i].TerminalID}&mapType=G_MAP&serviceKey=${userData.servceKey}`
            const obj = await requestData(url)
            console.log(i,obj);
            arr.push(obj)
            if(i == _data.length-1){
                ctx.websocket.send(JSON.stringify(arr))
            }
        }
    }
    getCar()
})

client.on('data', data => {
    if(data.length != 4){
        const data2 = data.toString()
        const obj = JSON.parse(data2)
        if(obj.mode == 'updatefarmlist'){
            websocket1.send(data2)
        }else if(obj.mode == 'updateturbinelist'){
            websocket2.send(data2)
        }
    }
})

const requestData = url => {
    return new Promise((resolve, reject) => {
        request(url, (error, response, body) => {
            var data = JSON.parse(body)
            if(data){
                resolve(data)
            }
        })
    })
}
module.exports = router