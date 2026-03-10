
import cloudinary from 'cloudinary';

export default async function UploadImageToCloudinary( { file, folder, height, quality } ) {
    
    try {
        
        const options = { folder };

        if ( height || quality ) { 
            options.transformation = [];

            if ( height ) options.transformation.push({ height, crop : 'scale' });

            if ( quality ) options.transformation.push({ quality });
        }

        const upload = await cloudinary.uploader.upload(file.tempfilePath, options);

        return upload;

    } catch (error) {
        console.error('Error while Uploading the Documents to Cloudinary ', error)
    }
}