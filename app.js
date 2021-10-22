const express = require('express')
const app = express();
const session = require('express-session')
const flash = require('connect-flash')
const router = require('./router')


let sessionOptions = session({
    secret: "II top specyxa",
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60, httpOnly: true}
})

app.use(sessionOptions)
app.use(flash())

app.use('/', router)
app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use(express.static('public'))
app.set('views', 'views')
app.set('view engine', 'ejs')




app.listen(3000)
