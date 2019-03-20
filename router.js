const Router = require('koa-router')
const router = new Router()
const net = require('net');
const {port, host} = require('./config.js')
const fs = require('fs')
const path = require('path')
const buffer = require('buffer')
const client = net.Socket()





client.connect(port, host, () => {
    console.log('connection');
    // client.write('{"one":123}')
})

client.on('end', () => {
    console.log('data end')
})

client.on('error', (e) => {
    console.log('error',e)
})

const send = data => {
    let a =  Buffer.from(JSON.stringify(data))
    const buf1 = Buffer.alloc(4 + a.length);
    buf1[3] = a.length
    buf1.write(JSON.stringify(data),4,a.length)
    console.log(buf1.toString());
    client.write(buf1)
}

router.get('/regionMap', ctx => {

    ctx.body = render('regionMap',{
        title:'test'
    })
})

router.get('/getWindList', async ctx => {
    send({mode:'getWindList'})

    const data = await revied()

    return ctx.body = {
        msg: '成功',
        code: 200,
        data: JSON.parse(data)
    }  
})

router.get('/getAreaList', async ctx => {
    send({mode:'area'})

    const data = await revied()

    return ctx.body = {
        msg: '成功',
        code: 200,
        data: JSON.parse(data)
    }  
})

router.get('/getWorkOrder', async ctx => {
    send({mode:'turbine'})

    const data = await revied()
    // ctx.set({
    //     "Content-Type": "application/json;charset=utf8"
    // })
    console.log('turbine',data);
    return ctx.body = {
        msg: '成功',
        code: 200,
        data: JSON.parse(data)
    }  
})

const revied = () => {
    return new Promise((resolve, reject) => {
        client.on('data', data => {
            console.log(data);
            const data2 = data.toString('utf8',4)
            console.log('data',data2)
            resolve(data2)
        })
    })
}

const KoaRequest = ctx => {
    return new Promise((resolve, reject) => {
        ctx.request({
            host:'http://www.gps165.com',
            method: 'get',
            path: '/MobileApi/MobileService.ashx',
            headers: {
                "Content-Type": 'application/json',
            }
        }, res => {

        })
    })

}

module.exports = router
