const stringConverter = function (data) {
    data = data.replace("[", "")
    data = data.replace("]", "")

    let newData = data.split(":")

    return newData

}

const stringBuilder = function (data) {
    let dataArray = []
    let string = data.readBigInt64LE(4).toString(16)
    let date = parseInt(string, 16)
    console.log(date)
    string = data.readUInt16LE(12).toString(16)
    let telemetryId = parseInt(string, 16)
    console.log(telemetryId)
    string = data.readFloatLE(14).toString(16)
    let value = parseInt(string, 16)

    dataArray.push(date.toString())
    dataArray.push(telemetryId.toString())
    dataArray.push(value.toString())


    let dataString = dataArray.join(':')

    return dataString

}

module.exports = { stringConverter, stringBuilder }
