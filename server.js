const express = require('express')
require('dotenv').config()
const dbConnect = require('./src/config/dbconnect')
const initRoutes = require('./src/routes')
const cookieParser = require('cookie-parser')
const cors = require('cors')


const app = express()
app.use(cookieParser())
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))
const port = process.env.PORT || 8888
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
dbConnect()
initRoutes(app)
app.use('/', (req, res, next) => {
    res.send(`Server running on the port ${port}`)
})

app.listen(port, () => {
    console.log('Server running on the port: ' + port);
})