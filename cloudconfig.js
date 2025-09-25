const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Cloudinary config (replace with your credentials)
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY ,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'TravelGO_DEV',
    allowedformats: ["png","jpeg","jpg"], 
    public_id: (req, file) => 'computed-filename-using-request', 
  },
});

const upload = multer({ storage: storage });

module.exports = {
  cloudinary,
  storage,
  upload
};
