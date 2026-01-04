const cloudinary = require('cloudinary')
cloudinary.config({ 
    cloud_name: 'dz8yzkyv0', 
    api_key: '818553414289415', 
    api_secret: 'gOFlizpmykc7Sbe5se9CsAfLlDI' 
});

const cloudinaryUploadImg = async (fileToUploads) => {
    return new Promise((resolve)=> {
        cloudinary.UploadStream.upload(fileToUploads,(result) =>{
            resolve(
                {
                    url : result.secure_url,
                },
                {
                    resource_type : "auto"
                }
            )
        })
    })
}
module.exports = cloudinaryUploadImg