
import 'dotenv/config';
import app from './src/app.js';
import connectDB from './src/config/db.js';
import cloudinaryConnect from './src/config/cloudinary.js';

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    //connect to Cloudinary 
    await cloudinaryConnect();

    const PORT = process.env.PORT;

    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();