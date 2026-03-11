import 'dotenv/config';
import {v2 as cloudinary } from 'cloudinary';

export default async function cloudinaryConnect() {

    try {

        cloudinary.config(
            {
                cloud_name : process.env.CLOUDINARY_NAME,
                api_key : process.env.CLOUDINARY_API_KEY,
                api_secret : process.env.CLOUDINARY_API_SECRET,
                secure : true
            }
        );

        console.log("Connected to Cloudinary ")
        
    } catch (error) {
        
        console.log('Error while Connecting to cloudinary ', error)

    }

}