
import mongoose from "mongoose";
import 'dotenv/config'

export default async function DBConnect() {
    
    try {
        
        await mongoose.connect(process.env.MONGO_URL);

        console.log('Connected Successfully ')

    } catch (error) {
        
        console.log('Error While connecting to DataBase -', error);
        process.exit(1)
    }
}