redis = require('redis')
const client = require('./client')
const express = require('express')
const readR = require('./readR')
const writeR = require('./writeR')
const app = new express()
const port = 3000


app.get('/', (req, res) => {

    res.send('HomeRoute for Redis app')
})

app.get('/read/:key', (req, res) => {
    const _key = req.params.key
    readR(client, _key, (error, reply) => {
        if (error) {
            console.log(error)
            res.status(400).send(error)
        }
        res.send(reply)
    })
})

app.post('/write', (req, res) => {
    let body = ''
    req.on('data', (chunk) => {
        body += chunk.toString()
    })

    req.on('end', () => {
        const parsedData = JSON.parse(body.toString())
        writeR(client, parsedData, (error, result) => {
            if (error) {
                console.log(error)
                res.status(400).send(error)
            }
            res.send(result)
        })

    })
})

app.listen(port, () => { console.log('Server is up at', port) })