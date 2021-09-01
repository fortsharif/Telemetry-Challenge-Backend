const app = require('../index.js')

// URI to get all-time data for sat 1
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

// URI to get hour data for sat 1
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

// URI to get day data for sat 1
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

// URI to get week data for sat 1
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

// URI to get minute data for sat 1
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