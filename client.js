const net = require('net');
const client = net.Socket()
const {
    port,
    host
} = require('./config.js')

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

module.exports = client