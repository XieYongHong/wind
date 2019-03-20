const Router = require('koa-router')
const router = new Router()
const fs = require('fs')
const iconv = require('iconv-lite')
const client = require('./client')

const send = data => {
    let a =  Buffer.from(JSON.stringify(data))
    const buf1 = Buffer.alloc(4 + a.length);
    buf1[3] = a.length
    buf1.write(JSON.stringify(data),4,a.length)
    console.log(buf1.toString());
    client.write(buf1)
}

//返回页面
router.get('/regionMap', async ctx => {
    ctx.set({'Content-Type':'text/html'})
    const data = await pageHtml('regionMap')
    ctx.body = data
})

router.get('/windMap', async ctx => {
    ctx.set({'Content-Type':'text/html'})
    const data = await pageHtml('windMap')
    ctx.body =  data
})

router.post('/map', async ctx => {
    var data = ctx.request.body
    send({url:`localhost/windMap?id=${data.id}&lng=${data.lng}&lat=${data.lat}`})
    return ctx.body = {
        msg: '成功',
        code: 200
    }  
})

// 数据请求接口
router.get('/getAreaList', async ctx => {
    send({mode:'area'})

    const data = await revied()
    return ctx.body = {
        msg: '成功',
        code: 200,
        data: JSON.parse(data)
    }  
})

router.get('/getWorkOrder/:id', async ctx => {
    var id = ctx.params.id
    send({mode:'farm',id:id})
    const data = await revied()
    return ctx.body = {
        msg: '成功',
        code: 200,
        data: JSON.parse(data)
    }  
})

const revied = () => {
    return new Promise((resolve, reject) => {
        client.on('data', data => {
            if(data.length != 4){
                const data2 = data.toString()
                // console.log(data2);
                try {
                    var obj = JSON.parse(data2)
                } catch (error) {
                    console.log(error);
                }
                if(obj.mode == 'getaddr'){
                    send({url:'localhost/regionMap'})
                }else if(!obj.mode){
                    resolve(data2)
                }
            }
        })
    })
}

const pageHtml = url => {
    return new Promise((resolve, reject) => {
        fs.readFile(`./static/${url}.html`,function readData(err,data){
            resolve(data)
        })
    })
}


module.exports = router
