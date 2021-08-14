//const express = require('express')
//const app = express()
//const router = express.Router()
//const path = require('path')



//router.get('*', (req, res)=>{
    //res.sendFile(path.resolve(__dirname, './client', 'index.html'))
//})

//module.exports = router
const express = require('express')
const router = express.Router()

router.get('/', (req, res)=>{
    res.send('server is running')
})

module.exports = router