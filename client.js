const net = require('net');
const client = net.Socket()
const {port, host} = require('./config.js')

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

module.exports = client