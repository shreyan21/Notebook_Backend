import {v2 as cloudinary} from "cloudinary"

import dotenv from "dotenv"
import fs from "fs"

dotenv.config() 
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})



const uploadToCloudinary = async (localfilepath) => {

    try {
      if (!localfilepath) {
        return null
      }
      const res = await cloudinary.uploader
        .upload(
          localfilepath, {
          resource_type: "auto"
        },
        )
      fs.unlinkSync(localfilepath)
      return res
    }
    catch (e) {
  
      fs.unlinkSync(localfilepath)
      return null
    }
  
  }

  export {uploadToCloudinary}