const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

// localhost connection 
// mongoose.connect('mongodb://localhost:27017/Picnic',{
//     useNewUrlParser:true
// })


//aws connection
mongoose.connect('mongodb://appuser:-f%25u=G6234G%258_90izk@54.76.185.237:27017/picnic',{
    useNewUrlParser:true
})



const userRoute = require('./endpoints/user');
const adminRoute = require('./endpoints/admin');
const cityadminRoute = require('./endpoints/cityadmin');
// const optionRoute = require('./endpoints/option');





/**
 *  ROUTES -  ROOT LEVEL
 */
router.use("/user",userRoute)
router.use("/admin",adminRoute)
router.use("/cityadmin",cityadminRoute)
// router.use("/option",optionRoute)


module.exports = router
