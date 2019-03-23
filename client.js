const net = require('net');
const client = net.Socket()
const {
    port,
    port2,
    host
} = require('./config.js')

const event = require('./event.js')

let length = 0
let bufLength = 0
let bufString = ''

client.on('connect', () => {

})


client.on('end', () => {
    console.log('data end')
})

client.on('error', (e) => {
    console.log('error', e)
})
client.on('close', (e) => {
    console.log('close')
    client.setTimeout(10000, function() {
        client.connect(port, host);
    })
})
client.connect(port, host, () => {
    console.log('connection');
    // client.write('{"one":123}')
})
client.on('data', data => {
    try {
        if(data.length == 4){
            bufLength = 0
            bufString = ''
            return length = parseInt(data.toString('hex'), 16)
        }
        if(data.length != 4){
            const buf1 = Buffer.from(data)
            bufLength += data.length
            const data2 = buf1.toString()
            bufString += data2
            if(bufLength == length){
                var obj = JSON.parse(bufString)
                if(!obj){
                    resolve({})
                }
                if(!obj.mode){
                    event.emit('routerData', bufString)
                }else if(obj.mode == 'getaddr'){
                    send({url:`localhost:${port2}/regionMap`})
                }else if(obj.mode == 'updatefarmlist'){
                    event.emit('updatefarmlist', bufString)
                }else if(obj.mode == 'updateturbinelist'){
                    event.emit('updateturbinelist', bufString)
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
})

const send = data => {
    let a =  Buffer.from(JSON.stringify(data))
    const buf1 = Buffer.alloc(4 + a.length);
    buf1[3] = a.length
    buf1.write(JSON.stringify(data),4,a.length)
    console.log(buf1.toString());
    client.write(buf1)
}

module.exports = client