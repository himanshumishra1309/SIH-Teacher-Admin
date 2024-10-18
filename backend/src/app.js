import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: '60mb'}));

app.use(express.urlencoded({extended: true, limit:'16kb'}));

app.use(express.static('public'));

app.use(cookieParser());


import teacherRouter from './routes/teachers.routes.js'
import adminRouter from './routes/admins.routes.js'

app.use('/api/v1/teachers', teacherRouter)
app.use('/api/v1/admins', adminRouter)


export {app}