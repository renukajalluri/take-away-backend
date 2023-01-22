const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const authRouter = require('./controllers/auth')
const userRouter = require('./controllers/user')
const menuRouter = require('./controllers/menu')
const orderRouter = require("./controllers/order")

mongoose.connect(config.MONGODB_URL,{
    useNewUrlParser:true,
}).then(()=>logger.info('DB connected Sucessfully'))
    .catch(err => logger.error('DB connection failed: ',err))

app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))
app.use(bodyParser.json({ limit: "50mb" }))
app.use(cors())
app.use(express.static('public'))
// app.use(express.json())
app.use(middleware.requestLogger)

// Routers
app.use('/auth',authRouter)
app.use('/restaurant',userRouter)
app.use('/menu',menuRouter)
app.use("/order",orderRouter)
app.get('/ping', function (req, res) {
    // console.log(req.body)
    res.send('welcome!');
  });

module.exports = app