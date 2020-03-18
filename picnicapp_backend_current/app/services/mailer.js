const nodemailer = require('nodemailer');

module.exports = {
  viaGmail: (data,callback) => {
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'grassyapp4@gmail.com',
        pass: 'grassyparks'
      }
    }); 

    const mailoption = {
      from: 'Grassy<grassyapp4@gmail.com>',
      to: data.receiver,
      subject: data.subject,
      text: 'Hello,',
      html: data.message
    };

    transporter.sendMail(mailoption, (err, info) => {
      if (err) {
        console.log(err)
        callback(err,null)
      } else {
        callback(null,info)
      }
    });

  }
 
}