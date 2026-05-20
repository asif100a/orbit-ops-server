import express, { type Request, type Response } from 'express'
import expressSession from 'express-session'
import { envConfig } from './app/config/env'
import cors from 'cors'
import router from './app/routes';

const app = express()

app.use(expressSession({
    secret: envConfig.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(express.json())
app.use(cors())

app.use('/api/v1', router)

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: 'Welcome to the OrbitOps server'
    })
})

export default app;