
import Cloudinary from 'cloudinary'
import 'dotenv/config'

export default async function cloudinaryConnect() {
    
    try {

        Cloudinary.config(
            {
                cloud_name : process.env.CLOUDINARY_NAME,
                api_url : process.env.CLOUDINARY_URL,
                api_secret : process.env.API_SECRET,
                secure : true
            }
        );
        
    } catch (error) {
        
        console.log('Error while Connecting to cloudinary ', error)

    }

}