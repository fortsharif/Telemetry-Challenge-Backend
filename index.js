const net = require('net')
const WebSocket = require('ws')
const SatelliteOne = require('./modules/satellite-1')
const dbName = 'telemetry.db'
const cors = require('cors')
const express = require('express')
const util = require('./helper/util')



let connect = 0
let epoch

const app = express()

app.use(cors())
app.use(express.json())


app.get("/api/v1/satellite1", async (req, res) => {
    try {
        console.log(1)
        const satelliteOne = await new SatelliteOne(dbName)
        const data = await satelliteOne.getAll()
        console.log(3)
        res.status(200).json(data)
    } catch (err) {
        console.log(err)
    }
})

app.get("/api/v1/satellite1/hour", async (req, res) => {
    try {
        let date = new Date().getTime()
        console.log(parseInt(date / 1000))
        const satelliteOne = await new SatelliteOne(dbName)
        const data = await satelliteOne.getData(parseInt(date / 1000), 60 * 60)
        console.log(3)
        res.status(200).json(data)
    } catch (err) {
        console.log(err)
    }
})

app.get("/api/v1/satellite1/day", async (req, res) => {
    try {
        let date = new Date().getTime()
        console.log(parseInt(date / 1000))
        const satelliteOne = await new SatelliteOne(dbName)
        const data = await satelliteOne.getData(parseInt(date / 1000), 60 * 60 * 24)
        console.log(3)
        res.status(200).json(data)
    } catch (err) {
        console.log(err)
    }
})

app.get("/api/v1/satellite1/week", async (req, res) => {
    try {
        let date = new Date().getTime()
        console.log(parseInt(date / 1000))
        const satelliteOne = await new SatelliteOne(dbName)
        const data = await satelliteOne.getData(parseInt(date / 1000), 60 * 60 * 24 * 7)
        console.log(3)
        res.status(200).json(data)
    } catch (err) {
        console.log(err)
    }
})

app.get("/api/v1/satellite1/minute", async (req, res) => {
    try {
        let date = new Date().getTime()
        console.log(parseInt(date / 1000))
        const satelliteOne = await new SatelliteOne(dbName)
        const data = await satelliteOne.getData(parseInt(date / 1000), 60)
        console.log(3)
        res.status(200).json(data)
    } catch (err) {
        console.log(err)
    }
})







// Connecting to the TCP-server
const client = new net.Socket();
const client2 = new net.Socket()

/* client2.connect(8001, '127.0.0.1', () => {
    console.log('connected binary')
})

client2.on('data', (data) => {
    console.log(data)
    let dataString = util.stringBuilder(data)
    console.log(dataString)

    //converting the buffer to

}) */


// creating a websocket to use client-side
const websocket = new WebSocket.Server({ port: 8081 })
const websocket2 = new WebSocket.Server({ port: 8082 })




websocket.on("connection", ws => {
    console.log('connected to ws')
    if (client.pending) {
        client.connect(8000, '127.0.0.1', () => {
            console.log('Connected')
        })
        console.log("ee")
    }

    client.on('data', async (data) => {

        let dataString = data.toString()
        dataString = dataString.replace("[", "")
        dataString = dataString.replace("]", "")
        newEpoch = util.stringConverter(dataString)[0]


        if (epoch !== newEpoch) {

            console.log(newEpoch + "vs" + epoch)
            try {
                const satelliteOne = await new SatelliteOne(dbName)
                await satelliteOne.storeData(dataString)
            }
            catch (err) {
                console.log(err)
            }
            epoch = newEpoch
            ws.send(dataString)

        }

    })


    client.on('close', () => {
        console.log('Connection closed');
    })

    ws.on("close", () => {

        ws.close(() => {
            console.log("disconnected")
        })
        //client.destroy()
    })
})

websocket2.on("connection", ws => {
    console.log('connected to ws2')
    if (client2.pending) {
        client2.connect(8001, '127.0.0.1', () => {
            console.log('Connected2')
        })
        console.log("ee")
    }
    client2.on('data', async (data) => {

        let dataString = util.stringBuilder(data)
        newEpoch = util.stringConverter(dataString)[0]


        if (epoch !== newEpoch) {
            console.log(`${epoch} vs ${newEpoch}`)
            /* console.log(`${epoch} vs ${newEpoch}`)
            try {
                const satelliteOne = await new SatelliteOne(dbName)
                await satelliteOne.storeData(dataString)
            }
            catch (err) {
                console.log(err)
            } */
            epoch = newEpoch
            ws.send(dataString)

        }

    })

    client2.on('close', () => {
        console.log('Connection2 closed');
    })


    ws.on("close", () => {
        console.log("disconnected2")
        ws.terminate()

    })
})

app.listen(5000, () => {
    console.log("listening on port 5000")
})

