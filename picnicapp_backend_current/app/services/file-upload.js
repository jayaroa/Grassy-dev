// const KEY = 'AKIAI3Q34TYEXRXCY6XA';
// const SECRET = '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';
// const BUCKET = 'cheasy';
// const PERMISSION = {
//   publicread: {
//     'x-amz-acl': 'public-read'
//   }
// }

module.exports = {
  upload: (files) => {

    return new Promise((resolve, reject) => {
      files.upload({
        adapter: require('skipper-s3'),
        key: KEY,
        secret: SECRET,
        bucket: BUCKET,
        headers: PERMISSION.publicread
      }, function (err, filesUploaded) {
        if (err) reject(err);
        resolve(filesUploaded);
      });
    });

  },
  remove: (url) => {
    return new Promise((resolve, reject) => {
      var skipper = require('skipper-s3')({
        key: KEY,
        secret: SECRET,
        bucket: BUCKET
      });
      skipper.rm(url, function (err, data) {
        if (err) reject(err);
        resolve(data)
      });
    })
  }
}


