const net = require('net')
const WebSocket = require('ws')
const stringConverter = require('./helper/stringToList')
// Connecting to the TCP-server
const client = new net.Socket();
client.connect(8000, '127.0.0.1', () => {
    console.log('Connected')
})


// creating a websocket to use client-side
const websocket = new WebSocket.Server({ port: 8080 })

websocket.on("connection", ws => {
    client.on('data', (data) => {
        const dataString = data.toString()
        const dataList = stringConverter(dataString)

        console.log(dataList)
        ws.send(dataList)
    })

    client.on('close', () => {
        console.log('Connection closed');
    })


    ws.on("close", () => {
        console.log("disconnected")
    })
})

