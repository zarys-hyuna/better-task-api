const express = require('express')
require('./db/connect')

const taskRouter = require('./router/tasks')
const hbs = require('hbs')
const app = express()
const port = process.env.PORT || 3000

app.set('view engine', 'hbs')
hbs.registerPartials('/home/internnum5/Node stuff/Task-api/views/partials')
app.use(express.static('/home/internnum5/Node stuff/Task-api/public'))

app.use(express.json())
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})