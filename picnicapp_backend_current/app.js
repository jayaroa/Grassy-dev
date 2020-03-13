const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const _linker = require('./app/index');

//=============================
// Added By Ankur
var cors = require('cors');
//=============================

const app = express();

//=========================
// Added By Ankur
app.use(cors());
//=========================



app.use(morgan('dev'));
app.use(express.static('uploads')); //with base url and file name
// app.use('/uploads', express.static('uploads')); //in url we can put uploads/
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());



app.use((req,res,next) => {
    res.header("Access-Control-Allow-Origin" , "*");
    res.header("Access-Control-Allow-Headers" , "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    // res.header("Access-Control-Allow-Headers" , "*");
    if(req.method === 'OPTIONS'){
        res.header("Access-Control-Allow-Methods" , "PUT, POST, PATCH, DELETE, GET");     
        return res.status(200).json({});   
    }
    next();
})

app.use('/', _linker);

app.use((error,req,res,next) => {
    // const error = new Error('Not Found');
    error.status = error && error.status ? error.status : 404;
    error.message = error && error.message ? error.message : 'Not Found';
    
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error:{
            message : error.message
        }
    });
})

module.exports = app;  