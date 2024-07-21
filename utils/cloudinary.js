// import {v2 as cloudinary} from "cloudinary"s
import {CloudinaryStorage} from 'multer-storage-cloudinary'
import dotenv from "dotenv"
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
dotenv.config() 
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile-images', // Specify the folder name in Cloudinary
  // supports promises as well
    public_id: (req, file) => `image_${Date.now()}`
  },
});

export const upload = multer({ storage: storage });
