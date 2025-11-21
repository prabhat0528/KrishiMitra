const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

//  Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//  Storage for IMAGES 
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const originalName = file.originalname;
    const filename =
      originalName.substring(0, originalName.lastIndexOf(".")) || "image";
    const extension = originalName.split(".").pop();

    return {
      folder: "KrishiMitra",              
      resource_type: "image",              
      public_id: `${filename}-${Date.now()}`, 
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [
        { width: 800, height: 800, crop: "limit" }
      ],
      access_mode: "public",
    };
  },
});


const uploadImage = multer({ storage: imageStorage });

module.exports = {
  uploadImage,
};
