const Router = require('koa-router')
const router = new Router()
const {userData, carName} = require('./config.js')
const {requestData} = require('./request.js')
const event = require('./event.js')

let websocket1 = null
let websocket2 = null

router.all('/updatefarm', ctx => {
    websocket1 = ctx.websocket
    ctx.websocket.on('open', data => {
        console.log('lianjie1');
    })
    ctx.websocket.on('message', data => {
        console.log(data);
    })
    ctx.websocket.on('close', e => {
        console.log('updatefarm close');
        websocket1 = null
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
    ctx.websocket.on('close', e => {
        console.log('updateturbine close');
        websocket2 = null
    })
})

router.all('/getCarList',  ctx => {
    console.log(userData);
    var timer = null
    ctx.websocket.on('message', async e => {
        console.log(e);
        if(e){
            const url = `http://${userData.WebServer}/MobileApi/MobileService.ashx?method=getMyDevicesInfo&customID=${userData.customID}&serviceKey=${userData.servceKey}&customType=1`
            const obj = await requestData(url)
            let webStatus = true
            let _data = []

            for(var item in obj){
                if(item.indexOf(carName) != -1){
                    _data.push(obj[item])
                }
            }

            
            async function getCar(data){
                let arr = []

                for(let j=0;j<data.length;j++){
                    for(let i=0;i<_data.length;i++){
                        if(data[j] == _data[i].VehicleNO){
                            const url = `http://${userData.WebServer}/MobileApi/MobileService.ashx?method=getDeviceGpsInfo&terminalID=${_data[i].TerminalID}&mapType=G_MAP&serviceKey=${userData.servceKey}`
                            const obj = await requestData(url)
                            obj.name = data[j]
                            arr.push(obj)
                            if(j == data.length-1 && webStatus){
                                return ctx.websocket.send(JSON.stringify(arr))
                            }
                        }
                    }
                }
            }
            const data = JSON.parse(e)
            getCar(data)
            timer = setInterval(function(){
                getCar(data)
            },20000)
        }
    })
    ctx.websocket.on('close', e => {
        console.log('upcar close');
        webStatus = false
        if(timer)
        clearInterval(timer)
    })
})

event.on('updatefarmlist', data => {
    console.log('1 >>>>>',data);
    if(websocket1){
        websocket1.send(data)
    }
})
event.on('updateturbinelist', data => {
    console.log('2 >>>>>',data);
    if(websocket2){
        websocket2.send(data)
    }
})
event.on('closeWind', data => {
    console.log('3 >>>>>',data);
    if(websocket2){
        websocket2.send('{"type":true}')
    }
})
event.on('closeRegion', data => {
    console.log('4 >>>>>',data);
    if(websocket1){
        websocket1.send('{"type":true}')
    }
})

module.exports = router