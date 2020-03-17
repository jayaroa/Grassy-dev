// //npm install twilio
// var accountSid = ''; // Your Account SID from www.twilio.com/console
// var authToken = '';   // Your Auth Token from www.twilio.com/console
// var twilio = require('twilio');
// var client = new twilio(accountSid, authToken);
// const TwilioSmsModule= {
//     Sendsms:(request,code,callback)=>{
//         console.log('in',code)
//         var code = code.toString().substring(0,6)
        
//         client.messages.create(
//             {
//                 body: code,
//                 to: request,  // Text this number (number contains country code)
//                 from: '' // From a valid Twilio number
//             },
//             (err, message) => {
//                 if(err){
//                callback(err,null)
//                 }
//                 callback(null,message)
//                console.log(message)
//             });
     
//         },
//     }

// module.exports = TwilioSmsModule;

