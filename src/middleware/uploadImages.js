const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_FILE_SIZE = 2 * 1024 * 1024; 

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'products',
        format: async (req, file) => {
            return file.mimetype.split('/')[1];
        },
        public_id: (req, file) => {
            return file.originalname.split('.')[0];
        },
    },
});

const fileFilter = (req, file, cb) => {
    if (file.size > MAX_FILE_SIZE) {
        cb(new Error('File size exceeds 2 MB'), false); 
    } else {
        cb(null, true); 
    }
};

const upload = multer({ 
    storage, 
    limits: { fileSize: MAX_FILE_SIZE }, 
    fileFilter 
}).array('images', 5); 

const uploadMiddleware = (req, res, next) => {
    upload(req, res, (err) => { 
        if (err) {
            console.error('Upload error:', err); 
            return res.status(400).json({ error: err.message});
        }
        next(); 
    });
};

module.exports = uploadMiddleware;
