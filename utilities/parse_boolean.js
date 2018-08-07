parseBoolean = (string) => {
    if(string === 'true')
    return true
    else if(string === 'false')
    return false
    else if(string === true)
    return true
    else if(string === false)
    return false
    else return false
}


module.exports = { parseBoolean }