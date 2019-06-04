const express = require('express')
require('./db/connect')
const cookieparser = require('cookie-parser')
const bodyParser = require('body-parser')
const taskRouter = require('./router/tasks')
const userRouter = require('./router/users')
const boom = require('express-boom')


const hbs = require('hbs')
const app = express()
const port = process.env.PORT || 3000
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cookieparser())
app.use(boom())
app.set('view engine', 'hbs')
hbs.registerPartials('/home/internnum5/Node stuff/better-task-api/views/partials')
app.use(express.static('/home/internnum5/Node stuff/better-task-api/public'))

app.use(express.json())
app.use(taskRouter)
app.use(userRouter)

app.get('', (req, res) => {
    res.render('login')
})

app.get('/signup', (req, res) => {
    res.render('signup')
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})