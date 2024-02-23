import express, { json } from 'express';
import cors from 'cors';
import session from 'express-session'
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import postCategoryRoute from './routes/postCategoryRoute.js'
import userRoute from './routes/userRoute.js'
import authRoute from './routes/authRoute.js'
import postRoute from './routes/postRoute.js'

dotenv.config()

const app = express();
const port = process.env.APP_PORT


app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: 'auto'
    }
}));

app.use(cors({
    Credential: true,
    origin: 'http://localhost:3000'
}));

app.use(express.json());
app.use(fileUpload());
app.use(express.static("public"));
app.use(postCategoryRoute);
app.use(userRoute);
app.use(authRoute);
app.use(postRoute);


app.listen(port, ()=>{
    console.log('App running on port',port);
})