const jwt = require('jsonwebtoken');
const jwtconf = require('../config/globals/keyfile')
// const jwtconf = require('../../../../env');
// const Driver = require('../models/driver')
const User = require('../models/user');
// const Company = require('../models/company')
const token_gen = require('../../../services/jwt_token_generator');



module.exports = async (req,res,next) => {
    const token = req.headers.authorization && req.headers.authorization != '' ? req.headers.authorization.split(" ")[1]:res.json({
        message : 'Improper Authorization Token',
        returnData : req.headers.authorization,
        statuscode : 214,
    });
    try{
        // console.log("printing fromn here ++++++++++++++++++++1")
        const decoded = jwt.verify(token, jwtconf.secret.d); 
        /**
         * If verification is successfull then check wheather 
         * the payload(userId) is correct, and process accordingly
         */
        // console.log("printing fromn here ++++++++++++++++++++2",decoded)

       
        req.userData = decoded;   
        
        // console.log("printing fromn here ++++++++++++++++++++")
       
        let uId = req.userData.userId;
        let uExists='';
        let usrCheck = uId.substring(0, 3);

        // if(usrCheck === 'USR'){
        //     await User.findOne({userId :uId},function (err, item) {
        //         uExists = item               
        //     })
        // } 
        
        if(uExists == null){
            res.json({message : 'User not registered',statuscode : 403})
        }
        else{
            let currentTimeStamp = Math.round((new Date()).getTime() / 1000);
            decoded.exp <= currentTimeStamp ? res.json({
                message : 'Session expired',
                token :  token_gen({
                    ...decoded
                })
            }) : next();
        }
      

    }catch(error){
        /**
         * If error then check the type of error
         * if error type is TokenExpiredError : send new token 
         * else if error type is JsonWebTokenError : send error
         */

        if(error.name.toString()=='TokenExpiredError'){
            //send new token as previous token expired
            // retrive previous token expression
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            let prevPayload = JSON.parse(Buffer.from(base64, 'base64').toString('binary'));
            //create new token with previous payload
            const newToken = token_gen({
                'mobile': prevPayload.mobile,
                'userId' : prevPayload.userId
            });

            res.json({
                message : 'Session expired',
                errorType : error.message,
                statuscode : 213,
                token :  newToken
            })
        }
        else if(error.name.toString()=='JsonWebTokenError'){
            // send error response
            res.json({
                isError : true,
                message : 'Auth Failed',
                errorType : error.message,
                statuscode : 403
            });
        }


        
    }
    
}