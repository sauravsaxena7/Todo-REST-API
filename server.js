const express = require('express');
const colors = require('colors');

const morgan = require('morgan');

const dotenv = require('dotenv')

const connectDB = require('./config/db');
const e = require('express');

const app=express();


// app.use((req,res,next)=>{
//     console.log("middle run");
//     req.title = "pradhan";
//     next();
// });

app.use(morgan('dev'));

app.use(express.json({}));

app.use(express.json({
    extended:true
}))

dotenv.config({
    path: "./config/config.env"
});

connectDB();

//https://localhost:3000/todo/api/auth/resister/

app.use('/api/todo/auth',require('./routes/user'))

const PORT = process.env.PORT || 3000;


app.get('/todo',(req,res)=>{
    res.status(200).json({
        "name":"saurav"
    });
});

app.listen(PORT,'0.0.0.0',console.log(`server is running on ${PORT}`.red.underline.bold))