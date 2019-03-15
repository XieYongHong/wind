const Router = require('koa-router')
const router = new Router()
const net = require('net');
const {port, host} = require('./config.js')

const client = net.Socket()

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
    client.write(JSON.stringify(data))
}

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
        data: JSON.parse(data)
    }  
})

const revied = () => {
    return new Promise((resolve, reject) => {
        client.on('data', data => {
            console.log(data.toString())
            resolve(data.toString())
        })
    })
}

module.exports = router