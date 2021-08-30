const sqlite = require('sqlite-async')
const stringConverter = require('../helper/util')

module.exports = class SatelliteOne {
    constructor(dbName = ':memory:') {
        return (async () => {
            this.db = await sqlite.open(dbName)
            // creating satellite-1 table
            const sql = 'CREATE TABLE IF NOT EXISTS "SatelliteOne" ("Id" INTEGER PRIMARY KEY AUTOINCREMENT, "UnixTimestamp" TEXT, "TelemetryId" TEXT, "Value" TEXT )'
            await this.db.run(sql)
        })()
    }

    async storeData(data) {
        //converting data to store into database
        try {
            const newData = stringConverter(data)
            let UnixTimestamp = newData[0]
            let TelemetryId = newData[1]
            let Value = newData[2]
            let sql = `INSERT INTO SatelliteOne(UnixTimestamp, TelemtryId, Value) VALUES('${UnixTimestamp}', '${TelemetryId}', '${Value}')`
            await this.db.run(sql)
        } catch (err) {
            throw err
        }
    }
}