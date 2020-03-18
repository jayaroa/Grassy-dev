const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const env = require('../../env');
const AutogenerateIdcontroller = require('./AutogenerateId')
// const PERMISSION = {
//   publicread: {
//     'x-amz-acl': 'public-read'
//   }
// }

// const bucket = new S3({
//   accessKeyId: 'AKIAIKFVJ277B2L26HCQ',
//   secretAccessKey: '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',
//   region: 'us-east-2'
// });
// const s3 = new aws.S3({
//   accessKeyId: env.accessKeyId,
//   secretAccessKey: env.secretAccessKey,
//   region: env.region,
// });





const Base64ImgUploadmodule= {
    Base64ImgUpload:(request,callback)=>{
        let fldrName=request.fldrName;
        var type1 = request.imgName+"_";
        let autouserid;
        AutogenerateIdcontroller.autogenerateId(type1, (err, data) => {
            autouserid = data;
        })
        console.log('key from environment',env.secretAccessKey)
        console.log('id from environment',env.accessKeyId)
        console.log('region from environment',env.region)
        buf = new Buffer(request.picture.replace(/^data:image\/\w+;base64,/, ""),'base64')
        console.log(buf)
        const type = request.picture.split(';')[0].split('/')[1];
        
        console.log("...",type)
        // aws.config.update({
        //    secretAccessKey: env.secretAccessKey,
        //    accessKeyId: env.accessKeyId,
        //    region: env.region, // region of your bucket
           
        // });
        // const s3 = new aws.S3();


        let bucketName = 'picnic-assets/'+ fldrName;

        // Create a promise on S3 service object
        // var bucketPromise = new aws.S3({apiVersion: '2006-03-01'}).createBucket({Bucket: bucketName}).promise();

        const s3 = new aws.S3({
          accessKeyId: env.accessKeyId,
          secretAccessKey: env.secretAccessKey,
          region: env.region,
        });
        //autouserid+`${type1}`
        var params = {
            ACL: 'public-read',
            Bucket: bucketName, 
            Key: autouserid+'.'+request.fileextension,            
            Body: buf,
            ContentEncoding: 'base64',
            ContentType: `image/${type}`            
          };
          s3.putObject(params, function(err, data){
              if (err) { 
                console.log("ooooooooo",err)
                callback(err,null)
              } else {
                let imageUrl="https://s3.us-east-2.amazonaws.com/picnic-assets/"+fldrName+"/"+autouserid+"."+request.fileextension;
                callback(null,imageUrl.toString())
            }
          });


          /////////////////////////////////////////////////////////

         


     }
}

module.exports = Base64ImgUploadmodule;
