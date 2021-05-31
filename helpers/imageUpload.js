const {cloudinary} = require('./cloudinary_config');

const streamifier = require('streamifier');
 async  function uploadImage(path) {
     return new Promise((resolve, reject) => {
         let stream = cloudinary.uploader.upload_stream(
             {
                         upload_preset:'enkryptDocs'},
             (error, result) => {
                 if (result) {
                     resolve(result);
                 } else {
                     reject(error);
                 }
             }
         );

         streamifier.createReadStream(path.data).pipe(stream);
     });
}

function getImage(){

}

module.exports = {
    uploadImage,
    getImage
}