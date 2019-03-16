const Router = require('koa-router')
const router = new Router()
const net = require('net');
const {port, host} = require('./config.js')
const fs = require('fs')
const path = require('path')
const buffer = require('buffer')
const http = require('http')

const client = net.Socket()

const userData = {
    method:'loginSystem',
    userName:'12345677',
    pwd:'12345688',
    customType:1
}

const opt = {
    host:'www.gps165.com',
    method: 'get',
    path: '/MobileApi/MobileService.ashx',
    headers: {
        "Content-Type": 'application/json',
    }
}

client.connect(port, host, () => {
    console.log('connection');
    // client.write('{"one":123}')
})

client.on('end', () => {
    console.log('data end')
})

client.on('error', () => {
    console.log('error')
})

const send = data => {
    let a =  Buffer.from(JSON.stringify(data))
    const buf1 = Buffer.alloc(4 + a.length);
    buf1[3] = a.length
    buf1.write(JSON.stringify(data),4,a.length)
    client.write(buf1)
}

router.get('/login', async ctx => {
    var body =''
    var req = http.request(opt, res => {
        res.on('data', data => {
            body += data
            console.log(data);
        }).on('end', () => {
            console.log(body);
        })
    }).on('error', e => {
        console.log(e);
    })
    
    ctx.body = {

    }
})

router.get('/regionMap', ctx => {

    ctx.body = render('regionMap',{
        title:'test'
    })
})

router.get('/getWindMarker', async ctx => {
    send({path:'getWindMarker'})

    const data = await revied()

    return ctx.body = {
        msg: '成功',
        code: 200,
        data: JSON.parse(data)
    }  
})

router.get('/getAreaMarker', async ctx => {
    send({path:'getAreaMarker'})

    const data = await revied()

    return ctx.body = {
        msg: '成功',
        code: 200,
        data: JSON.parse(data)
    }  
})

router.get('/getWorkOrder', async ctx => {
    send({path:'getWorkOrder'})

    const data = await revied()

    return ctx.body = {
        msg: '成功',
        code: 200,
        data: data
    }  
})

const revied = () => {
    return new Promise((resolve, reject) => {
        client.on('data', data => {
            console.log('>>>>',data.toString())
            resolve(data)
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