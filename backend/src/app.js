const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
const port = 3001
app.use(express.json())

app.get('/', (req, res)=>{
    /*testando o json*/
    fs.readFile(path.resolve(__dirname, "./data/plans.json"), (err, data) =>{
        let plansData = data
        res.send(plansData)
    })
})

app.listen(port, ()=>{
    console.log(`servidor rodando, porta ${port}`)
})



