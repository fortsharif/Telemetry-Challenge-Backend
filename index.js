const net = require('net')
const WebSocket = require('ws')
const SatelliteOne = require('./modules/satellite-1')
const dbName = 'telemetry.db'
const cors = require('cors')
const express = require('express')
const stringConverter = require('./helper/util')

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
        console.log(1)
        const satelliteOne = await new SatelliteOne(dbName)
        const data = await satelliteOne.getAll()
        console.log(3)
        res.status(200).json(data)
    } catch (err) {
        console.log(err)
    }
})

app.get("/api/v1/satellite1/day", async (req, res) => {
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







// Connecting to the TCP-server
const client = new net.Socket();



// creating a websocket to use client-side
const websocket = new WebSocket.Server({ port: 8081 })

websocket.on("connection", ws => {
    console.log('connected to ws')

    client.connect(8000, '127.0.0.1', () => {
        console.log('Connected')
    })
    client.on('data', async (data) => {

        const dataString = data.toString()
        newEpoch = stringConverter(dataString)[0]


        if (epoch !== newEpoch) {

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
        console.log("disconnected")
    })
})

app.listen(5000, () => {
    console.log("listening on port 5000")
})

