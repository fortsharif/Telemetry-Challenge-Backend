const sqlite = require('sqlite-async')
const util = require('../helper/util')

module.exports = class SatelliteOne {
    constructor(dbName = ':memory:') {
        return (async () => {
            this.db = await sqlite.open(dbName)
            // creating satellite-1 table
            const sql = 'CREATE TABLE IF NOT EXISTS "SatelliteTwo" ("Id" INTEGER PRIMARY KEY AUTOINCREMENT, "UnixTimestamp" TEXT, "TelemetryId" TEXT, "Value" TEXT )'
            await this.db.run(sql)
            return this
        })()
    }

    async storeData(data) {
        //converting data to store into database
        try {
            if (typeof (data) == "string") {

                const newData = util.stringConverter(data)
                let UnixTimestamp = newData[0]
                let TelemetryId = newData[1]
                let Value = newData[2]
                let sql = `INSERT INTO SatelliteTwo(UnixTimestamp, TelemetryId, Value) VALUES('${UnixTimestamp}', '${TelemetryId}', '${Value}')`
                await this.db.run(sql)
                return true
            }
        } catch (err) {
            throw err
        }
    }

    async getData(unixTimestamp, timeDeduction) {
        try {
            let time = unixTimestamp - timeDeduction
            let sql = `SELECT DISTINCT *
FROM (
    SELECT *, ROW_NUMBER() OVER(PARTITION BY UnixTimestamp ORDER BY Id) rn
    FROM SatelliteTwo
) x
WHERE rn = 1 AND UnixTimestamp >= ${time}`
            const data = await this.db.all(sql)
            return data
        } catch (err) {
            throw err
        }

    }

    async getAll() {
        try {

            let sql = `SELECT * FROM SatelliteTwo`

            const data = await this.db.all(sql)

            return data
        } catch (err) {
            throw err
        }
    }
}