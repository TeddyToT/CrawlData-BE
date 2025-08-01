const express = require("express") 
const app = express()
const cors = require("cors");
const requestLogger = require("./middlewares/requestLogger")
const errorLogger = require("./middlewares/errorLogger");
const { swaggerUiMiddleware, swaggerUiHandler } = require("./docs/swagger")

require('dotenv').config()

app.use(express.json())
app.use(requestLogger)
app.use(express.urlencoded({extended: true}))
app.use(cors())
require("./providers/pg")

app.use('/', require('./router'))
app.use('/api-docs', swaggerUiMiddleware, swaggerUiHandler);

app.use(errorLogger);
require("./utils/schedule")
  




module.exports = app
