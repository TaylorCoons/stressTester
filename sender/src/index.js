const WebSocket = require('ws')
const fs = require('fs')
const config = require('./config')

const ws = new WebSocket('ws://localhost:9090')

const delayTime = config.delayTime || 0

const delay = (ms) => {
    return new Promise((resolve) => { setTimeout(resolve, ms) })
}

ws.on('open', function open() {
    const fileName = 'test.txt'
    fs.readFile(`${__dirname}/${fileName}`, (err, file) => {
        (async () => {     
            if (err) {
                throw err
            }
            const lines = file.toString().split('\n')
            let lineCount = 0
            console.log('Starting Send')
            const startTime = Date.now()
            for (const line of lines) {
                ws.send(line)
                if (delayTime != 0) {
                    await delay(delayTime)
                }
                lineCount = lineCount + 1
            } 
            const endTime = Date.now()
            console.log('Finish send')
            console.log(`Elapsed Time: ${endTime - startTime}`)
            console.log(`Sent lines: ${lineCount}`)
            ws.close()
        })()
    }) 
})

ws.on('message', function incoming(data) {
    console.log(data);
});