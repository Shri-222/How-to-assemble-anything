
import mongoose from "mongoose";
import 'dotenv/config';

const MONGO_URL = process.env.MONGO_URL;

export const DBConnect = async () => {

    try {

        await mongoose.connect(MONGO_URL);

        console.log('Mongoose Connected Successfully');
        
    } catch (error) {
        
        console.log('Mongoose Connection Filed', error );
        process.exit(1);
    }
}