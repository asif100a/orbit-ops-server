import express from 'express'
import expressSession from 'express-session'

const app = express()

app.use(expressSession({
    secret:,
    resave: false,
    saveUninitialized: false
}))