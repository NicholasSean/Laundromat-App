const fs = require('fs')

function readDb(dbName = 'db.json') {
    // rread JSON object from file
    const data = fs.readFileSync(dbName, 'utf8')
    return JSON.parse(data)
}

function writeDb(obj, dbName = 'db.json') {
    if (!obj) return console.log('Please provide data to save')
    try {
        fs.writeFileSync(dbName, JSON.stringify(obj))
        return console.log('SAVE SUCCESS')
    } catch (err) {
        return console.log('FAILED TO SAVE')
    }
}


module.exports = { readDb, writeDb}