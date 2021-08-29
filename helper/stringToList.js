

module.exports = stringConverter = (data) => {
    data = data.replace("[", "")
    data = data.replace("]", "")

    const newData = data.split(":")

    return newData

}
