
import mongoose from "mongoose";

export default async function DBConnect() {
    
    try {
        
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

    } catch (error) {
        
        console.log('Error While connecting to DataBase -', error);
        process.exit(1)
    }
}