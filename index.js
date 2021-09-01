const net = require('net')
const WebSocket = require('ws')
const SatelliteOne = require('./modules/satellite-1')
const SatelliteTwo = require('./modules/satellite-2')
const dbName = 'telemetry.db'
const cors = require('cors')
const express = require('express')
const util = require('./helper/util')



let connect = 0
let connect2 = 0

let epoch

const app = express()

app.use(cors())
app.use(express.json())


// URI to get all-time data for sat 1
app.get("/api/v1/satellite1", async (req, res) => {
    try {

        const satelliteOne = await new SatelliteOne(dbName)
        const data = await satelliteOne.getAll()

        res.status(200).json(data)
    } catch (err) {
        console.log(err)
    }
})

// URI to get hour data for sat 1
app.get("/api/v1/satellite1/hour", async (req, res) => {
    try {
        let date = new Date().getTime()

        const satelliteOne = await new SatelliteOne(dbName)
        const data = await satelliteOne.getData(parseInt(date / 1000), 60 * 60)
        console.log(3)
        res.status(200).json(data)
    } catch (err) {
        console.log(err)
    }
})

// URI to get day data for sat 1
app.get("/api/v1/satellite1/day", async (req, res) => {
    try {
        let date = new Date().getTime()

        const satelliteOne = await new SatelliteOne(dbName)
        const data = await satelliteOne.getData(parseInt(date / 1000), 60 * 60 * 24)
        console.log(3)
        res.status(200).json(data)
    } catch (err) {
        console.log(err)
    }
})

// URI to get week data for sat 1
app.get("/api/v1/satellite1/week", async (req, res) => {
    try {
        let date = new Date().getTime()

        const satelliteOne = await new SatelliteOne(dbName)
        const data = await satelliteOne.getData(parseInt(date / 1000), 60 * 60 * 24 * 7)

        res.status(200).json(data)
    } catch (err) {
        console.log(err)
    }
})

// URI to get minute data for sat 1
app.get("/api/v1/satellite1/minute", async (req, res) => {
    try {
        let date = new Date().getTime()

        const satelliteOne = await new SatelliteOne(dbName)
        const data = await satelliteOne.getData(parseInt(date / 1000), 60)

        res.status(200).json(data)
    } catch (err) {
        console.log(err)
    }
})

// URI to get all-time data for sat 2
app.get("/api/v1/satellite2", async (req, res) => {
    try {

        const satelliteTwo = await new SatelliteTwo(dbName)
        const data = await satelliteTwo.getAll()

        res.status(200).json(data)
    } catch (err) {
        console.log(err)
    }
})

// URI to get hour data for sat 2
app.get("/api/v1/satellite2/hour", async (req, res) => {
    try {
        let date = new Date().getTime()

        const satelliteTwo = await new SatelliteTwo(dbName)
        const data = await satelliteTwo.getData(parseInt(date / 1000), 60 * 60)

        res.status(200).json(data)
    } catch (err) {
        console.log(err)
    }
})

// URI to get day data for sat 2
app.get("/api/v1/satellite2/day", async (req, res) => {
    try {
        let date = new Date().getTime()

        const satelliteTwo = await new SatelliteTwo(dbName)
        const data = await satelliteTwo.getData(parseInt(date / 1000), 60 * 60 * 24)

        res.status(200).json(data)
    } catch (err) {
        console.log(err)
    }
})

// URI to get week data for sat 2
app.get("/api/v1/satellite2/week", async (req, res) => {
    try {
        let date = new Date().getTime()

        const satelliteTwo = await new SatelliteTwo(dbName)
        const data = await satelliteTwo.getData(parseInt(date / 1000), 60 * 60 * 24 * 7)

        res.status(200).json(data)
    } catch (err) {
        console.log(err)
    }
})

// URI to get minute data for sat 1
app.get("/api/v1/satellite2/minute", async (req, res) => {
    try {
        let date = new Date().getTime()

        const satelliteTwo = await new SatelliteTwo(dbName)
        const data = await satelliteTwo.getData(parseInt(date / 1000), 60)

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
const websocket = new WebSocket.Server({ port: 80 })
const websocket2 = new WebSocket.Server({ port: 443 })

websocket.on("connection", ws => {
    console.log('connected to ws')

    //connecting to ground tcp station string
    if (connect === 0) {
        client.connect(8000, '127.0.0.1', () => {
            console.log('Connected')
        })
        connect += 1
    }



    client.on('data', async (data) => {

        let dataString = data.toString()
        dataString = dataString.replace("[", "")
        dataString = dataString.replace("]", "")
        newEpoch = util.stringConverter(dataString)[0]

        //comparing if duplicate date
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

        ws.close(() => {
            console.log("disconnected")
        })
        //client.destroy()
    })
})

//satellite 2 connection from client
websocket2.on("connection", ws => {
    console.log('connected to ws2')

    //connecting to ground station binary
    if (connect2 === 0) {
        client2.connect(8001, '127.0.0.1', () => {
            console.log('Connected')
        })
        connect2 += 1
    }

    client2.on('data', async (data) => {

        let dataString = util.stringBuilder(data)
        newEpoch = util.stringConverter(dataString)[0]


        if (epoch !== newEpoch) {

            try {
                const satelliteTwo = await new SatelliteTwo(dbName)
                await satelliteTwo.storeData(dataString)
            }
            catch (err) {
                console.log(err)
            }
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

module.exports = app