const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');


function s3( fileName ) {

var s3 = new AWS.S3();
//var filePath = "../../dms/web/static/avatar.png";

//configuring parameters
var params = {
  Bucket: 'tailgate.images',
  Body : fs.createReadStream(fileName),
  Key : "folder/"+Date.now()+"_"+path.basename(fileName)
};

s3.upload(params, function (err, data) {
  //handle error
  if (err) {
    console.log("Error", err);
    throw err;
  }
  //success
  if (data) {
    console.log("Uploaded in:", data.Location);
    return data;
  }
});
}
module.exports  = s3;