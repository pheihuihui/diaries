const express = require('express')
const app = express()
app.use('/diaries', express.static('dist'))
app.listen(3000)