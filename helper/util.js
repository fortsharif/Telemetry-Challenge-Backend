module.exports = stringConverter = (data) => {
    data = data.replace("[", "")
    data = data.replace("]", "")

    let newData = data.split(":")

    return newData

}

